import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const actors = await prisma.actor.findMany({
      where: {
        active: true
      },
      orderBy: {
        name: 'asc'
      },
      select: {
        id: true,
        name: true,
        logo: true,
        mission: true,
        programs: true,
        website: true,
        icon: true,
        color: true
      }
    })

    // Parse programs JSON for each actor
    const actorsWithParsedPrograms = actors.map(actor => ({
      ...actor,
      programs: (() => {
        try {
          return JSON.parse(actor.programs)
        } catch {
          // If not valid JSON, split by lines
          return actor.programs.split('\n').filter(p => p.trim())
        }
      })()
    }))

    return NextResponse.json(actorsWithParsedPrograms)
  } catch (error) {
    console.error('Error fetching actors:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}