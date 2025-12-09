import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Verificar se é admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso negado - apenas administradores' }, { status: 403 })
    }

    // Ler dados da requisição
    const formData = await request.formData()
    const file = formData.get('dataFile') as File

    if (!file) {
      return NextResponse.json({ error: 'Arquivo não fornecido' }, { status: 400 })
    }

    const fileContent = await file.text()
    const data = JSON.parse(fileContent)

    // Validar estrutura dos dados
    if (!data.version || !data.exportedAt) {
      return NextResponse.json({ error: 'Formato de arquivo inválido' }, { status: 400 })
    }

    console.log(`🔄 Iniciando importação de dados exportados em: ${data.exportedAt}`)

    // Limpar dados existentes (CUIDADO!)
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
    await prisma.setting.deleteMany()
    
    // Não apagar usuários para manter a sessão atual
    await prisma.user.deleteMany({
      where: {
        email: { not: session.user.email! }
      }
    })

    // Importar dados na ordem correta
    console.log('📥 Importando usuários...')
    for (const userData of data.users) {
      // Verificar se o usuário já existe (para não duplicar o admin atual)
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      })
      if (!existingUser) {
        await prisma.user.create({ data: userData })
      }
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
      const { categories, tags, author, ...postData } = post
      
      const createdPost = await prisma.blogPost.create({ 
        data: postData
      })

      // Recriar relacionamentos de categorias
      if (categories && categories.length > 0) {
        for (const blogCategory of categories) {
          await prisma.blogCategory.create({
            data: {
              blogPostId: createdPost.id,
              categoryId: blogCategory.categoryId
            }
          })
        }
      }

      // Recriar relacionamentos de tags
      if (tags && tags.length > 0) {
        for (const blogTag of tags) {
          await prisma.blogTag.create({
            data: {
              blogPostId: createdPost.id,
              tagId: blogTag.tagId
            }
          })
        }
      }
    }

    if (data.settings && data.settings.length > 0) {
      console.log('📥 Importando configurações...')
      for (const setting of data.settings) {
        await prisma.setting.create({ data: setting })
      }
    }

    const summary = {
      users: data.users?.length || 0,
      hubs: data.hubs?.length || 0,
      actors: data.actors?.length || 0,
      appointments: data.appointments?.length || 0,
      contacts: data.contacts?.length || 0,
      categories: data.categories?.length || 0,
      tags: data.tags?.length || 0,
      blogPosts: data.blogPosts?.length || 0,
      settings: data.settings?.length || 0,
      importedAt: new Date().toISOString()
    }

    console.log('✅ Importação concluída com sucesso!')
    console.log('📊 Resumo:', summary)

    return NextResponse.json({ 
      success: true, 
      message: 'Dados importados com sucesso!',
      summary 
    })

  } catch (error) {
    console.error('❌ Erro na importação:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}