import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Health check básico - não expõe informações sensíveis
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Erro no health check:', error)
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}