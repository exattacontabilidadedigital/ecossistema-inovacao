import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function exportData() {
  try {
    console.log('🔄 Exportando dados do banco local...')
    
    // Exportar todos os dados em ordem (respeitando relacionamentos)
    const users = await prisma.user.findMany()
    const hubs = await prisma.hub.findMany()
    const actors = await prisma.actor.findMany()
    const appointments = await prisma.appointment.findMany()
    const contacts = await prisma.contact.findMany()
    const categories = await prisma.category.findMany()
    const tags = await prisma.tag.findMany()
    const blogPosts = await prisma.blogPost.findMany({
      include: {
        categories: {
          include: {
            category: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        author: true
      }
    })
    const settings = await prisma.setting.findMany()

    const exportData = {
      users,
      hubs,
      actors,
      appointments,
      contacts,
      categories,
      tags,
      blogPosts,
      settings,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }

    // Salvar no arquivo
    const exportPath = path.join(process.cwd(), 'data-export.json')
    fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2))
    
    console.log('✅ Dados exportados com sucesso!')
    console.log(`📄 Arquivo salvo em: ${exportPath}`)
    console.log('📊 Resumo dos dados exportados:')
    console.log(`   - Usuários: ${users.length}`)
    console.log(`   - Hubs: ${hubs.length}`)
    console.log(`   - Atores: ${actors.length}`)
    console.log(`   - Agendamentos: ${appointments.length}`)
    console.log(`   - Contatos: ${contacts.length}`)
    console.log(`   - Categorias: ${categories.length}`)
    console.log(`   - Tags: ${tags.length}`)
    console.log(`   - Posts do Blog: ${blogPosts.length}`)
    console.log(`   - Configurações: ${settings.length}`)
    
  } catch (error) {
    console.error('❌ Erro ao exportar dados:', error)
  } finally {
    await prisma.$disconnect()
  }
}

exportData()