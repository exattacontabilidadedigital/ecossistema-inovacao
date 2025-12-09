import { NextRequest, NextResponse } from 'next/server'

export async function POST() {
  try {
    console.log('💥 SUPER FORÇA: Criando banco básico...')
    
    const { PrismaClient } = await import('@prisma/client')
    const bcrypt = await import('bcryptjs')
    const crypto = await import('crypto')
    
    const prisma = new PrismaClient()
    
    try {
      await prisma.$connect()
      console.log('✅ Conectado ao SQLite')
      
      // Apenas criar a tabela User primeiro
      console.log('👤 Criando APENAS tabela User...')
      await prisma.$executeRaw`
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
      `
      
      console.log('✅ Tabela User criada!')
      
      // Criar admin usando Prisma normal agora que a tabela existe
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@inova.ma'
      const adminName = process.env.ADMIN_NAME || 'Administrador'
      const adminPassword = process.env.ADMIN_PASSWORD || 'Inova@2025#Admin'
      
      console.log('🔐 Criando hash da senha...')
      const hashedPassword = await bcrypt.hash(adminPassword, 12)
      
      console.log('👤 Inserindo admin via Prisma...')
      const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
          password: hashedPassword,
          name: adminName,
          role: 'ADMIN'
        },
        create: {
          email: adminEmail,
          name: adminName,
          password: hashedPassword,
          role: 'ADMIN',
          active: true
        }
      })
      
      console.log('✅ Admin criado:', admin.email)
      await prisma.$disconnect()
      
      return NextResponse.json({
        success: true,
        message: 'Banco básico criado e admin inserido!',
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        },
        credentials: {
          email: adminEmail,
          password: adminPassword
        },
        note: 'Apenas tabela User criada. Outras tabelas serão criadas conforme necessário.'
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