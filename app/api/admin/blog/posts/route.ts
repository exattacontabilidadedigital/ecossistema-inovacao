import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const posts = await prisma.blogPost.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        categories: {
          include: {
            category: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform the data to flatten the relationships
    const transformedPosts = posts.map(post => ({
      ...post,
      categories: post.categories.map(bc => bc.category),
      tags: post.tags.map(bt => bt.tag)
    }))

    return NextResponse.json(transformedPosts)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { title, slug, content, excerpt, image, status, categoryIds = [], tagIds = [] } = data

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug }
    })

    if (existingPost) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    const publishedAt = status === 'PUBLISHED' ? new Date() : null

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        image,
        status,
        publishedAt,
        authorId: session.user.id,
        categories: {
          create: categoryIds.map((id: string) => ({
            category: {
              connect: { id }
            }
          }))
        },
        tags: {
          create: tagIds.map((id: string) => ({
            tag: {
              connect: { id }
            }
          }))
        }
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        categories: {
          include: {
            category: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    // Transform the data to flatten the relationships
    const transformedPost = {
      ...post,
      categories: post.categories.map(bc => bc.category),
      tags: post.tags.map(bt => bt.tag)
    }

    return NextResponse.json(transformedPost, { status: 201 })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}