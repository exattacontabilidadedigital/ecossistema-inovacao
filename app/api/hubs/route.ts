import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const hubs = await prisma.hub.findMany({
      where: {
        active: true
      },
      select: {
        id: true,
        name: true,
        location: true,
        address: true,
        description: true,
        image: true,
        services: true,
        hours: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Parse services JSON for each hub
    const hubsWithParsedServices = hubs.map(hub => ({
      ...hub,
      services: hub.services ? JSON.parse(hub.services) : []
    }))

    return NextResponse.json(hubsWithParsedServices)
  } catch (error) {
    console.error('Error fetching hubs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}