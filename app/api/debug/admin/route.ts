import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    console.log('🔍 Endpoint de debug chamado...')
    
    // Verificar se DATABASE_URL está configurada
    console.log('🗄️ DATABASE_URL:', process.env.DATABASE_URL ? 'Configurada' : 'NÃO CONFIGURADA')
    
    // Listar todos os usuários
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
        createdAt: true
      }
    })

    console.log('👥 Total de usuários:', allUsers.length)

    // Se não há usuários, tentar criar admin
    if (allUsers.length === 0) {
      console.log('🔧 Nenhum usuário encontrado, criando admin...')
      
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@iniva.ma'
      const adminName = process.env.ADMIN_NAME || 'Administrador'
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
      
      console.log('📧 Email do admin:', adminEmail)
      console.log('👤 Nome do admin:', adminName)
      
      const hashedPassword = await bcrypt.hash(adminPassword, 12)

      const newAdmin = await prisma.user.create({
        data: {
          email: adminEmail,
          name: adminName,
          password: hashedPassword,
          role: 'ADMIN',
          active: true
        }
      })

      console.log('✅ Admin criado via API:', newAdmin.email)

      return NextResponse.json({
        success: true,
        message: 'Admin criado com sucesso',
        admin: {
          email: newAdmin.email,
          name: newAdmin.name,
          role: newAdmin.role
        },
        users: [newAdmin]
      })
    }

    // Verificar se existe admin
    const adminExists = allUsers.find(user => user.role === 'ADMIN')

    return NextResponse.json({
      success: true,
      message: 'Debug concluído',
      database_url: process.env.DATABASE_URL ? 'Configurada' : 'NÃO CONFIGURADA',
      total_users: allUsers.length,
      admin_exists: !!adminExists,
      admin_email: adminExists?.email || null,
      users: allUsers,
      env_vars: {
        ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'NÃO CONFIGURADA',
        ADMIN_NAME: process.env.ADMIN_NAME || 'NÃO CONFIGURADA',
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? 'CONFIGURADA' : 'NÃO CONFIGURADA'
      }
    })

  } catch (error) {
    console.error('❌ Erro no debug:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : null
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    if (action === 'create-admin') {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@iniva.ma'
      const adminName = process.env.ADMIN_NAME || 'Administrador'
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
      
      // Verificar se já existe
      const existing = await prisma.user.findUnique({
        where: { email: adminEmail }
      })

      if (existing) {
        return NextResponse.json({
          success: true,
          message: 'Admin já existe',
          admin: {
            email: existing.email,
            name: existing.name,
            role: existing.role
          }
        })
      }

      // Criar novo admin
      const hashedPassword = await bcrypt.hash(adminPassword, 12)
      const newAdmin = await prisma.user.create({
        data: {
          email: adminEmail,
          name: adminName,
          password: hashedPassword,
          role: 'ADMIN',
          active: true
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Admin criado com sucesso',
        admin: {
          email: newAdmin.email,
          name: newAdmin.name,
          role: newAdmin.role
        }
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Ação não reconhecida'
    }, { status: 400 })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}