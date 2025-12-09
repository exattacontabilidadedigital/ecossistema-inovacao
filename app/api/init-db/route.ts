import { NextRequest, NextResponse } from 'next/server'

export async function POST() {
  try {
    console.log('🔄 Inicializando banco de dados...')
    
    // Importar módulos dinamicamente
    const { PrismaClient } = await import('@prisma/client')
    const bcrypt = await import('bcryptjs')
    
    const prisma = new PrismaClient()
    
    console.log('📦 Conectando ao banco...')
    await prisma.$connect()
    
    console.log('🗄️ Executando db push para criar tabelas...')
    
    // Executar comandos para criar as tabelas
    try {
      // Tentar uma operação simples primeiro para ver se as tabelas existem
      await prisma.user.findFirst()
      console.log('✅ Tabelas já existem')
    } catch (error) {
      console.log('❌ Tabelas não existem, precisa executar migrações')
      
      // Vamos tentar executar o db push via processo
      const { execSync } = await import('child_process')
      
      try {
        console.log('🔧 Executando prisma db push...')
        execSync('npx prisma db push --force-reset', { 
          cwd: '/app',
          stdio: 'pipe',
          encoding: 'utf8'
        })
        console.log('✅ Tabelas criadas com sucesso')
      } catch (pushError) {
        console.log('❌ Erro no db push:', pushError)
        
        // Alternativa: criar tabelas manualmente via SQL
        console.log('🔧 Tentando criar tabelas via SQL...')
        
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "User" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "email" TEXT NOT NULL UNIQUE,
            "name" TEXT NOT NULL,
            "password" TEXT NOT NULL,
            "role" TEXT NOT NULL DEFAULT 'EDITOR',
            "active" BOOLEAN NOT NULL DEFAULT true,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `)
        
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "Hub" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "name" TEXT NOT NULL,
            "location" TEXT NOT NULL,
            "address" TEXT NOT NULL,
            "description" TEXT NOT NULL,
            "image" TEXT,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `)
        
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "Actor" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "name" TEXT NOT NULL,
            "type" TEXT NOT NULL,
            "description" TEXT NOT NULL,
            "contact" TEXT NOT NULL,
            "image" TEXT,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `)
        
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "BlogPost" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "title" TEXT NOT NULL,
            "slug" TEXT NOT NULL UNIQUE,
            "excerpt" TEXT NOT NULL,
            "content" TEXT NOT NULL,
            "published" BOOLEAN NOT NULL DEFAULT false,
            "featured" BOOLEAN NOT NULL DEFAULT false,
            "image" TEXT,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "publishedAt" DATETIME,
            "authorId" TEXT NOT NULL,
            FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
          )
        `)
        
        console.log('✅ Tabelas criadas via SQL')
      }
    }
    
    // Agora tentar criar o usuário admin
    console.log('👤 Criando usuário admin...')
    
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@inova.ma'
    const adminName = process.env.ADMIN_NAME || 'Administrador'
    const adminPassword = process.env.ADMIN_PASSWORD || 'Inova@2025#Admin'
    
    const hashedPassword = await bcrypt.hash(adminPassword, 12)
    
    // Gerar ID único
    const { randomBytes } = await import('crypto')
    const adminId = randomBytes(12).toString('hex')
    
    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        password: hashedPassword,
        name: adminName,
        role: 'ADMIN'
      },
      create: {
        id: adminId,
        email: adminEmail,
        name: adminName,
        password: hashedPassword,
        role: 'ADMIN',
        active: true
      }
    })
    
    console.log('✅ Admin criado/atualizado:', admin.email)
    await prisma.$disconnect()
    
    return NextResponse.json({
      success: true,
      message: 'Banco de dados inicializado e admin criado',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      },
      credentials: {
        email: adminEmail,
        password: adminPassword
      }
    })

  } catch (error) {
    console.error('❌ Erro na inicialização:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : null
    }, { status: 500 })
  }
}