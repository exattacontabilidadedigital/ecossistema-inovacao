import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function importData() {
  try {
    const exportPath = path.join(process.cwd(), 'data-export.json')
    
    if (!fs.existsSync(exportPath)) {
      console.error('❌ Arquivo data-export.json não encontrado!')
      console.log('💡 Execute primeiro: npm run export-data')
      return
    }

    const data = JSON.parse(fs.readFileSync(exportPath, 'utf8'))
    
    console.log('🔄 Importando dados para o banco de produção...')
    console.log(`📅 Dados exportados em: ${data.exportedAt}`)
    
    // Limpar dados existentes (cuidado!)
    console.log('🧹 Limpando dados existentes...')
    await prisma.blogPost.deleteMany()
    await prisma.blogTag.deleteMany()
    await prisma.blogCategory.deleteMany()
    await prisma.tag.deleteMany()
    await prisma.category.deleteMany()
    await prisma.contact.deleteMany()
    await prisma.appointment.deleteMany()
    await prisma.actor.deleteMany()
    await prisma.hub.deleteMany()
    await prisma.user.deleteMany()
    await prisma.setting.deleteMany()

    // Importar dados na ordem correta
    console.log('📥 Importando usuários...')
    for (const user of data.users) {
      await prisma.user.create({ data: user })
    }

    console.log('📥 Importando hubs...')
    for (const hub of data.hubs) {
      await prisma.hub.create({ data: hub })
    }

    console.log('📥 Importando atores...')
    for (const actor of data.actors) {
      await prisma.actor.create({ data: actor })
    }

    console.log('📥 Importando agendamentos...')
    for (const appointment of data.appointments) {
      await prisma.appointment.create({ data: appointment })
    }

    console.log('📥 Importando contatos...')
    for (const contact of data.contacts) {
      await prisma.contact.create({ data: contact })
    }

    console.log('📥 Importando categorias...')
    for (const category of data.categories) {
      await prisma.category.create({ data: category })
    }

    console.log('📥 Importando tags...')
    for (const tag of data.tags) {
      await prisma.tag.create({ data: tag })
    }

    console.log('📥 Importando posts do blog...')
    for (const post of data.blogPosts) {
      // Remover dados de relacionamento que serão recriados
      const { categories, tags, author, ...postData } = post
      
      const createdPost = await prisma.blogPost.create({ 
        data: postData
      })

      // Recriar relacionamentos de categorias
      for (const blogCategory of categories) {
        await prisma.blogCategory.create({
          data: {
            blogPostId: createdPost.id,
            categoryId: blogCategory.categoryId
          }
        })
      }

      // Recriar relacionamentos de tags
      for (const blogTag of tags) {
        await prisma.blogTag.create({
          data: {
            blogPostId: createdPost.id,
            tagId: blogTag.tagId
          }
        })
      }
    }

    console.log('📥 Importando configurações...')
    for (const setting of data.settings) {
      await prisma.setting.create({ data: setting })
    }

    console.log('✅ Dados importados com sucesso!')
    console.log('📊 Resumo dos dados importados:')
    console.log(`   - Usuários: ${data.users.length}`)
    console.log(`   - Hubs: ${data.hubs.length}`)
    console.log(`   - Atores: ${data.actors.length}`)
    console.log(`   - Agendamentos: ${data.appointments.length}`)
    console.log(`   - Contatos: ${data.contacts.length}`)
    console.log(`   - Categorias: ${data.categories.length}`)
    console.log(`   - Tags: ${data.tags.length}`)
    console.log(`   - Posts do Blog: ${data.blogPosts.length}`)
    console.log(`   - Configurações: ${data.settings.length}`)
    
  } catch (error) {
    console.error('❌ Erro ao importar dados:', error)
  } finally {
    await prisma.$disconnect()
  }
}

importData()