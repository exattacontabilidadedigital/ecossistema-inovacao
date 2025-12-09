import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        status: 'PUBLISHED'
      },
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        },
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
                color: true
              }
            }
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
                color: true
              }
            }
          }
        }
      },
      orderBy: {
        publishedAt: 'desc'
      }
    })

    // Format the response to match the expected structure
    const formattedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      image: post.image,
      status: post.status,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: post.author,
      categories: post.categories.map(pc => pc.category),
      tags: post.tags.map(pt => pt.tag)
    }))

    return NextResponse.json({
      posts: formattedPosts,
      total: formattedPosts.length
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}