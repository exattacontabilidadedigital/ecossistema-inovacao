import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const post = await prisma.blogPost.findUnique({
      where: { id },
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

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Transform the data to flatten the relationships
    const transformedPost = {
      ...post,
      categories: post.categories.map(bc => bc.category),
      tags: post.tags.map(bt => bt.tag)
    }

    return NextResponse.json(transformedPost)
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { title, slug, content, excerpt, image, status, categoryIds = [], tagIds = [] } = data

    // Check if slug already exists for other posts
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug }
    })

    if (existingPost && existingPost.id !== id) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    const currentPost = await prisma.blogPost.findUnique({
      where: { id }
    })

    if (!currentPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Set publishedAt if changing from non-published to published
    let publishedAt = currentPost.publishedAt
    if (status === 'PUBLISHED' && currentPost.status !== 'PUBLISHED') {
      publishedAt = new Date()
    } else if (status !== 'PUBLISHED') {
      publishedAt = null
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        excerpt,
        image,
        status,
        publishedAt,
        categories: {
          deleteMany: {},
          create: categoryIds.map((categoryId: string) => ({
            category: {
              connect: { id: categoryId }
            }
          }))
        },
        tags: {
          deleteMany: {},
          create: tagIds.map((tagId: string) => ({
            tag: {
              connect: { id: tagId }
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

    return NextResponse.json(transformedPost)
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { status } = data

    const currentPost = await prisma.blogPost.findUnique({
      where: { id }
    })

    if (!currentPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Set publishedAt if changing from non-published to published
    let publishedAt = currentPost.publishedAt
    if (status === 'PUBLISHED' && currentPost.status !== 'PUBLISHED') {
      publishedAt = new Date()
    } else if (status !== 'PUBLISHED') {
      publishedAt = null
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        status,
        publishedAt
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

    return NextResponse.json(transformedPost)
  } catch (error) {
    console.error('Error updating blog post status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const post = await prisma.blogPost.findUnique({
      where: { id }
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    await prisma.blogPost.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}