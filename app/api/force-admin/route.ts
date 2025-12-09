import { NextRequest, NextResponse } from 'next/server'

export async function POST() {
  try {
    console.log('🔧 Iniciando criação forçada de admin...')
    
    // Verificar se temos as variáveis necessárias
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@iniva.ma'
    const adminName = process.env.ADMIN_NAME || 'Administrador'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
    
    console.log('📧 Email:', adminEmail)
    console.log('👤 Nome:', adminName)
    console.log('🔑 Senha configurada:', !!adminPassword)
    
    // Importar módulos dinamicamente para evitar erros de conexão
    const { PrismaClient } = await import('@prisma/client')
    const bcrypt = await import('bcryptjs')
    
    console.log('📦 Módulos importados com sucesso')
    
    const prisma = new PrismaClient()
    
    console.log('🗄️ Tentando conectar ao banco...')
    
    // Tentar uma operação simples primeiro
    await prisma.$connect()
    console.log('✅ Conexão com banco estabelecida')
    
    // Verificar usuários existentes
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail }
    })
    
    if (existingUser) {
      console.log('👤 Usuário já existe:', existingUser.email)
      await prisma.$disconnect()
      return NextResponse.json({
        success: true,
        message: 'Admin já existe',
        admin: {
          email: existingUser.email,
          name: existingUser.name,
          role: existingUser.role
        }
      })
    }
    
    // Criar hash da senha
    console.log('🔐 Criando hash da senha...')
    const hashedPassword = await bcrypt.hash(adminPassword, 12)
    console.log('✅ Hash criado')
    
    // Criar usuário admin
    console.log('👤 Criando usuário admin...')
    const newAdmin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: adminName,
        password: hashedPassword,
        role: 'ADMIN',
        active: true
      }
    })
    
    console.log('✅ Admin criado:', newAdmin.email)
    await prisma.$disconnect()
    
    return NextResponse.json({
      success: true,
      message: 'Admin criado com sucesso via API',
      admin: {
        email: newAdmin.email,
        name: newAdmin.name,
        role: newAdmin.role,
        id: newAdmin.id
      },
      password_hint: adminPassword
    })

  } catch (error) {
    console.error('❌ Erro na criação forçada:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : null
    }, { status: 500 })
  }
}