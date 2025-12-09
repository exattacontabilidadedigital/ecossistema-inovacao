import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const hubs = await prisma.hub.findMany({
      include: {
        _count: {
          select: {
            appointments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(hubs)
  } catch (error) {
    console.error('Error fetching hubs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, location, address, description, image, services, hours } = body

    // Process services - convert from textarea lines to JSON array
    const servicesArray = services
      .split('\n')
      .map((service: string) => service.trim())
      .filter((service: string) => service.length > 0)

    const hub = await prisma.hub.create({
      data: {
        name,
        location,
        address,
        description,
        image,
        services: JSON.stringify(servicesArray),
        hours,
      },
      include: {
        _count: {
          select: {
            appointments: true
          }
        }
      }
    })

    return NextResponse.json(hub, { status: 201 })
  } catch (error) {
    console.error('Error creating hub:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}