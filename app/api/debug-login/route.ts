import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    
    console.log('🔍 Debug login iniciado...')
    console.log('📧 Email recebido:', email)
    console.log('🔑 Senha recebida:', password ? 'SIM' : 'NÃO')
    
    // Importar módulos
    const { PrismaClient } = await import('@prisma/client')
    const bcrypt = await import('bcryptjs')
    
    const prisma = new PrismaClient()
    await prisma.$connect()
    
    // Buscar o usuário
    console.log('🔍 Buscando usuário no banco...')
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      console.log('❌ Usuário não encontrado')
      return NextResponse.json({
        success: false,
        error: 'Usuário não encontrado',
        debug: {
          userFound: false,
          email
        }
      })
    }
    
    console.log('✅ Usuário encontrado:', {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      active: user.active
    })
    
    // Verificar se está ativo
    if (!user.active) {
      console.log('❌ Usuário inativo')
      return NextResponse.json({
        success: false,
        error: 'Usuário inativo',
        debug: {
          userFound: true,
          userActive: false,
          user: {
            email: user.email,
            name: user.name,
            role: user.role
          }
        }
      })
    }
    
    // Verificar senha
    console.log('🔐 Verificando senha...')
    console.log('Hash armazenado:', user.password.substring(0, 10) + '...')
    
    const isPasswordValid = await bcrypt.compare(password, user.password)
    console.log('🔐 Senha válida:', isPasswordValid)
    
    if (!isPasswordValid) {
      // Vamos também testar algumas variações da senha
      const testPasswords = [
        password,
        'admin123',
        'Inova@2025#Admin',
        process.env.ADMIN_PASSWORD || ''
      ]
      
      console.log('🧪 Testando variações de senha...')
      for (const testPass of testPasswords) {
        if (testPass) {
          const testResult = await bcrypt.compare(testPass, user.password)
          console.log(`Teste "${testPass}": ${testResult}`)
        }
      }
      
      return NextResponse.json({
        success: false,
        error: 'Senha incorreta',
        debug: {
          userFound: true,
          userActive: user.active,
          passwordValid: false,
          user: {
            email: user.email,
            name: user.name,
            role: user.role
          },
          passwordHash: user.password.substring(0, 20) + '...'
        }
      })
    }
    
    console.log('✅ Login válido!')
    await prisma.$disconnect()
    
    return NextResponse.json({
      success: true,
      message: 'Login válido',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      debug: {
        userFound: true,
        userActive: user.active,
        passwordValid: true
      }
    })

  } catch (error) {
    console.error('❌ Erro no debug login:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : null
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    console.log('📋 Listando todos os usuários...')
    
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
        createdAt: true,
        password: true // Vamos ver o hash também
      }
    })
    
    console.log('👥 Usuários encontrados:', users.length)
    
    await prisma.$disconnect()
    
    return NextResponse.json({
      success: true,
      users: users.map(user => ({
        ...user,
        passwordHash: user.password.substring(0, 20) + '...'
      })),
      total: users.length,
      environment: {
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        ADMIN_NAME: process.env.ADMIN_NAME,
        ADMIN_PASSWORD_SET: !!process.env.ADMIN_PASSWORD
      }
    })

  } catch (error) {
    console.error('❌ Erro ao listar usuários:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}