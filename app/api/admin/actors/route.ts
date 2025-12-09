import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const actors = await prisma.actor.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(actors)
  } catch (error) {
    console.error('Error fetching actors:', error)
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
    const { name, logo, mission, programs, website, icon, color } = body

    const actor = await prisma.actor.create({
      data: {
        name,
        logo,
        mission,
        programs,
        website,
        icon,
        color,
      }
    })

    return NextResponse.json(actor, { status: 201 })
  } catch (error) {
    console.error('Error creating actor:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}