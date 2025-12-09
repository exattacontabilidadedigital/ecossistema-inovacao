import { NextRequest, NextResponse } from 'next/server'

export async function POST() {
  try {
    console.log('🔧 FORÇA BRUTA: Criando banco do zero...')
    
    // Importar sqlite3 diretamente se disponível, senão usar Prisma raw
    const { PrismaClient } = await import('@prisma/client')
    const bcrypt = await import('bcryptjs')
    const crypto = await import('crypto')
    
    const prisma = new PrismaClient()
    
    try {
      await prisma.$connect()
      console.log('✅ Conectado ao SQLite')
      
      // Criar todas as tabelas na ordem correta
      console.log('📋 Criando tabela User...')
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "User" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "email" TEXT NOT NULL UNIQUE,
          "name" TEXT NOT NULL,
          "password" TEXT NOT NULL,
          "role" TEXT NOT NULL DEFAULT 'EDITOR',
          "active" BOOLEAN NOT NULL DEFAULT 1,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `)
      
      console.log('📋 Criando tabela Hub...')
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
      
      console.log('📋 Criando tabela Actor...')
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
      
      console.log('📋 Criando tabela Contact...')
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Contact" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "name" TEXT NOT NULL,
          "email" TEXT NOT NULL,
          "phone" TEXT,
          "subject" TEXT NOT NULL,
          "message" TEXT NOT NULL,
          "read" BOOLEAN NOT NULL DEFAULT 0,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `)
      
      console.log('📋 Criando tabela Category...')
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Category" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "name" TEXT NOT NULL UNIQUE,
          "slug" TEXT NOT NULL UNIQUE,
          "description" TEXT,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `)
      
      console.log('📋 Criando tabela Tag...')
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Tag" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "name" TEXT NOT NULL UNIQUE,
          "slug" TEXT NOT NULL UNIQUE,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `)
      
      console.log('📋 Criando tabela BlogPost...')
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "BlogPost" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "title" TEXT NOT NULL,
          "slug" TEXT NOT NULL UNIQUE,
          "excerpt" TEXT NOT NULL,
          "content" TEXT NOT NULL,
          "published" BOOLEAN NOT NULL DEFAULT 0,
          "featured" BOOLEAN NOT NULL DEFAULT 0,
          "image" TEXT,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "publishedAt" DATETIME,
          "authorId" TEXT NOT NULL,
          FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
        )
      `)
      
      console.log('📋 Criando tabelas de relacionamento...')
      
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "_BlogPostToCategory" (
          "A" TEXT NOT NULL,
          "B" TEXT NOT NULL,
          UNIQUE("A", "B"),
          FOREIGN KEY ("A") REFERENCES "BlogPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
          FOREIGN KEY ("B") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE
        )
      `)
      
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "_BlogPostToTag" (
          "A" TEXT NOT NULL,
          "B" TEXT NOT NULL,
          UNIQUE("A", "B"),
          FOREIGN KEY ("A") REFERENCES "BlogPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
          FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
        )
      `)
      
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Appointment" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "title" TEXT NOT NULL,
          "description" TEXT NOT NULL,
          "date" DATETIME NOT NULL,
          "location" TEXT NOT NULL,
          "type" TEXT NOT NULL,
          "status" TEXT NOT NULL DEFAULT 'AGENDADO',
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `)
      
      console.log('✅ Todas as tabelas criadas!')
      
      // Verificar se admin já existe
      console.log('🔍 Verificando admin existente...')
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@inova.ma'
      
      const existingAdmin = await prisma.$executeRawUnsafe(`
        SELECT * FROM "User" WHERE email = ?
      `, adminEmail)
      
      if (Array.isArray(existingAdmin) && existingAdmin.length > 0) {
        console.log('👤 Admin já existe')
        return NextResponse.json({
          success: true,
          message: 'Banco criado e admin já existe',
          admin: existingAdmin[0]
        })
      }
      
      // Criar admin
      console.log('👤 Criando admin...')
      const adminId = crypto.randomBytes(12).toString('hex')
      const adminName = process.env.ADMIN_NAME || 'Administrador'
      const adminPassword = process.env.ADMIN_PASSWORD || 'Inova@2025#Admin'
      const hashedPassword = await bcrypt.hash(adminPassword, 12)
      
      await prisma.$executeRawUnsafe(`
        INSERT INTO "User" (id, email, name, password, role, active, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, 'ADMIN', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, adminId, adminEmail, adminName, hashedPassword)
      
      console.log('✅ Admin criado com sucesso!')
      
      // Verificar criação
      const newAdmin = await prisma.$executeRawUnsafe(`
        SELECT id, email, name, role FROM "User" WHERE email = ?
      `, adminEmail)
      
      await prisma.$disconnect()
      
      return NextResponse.json({
        success: true,
        message: 'Banco de dados criado do zero e admin inserido!',
        admin: Array.isArray(newAdmin) ? newAdmin[0] : newAdmin,
        credentials: {
          email: adminEmail,
          password: adminPassword
        }
      })
      
    } catch (error) {
      console.error('❌ Erro na criação:', error)
      await prisma.$disconnect()
      throw error
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : null
    }, { status: 500 })
  }
}