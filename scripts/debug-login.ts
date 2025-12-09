import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function debugLogin() {
  try {
    console.log('🔍 Debugando problema de login...')
    console.log('')

    // 1. Listar todos os usuários
    console.log('📋 1. Listando todos os usuários:')
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

    if (allUsers.length === 0) {
      console.log('❌ Nenhum usuário encontrado no banco!')
      console.log('💡 Executando criação do admin...')
      
      // Tentar criar admin
      const defaultEmail = process.env.ADMIN_EMAIL || 'admin@iniva.ma'
      const defaultName = process.env.ADMIN_NAME || 'Administrador'
      const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123'
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

      console.log('✅ Admin criado:', {
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role
      })
      return
    }

    allUsers.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.email}`)
      console.log(`     - Nome: ${user.name}`)
      console.log(`     - Role: ${user.role}`)
      console.log(`     - Ativo: ${user.active}`)
      console.log(`     - Criado: ${user.createdAt}`)
      console.log('')
    })

    // 2. Testar login do admin
    console.log('🔐 2. Testando login do admin:')
    const testEmail = process.env.ADMIN_EMAIL || 'admin@iniva.ma'
    const testPassword = process.env.ADMIN_PASSWORD || 'admin123'

    console.log(`📧 Email de teste: ${testEmail}`)
    console.log(`🔑 Senha de teste: ${testPassword}`)
    console.log('')

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: {
        email: testEmail,
        active: true
      }
    })

    if (!user) {
      console.log(`❌ Usuário ${testEmail} não encontrado ou inativo!`)
      return
    }

    console.log(`✅ Usuário encontrado: ${user.email}`)
    console.log(`📋 Role: ${user.role}`)
    console.log(`🟢 Ativo: ${user.active}`)
    console.log('')

    // Testar senha
    console.log('🔍 3. Testando verificação de senha...')
    const isPasswordValid = await bcrypt.compare(testPassword, user.password)
    
    if (isPasswordValid) {
      console.log('✅ Senha está correta!')
      console.log('🎉 Login deveria funcionar normalmente')
    } else {
      console.log('❌ Senha incorreta!')
      console.log('💡 Vou criar/atualizar com a senha correta...')
      
      // Atualizar senha
      const newHashedPassword = await bcrypt.hash(testPassword, 12)
      await prisma.user.update({
        where: { email: testEmail },
        data: { password: newHashedPassword }
      })
      
      console.log('✅ Senha atualizada!')
    }

  } catch (error) {
    console.error('❌ Erro no debug:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugLogin()