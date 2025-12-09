import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createInitialAdmin() {
  try {
    console.log('🔄 Verificando se existe usuário admin...')

    // Verificar se já existe um usuário admin
    const existingAdmin = await prisma.user.findFirst({
      where: {
        role: { in: ['ADMIN', 'SUPER_ADMIN'] }
      }
    })

    if (existingAdmin) {
      console.log('✅ Usuário admin já existe:', existingAdmin.email)
      return
    }

    // Criar usuário admin padrão
    const defaultEmail = process.env.ADMIN_EMAIL || 'admin@iniva.com'
    const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123456'
    const hashedPassword = await bcrypt.hash(defaultPassword, 12)

    const adminUser = await prisma.user.create({
      data: {
        email: defaultEmail,
        name: 'Administrador',
        password: hashedPassword,
        role: 'ADMIN',
        active: true
      }
    })

    console.log('✅ Usuário admin criado com sucesso!')
    console.log(`📧 Email: ${adminUser.email}`)
    console.log(`🔑 Senha: ${defaultPassword}`)
    console.log('')
    console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!')

  } catch (error) {
    console.error('❌ Erro ao criar usuário admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createInitialAdmin()