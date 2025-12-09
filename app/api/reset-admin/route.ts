import { NextRequest, NextResponse } from 'next/server'

export async function POST() {
  try {
    console.log('🔄 Redefinindo senha do admin...')
    
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@inova.ma'
    const newPassword = process.env.ADMIN_PASSWORD || 'Inova@2025#Admin'
    
    console.log('📧 Email:', adminEmail)
    console.log('🔑 Nova senha configurada:', !!newPassword)
    
    // Importar módulos dinamicamente
    const { PrismaClient } = await import('@prisma/client')
    const bcrypt = await import('bcryptjs')
    
    const prisma = new PrismaClient()
    
    // Conectar ao banco
    await prisma.$connect()
    console.log('✅ Conectado ao banco')
    
    // Buscar o usuário admin
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    })
    
    if (!existingAdmin) {
      console.log('❌ Admin não encontrado, criando novo...')
      
      // Criar novo admin
      const hashedPassword = await bcrypt.hash(newPassword, 12)
      const newAdmin = await prisma.user.create({
        data: {
          email: adminEmail,
          name: process.env.ADMIN_NAME || 'Administrador',
          password: hashedPassword,
          role: 'ADMIN',
          active: true
        }
      })
      
      await prisma.$disconnect()
      
      return NextResponse.json({
        success: true,
        message: 'Admin criado com nova senha',
        admin: {
          email: newAdmin.email,
          name: newAdmin.name,
          role: newAdmin.role
        },
        password: newPassword
      })
    }
    
    // Atualizar senha do admin existente
    console.log('🔄 Atualizando senha do admin existente...')
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    
    const updatedAdmin = await prisma.user.update({
      where: { email: adminEmail },
      data: { 
        password: hashedPassword,
        name: process.env.ADMIN_NAME || 'Administrador'
      }
    })
    
    console.log('✅ Senha atualizada com sucesso')
    await prisma.$disconnect()
    
    return NextResponse.json({
      success: true,
      message: 'Senha do admin redefinida com sucesso',
      admin: {
        email: updatedAdmin.email,
        name: updatedAdmin.name,
        role: updatedAdmin.role
      },
      password: newPassword
    })

  } catch (error) {
    console.error('❌ Erro ao redefinir senha:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : null
    }, { status: 500 })
  }
}