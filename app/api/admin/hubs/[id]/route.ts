import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { name, location, address, description, image, services, hours } = body

    // Process services - convert from textarea lines to JSON array
    const servicesArray = services
      .split('\n')
      .map((service: string) => service.trim())
      .filter((service: string) => service.length > 0)

    const hub = await prisma.hub.update({
      where: { id },
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

    return NextResponse.json(hub)
  } catch (error) {
    console.error('Error updating hub:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { active } = body

    const hub = await prisma.hub.update({
      where: { id },
      data: { active },
      include: {
        _count: {
          select: {
            appointments: true
          }
        }
      }
    })

    return NextResponse.json(hub)
  } catch (error) {
    console.error('Error updating hub status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await prisma.hub.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Hub deleted successfully' })
  } catch (error) {
    console.error('Error deleting hub:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}