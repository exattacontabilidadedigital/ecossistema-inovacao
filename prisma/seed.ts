import { PrismaClient } from '../lib/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@inova.ma' },
    update: {},
    create: {
      email: 'admin@inova.ma',
      name: 'Administrador',
      password: hashedPassword,
      role: 'ADMIN',
      active: true,
    },
  })

  // Create sample hubs
  const hubTech = await prisma.hub.upsert({
    where: { id: 'hub-tech-id' },
    update: {},
    create: {
      id: 'hub-tech-id',
      name: 'Hub de Tecnologia',
      description: 'Centro de inovação tecnológica focado em startups de tecnologia',
      location: 'São Luís - MA',
      address: 'Rua da Tecnologia, 123 - Centro',
      services: '["Incubação", "Aceleração", "Coworking", "Mentoria"]',
      hours: 'Segunda a Sexta: 8h às 18h',
      active: true,
    },
  })

  const hubAgro = await prisma.hub.upsert({
    where: { id: 'hub-agro-id' },
    update: {},
    create: {
      id: 'hub-agro-id',
      name: 'Hub do Agronegócio',
      description: 'Inovação no setor agrícola e agropecuário',
      location: 'Imperatriz - MA',
      address: 'Avenida do Agronegócio, 456 - Industrial',
      services: '["Consultoria", "Pesquisa", "Desenvolvimento", "Capacitação"]',
      hours: 'Segunda a Sexta: 7h às 17h',
      active: true,
    },
  })

  // Create sample actors
  const actor1 = await prisma.actor.upsert({
    where: { id: 'actor-1' },
    update: {},
    create: {
      id: 'actor-1',
      name: 'TechStart MA',
      mission: 'Desenvolver soluções tecnológicas inovadoras para educação',
      programs: '["Incubadora de Startups", "Programa de Mentoria", "Bootcamp de Programação"]',
      website: 'https://techstartma.com.br',
      icon: 'Code',
      color: '#3B82F6',
      active: true,
    },
  })

  const actor2 = await prisma.actor.upsert({
    where: { id: 'actor-2' },
    update: {},
    create: {
      id: 'actor-2',
      name: 'AgroTech Solutions',
      mission: 'Modernizar o agronegócio através de tecnologias sustentáveis',
      programs: '["Consultoria em Precisão Agrícola", "Desenvolvimento de IoT Rural", "Capacitação Digital"]',
      website: 'https://agrotechsolutions.ma.gov.br',
      icon: 'Tractor',
      color: '#10B981',
      active: true,
    },
  })

  // Create sample categories
  const categoryTech = await prisma.category.upsert({
    where: { slug: 'tecnologia' },
    update: {},
    create: {
      name: 'Tecnologia',
      slug: 'tecnologia',
      description: 'Posts sobre inovações tecnológicas',
      color: '#3B82F6',
    },
  })

  const categoryAgro = await prisma.category.upsert({
    where: { slug: 'agronegocio' },
    update: {},
    create: {
      name: 'Agronegócio',
      slug: 'agronegocio',
      description: 'Conteúdo sobre o setor agrícola',
      color: '#10B981',
    },
  })

  // Create sample blog post
  const blogPost = await prisma.blogPost.upsert({
    where: { slug: 'inovacao-no-maranhao' },
    update: {},
    create: {
      title: 'Inovação no Maranhão: O futuro chegou',
      slug: 'inovacao-no-maranhao',
      content: 'O ecossistema de inovação maranhense tem se desenvolvido rapidamente...',
      excerpt: 'Descubra como o Maranhão está se tornando um polo de inovação',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      authorId: adminUser.id,
    },
  })

  console.log('Database seeded successfully!')
  console.log('Admin user created:')
  console.log('Email: admin@inova.ma')
  console.log('Password: admin123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })