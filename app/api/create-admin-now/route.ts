import { NextRequest, NextResponse } from 'next/server'

export async function POST() {
  try {
    console.log('👤 Criando admin direto...')
    
    const { PrismaClient } = await import('@prisma/client')
    const bcrypt = await import('bcryptjs')
    
    const prisma = new PrismaClient()
    await prisma.$connect()
    
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@inova.ma'
    const adminName = process.env.ADMIN_NAME || 'Administrador'
    const adminPassword = process.env.ADMIN_PASSWORD || 'Inova@2025#Admin'
    
    console.log('📧 Email:', adminEmail)
    console.log('👤 Nome:', adminName)
    
    // Verificar se já existe
    const existing = await prisma.user.findUnique({
      where: { email: adminEmail }
    })
    
    if (existing) {
      console.log('✅ Admin já existe')
      
      // Atualizar senha se necessário
      const hashedPassword = await bcrypt.hash(adminPassword, 12)
      const updated = await prisma.user.update({
        where: { email: adminEmail },
        data: {
          password: hashedPassword,
          name: adminName,
          role: 'ADMIN',
          active: true
        }
      })
      
      await prisma.$disconnect()
      
      return NextResponse.json({
        success: true,
        message: 'Admin atualizado',
        admin: {
          id: updated.id,
          email: updated.email,
          name: updated.name,
          role: updated.role
        },
        credentials: {
          email: adminEmail,
          password: adminPassword
        }
      })
    }
    
    // Criar novo admin
    const hashedPassword = await bcrypt.hash(adminPassword, 12)
    
    const admin = await prisma.user.create({
      data: {
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
      message: 'Admin criado com sucesso',
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
    console.error('❌ Erro:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()
    
    await prisma.$connect()
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
        createdAt: true
      }
    })
    
    await prisma.$disconnect()
    
    return NextResponse.json({
      success: true,
      users,
      total: users.length,
      environment: {
        ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'não definido',
        ADMIN_NAME: process.env.ADMIN_NAME || 'não definido',
        ADMIN_PASSWORD_SET: !!process.env.ADMIN_PASSWORD
      }
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}