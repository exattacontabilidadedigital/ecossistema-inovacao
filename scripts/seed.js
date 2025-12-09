import { createSuperAdmin, seedData } from './seed'

async function main() {
  try {
    await createSuperAdmin()
    await seedData()
    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

main()