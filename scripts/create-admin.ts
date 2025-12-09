import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createInitialAdmin() {
  try {
    console.log('🔄 Verificando se existe usuário admin...')
    console.log('📧 ADMIN_EMAIL:', process.env.ADMIN_EMAIL)
    console.log('👤 ADMIN_NAME:', process.env.ADMIN_NAME)
    console.log('🔑 ADMIN_PASSWORD configurado:', !!process.env.ADMIN_PASSWORD)

    // Verificar se já existe qualquer usuário
    const existingUsers = await prisma.user.findMany()
    console.log('👥 Total de usuários existentes:', existingUsers.length)
    
    if (existingUsers.length > 0) {
      console.log('👥 Usuários existentes:')
      existingUsers.forEach(user => {
        console.log(`  - ${user.email} (${user.role})`)
      })
    }

    // Verificar se já existe um usuário admin
    const existingAdmin = await prisma.user.findFirst({
      where: {
        role: 'ADMIN'
      }
    })

    if (existingAdmin) {
      console.log('✅ Usuário admin já existe:', existingAdmin.email)
      return
    }

    // Criar usuário admin padrão
    const defaultEmail = process.env.ADMIN_EMAIL || 'admin@iniva.com'
    const defaultName = process.env.ADMIN_NAME || 'Administrador'
    const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123456'
    
    console.log('🔄 Criando usuário admin...')
    console.log('📧 Email:', defaultEmail)
    console.log('👤 Nome:', defaultName)
    
    const hashedPassword = await bcrypt.hash(defaultPassword, 12)

    const adminUser = await prisma.user.create({
      data: {
        email: defaultEmail,
        name: defaultName,
        password: hashedPassword,
        role: 'ADMIN',
        active: true
      }
    })

    console.log('✅ Usuário admin criado com sucesso!')
    console.log(`📧 Email: ${adminUser.email}`)
    console.log(`👤 Nome: ${adminUser.name}`)
    console.log(`🔑 Senha: ${defaultPassword}`)
    console.log('')
    console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!')

  } catch (error) {
    console.error('❌ Erro ao criar usuário admin:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createInitialAdmin()