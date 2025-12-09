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

    const appointments = await prisma.appointment.findMany({
      include: {
        hub: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Error fetching appointments:', error)
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
    const {
      name,
      email,
      organization,
      phone,
      purpose,
      date,
      time,
      status = 'PENDING',
      hubId,
      notes
    } = body

    // Validate required fields
    if (!name || !email || !purpose || !date || !time || !hubId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate hub exists
    const hub = await prisma.hub.findUnique({
      where: { id: hubId }
    })

    if (!hub) {
      return NextResponse.json(
        { error: 'Hub not found' },
        { status: 404 }
      )
    }

    const appointment = await prisma.appointment.create({
      data: {
        name,
        email,
        organization,
        phone,
        purpose,
        date: new Date(date),
        time,
        status,
        hubId,
        notes
      },
      include: {
        hub: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}