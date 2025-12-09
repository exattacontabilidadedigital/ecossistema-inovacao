import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const host = request.headers.get('host')
    const protocol = request.headers.get('x-forwarded-proto') || 'http'
    const currentUrl = `${protocol}://${host}`
    
    return NextResponse.json({
      success: true,
      message: 'NextAuth URL Info',
      current: {
        host,
        protocol,
        fullUrl: currentUrl
      },
      environment: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NODE_ENV: process.env.NODE_ENV
      },
      recommendation: `Set NEXTAUTH_URL to: ${currentUrl}`
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}