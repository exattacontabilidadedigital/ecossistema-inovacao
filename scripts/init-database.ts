import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function setupDatabase() {
  try {
    console.log('🚀 Inicializando banco de dados...')

    // Primeiro, garantir que o Prisma está conectado
    await prisma.$connect()
    console.log('✅ Conectado ao banco SQLite')

    // Verificar se as tabelas existem tentando uma query simples
    try {
      await prisma.user.findFirst()
      console.log('✅ Tabelas já existem')
    } catch (error) {
      console.log('❌ Tabelas não existem, executando db push...')
      
      // Se chegou aqui, as tabelas não existem
      // O db push já deve ter sido executado pelo comando anterior
      // Vamos apenas aguardar e tentar novamente
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      try {
        await prisma.user.findFirst()
        console.log('✅ Tabelas criadas com sucesso')
      } catch (retryError) {
        console.error('❌ Falha ao criar tabelas:', retryError)
        process.exit(1)
      }
    }

    // Verificar se existe usuário admin
    console.log('🔍 Verificando usuário admin...')
    
    const existingAdmin = await prisma.user.findFirst({
      where: {
        role: 'ADMIN'
      }
    })

    if (existingAdmin) {
      console.log('✅ Usuário admin já existe:', existingAdmin.email)
      return
    }

    // Validar variáveis de ambiente obrigatórias
    const adminEmail = process.env.ADMIN_EMAIL
    const adminName = process.env.ADMIN_NAME
    const adminPassword = process.env.ADMIN_PASSWORD
    
    if (!adminEmail || !adminPassword) {
      console.log('⚠️  Variáveis ADMIN_EMAIL e ADMIN_PASSWORD são obrigatórias para criar admin')
      console.log('⚠️  Pulando criação do usuário admin...')
      return
    }
    
    console.log('🔄 Criando usuário admin...')
    console.log('📧 Email:', adminEmail)
    console.log('👤 Nome:', adminName || 'Administrador')
    
    const hashedPassword = await bcrypt.hash(adminPassword, 12)

    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        name: adminName || 'Administrador',
        password: hashedPassword,
        role: 'ADMIN',
        active: true
      }
    })

    console.log('✅ Usuário admin criado com sucesso!')
    console.log(`📧 Email: ${adminUser.email}`)
    console.log('')
    console.log('🎉 Banco de dados inicializado com sucesso!')

  } catch (error) {
    console.error('❌ Erro ao inicializar banco:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

setupDatabase()