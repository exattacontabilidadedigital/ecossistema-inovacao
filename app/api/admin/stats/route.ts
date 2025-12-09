import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch statistics
    const [users, hubs, appointments, contacts, blogPosts] = await Promise.all([
      prisma.user.count(),
      prisma.hub.count(),
      prisma.appointment.count(),
      prisma.contact.count(),
      prisma.blogPost.count(),
    ])

    return NextResponse.json({
      users,
      hubs,
      appointments,
      contacts,
      blogPosts,
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}