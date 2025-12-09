import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      phone,
      organization,
      hubId,
      date,
      time,
      duration,
      purpose,
    } = body

    // Validate required fields
    if (!name || !email || !phone || !hubId || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if hub exists and is active
    const hub = await prisma.hub.findUnique({
      where: { id: hubId },
      select: { id: true, active: true }
    })

    if (!hub || !hub.active) {
      return NextResponse.json(
        { error: 'Hub not found or not active' },
        { status: 400 }
      )
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        name,
        email,
        phone,
        organization: organization || null,
        hubId,
        date: new Date(date),
        time,
        duration: duration || null,
        purpose: purpose || null,
        status: 'PENDING'
      },
      include: {
        hub: {
          select: {
            name: true,
            location: true
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