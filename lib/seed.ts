import bcryptjs from 'bcryptjs'
import { prisma } from './prisma'

export async function createSuperAdmin() {
  const existingSuperAdmin = await prisma.user.findFirst({
    where: { role: 'SUPER_ADMIN' }
  })

  if (!existingSuperAdmin) {
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD
    const adminName = process.env.ADMIN_NAME || 'Super Administrador'
    
    if (!adminEmail || !adminPassword) {
      console.log('⚠️  Variáveis ADMIN_EMAIL e ADMIN_PASSWORD são obrigatórias')
      return
    }
    
    const hashedPassword = await bcryptjs.hash(adminPassword, 12)
    
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: adminName,
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        active: true
      }
    })
    
    console.log('✅ Super admin created successfully!')
    console.log(`Email: ${adminEmail}`)
  } else {
    console.log('✅ Super admin already exists!')
  }
}

// Seed some initial data
export async function seedData() {
  // Create some initial categories
  const categories = [
    { name: 'Inovação', slug: 'inovacao', description: 'Posts sobre inovação e tecnologia', color: '#3B82F6' },
    { name: 'Startups', slug: 'startups', description: 'Conteúdo sobre startups e empreendedorismo', color: '#10B981' },
    { name: 'Eventos', slug: 'eventos', description: 'Eventos e atividades do ecossistema', color: '#F59E0B' },
    { name: 'Educação', slug: 'educacao', description: 'Educação e capacitação', color: '#8B5CF6' }
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category
    })
  }

  // Create some initial tags
  const tags = [
    { name: 'Tecnologia', slug: 'tecnologia', color: '#3B82F6' },
    { name: 'IA', slug: 'ia', color: '#6366F1' },
    { name: 'Sustentabilidade', slug: 'sustentabilidade', color: '#10B981' },
    { name: 'Networking', slug: 'networking', color: '#F59E0B' }
  ]

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag
    })
  }

  console.log('✅ Initial data seeded successfully!')
}