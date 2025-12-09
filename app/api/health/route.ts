import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Verificações básicas sem Prisma primeiro
    console.log('🔍 Health check iniciado...')
    
    const envVars = {
      DATABASE_URL: process.env.DATABASE_URL ? 'CONFIGURADA' : 'NÃO CONFIGURADA',
      ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'NÃO CONFIGURADA',
      ADMIN_NAME: process.env.ADMIN_NAME || 'NÃO CONFIGURADA', 
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? 'CONFIGURADA' : 'NÃO CONFIGURADA',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'CONFIGURADA' : 'NÃO CONFIGURADA',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NÃO CONFIGURADA'
    }
    
    console.log('📊 Variáveis de ambiente:', envVars)
    
    return NextResponse.json({
      success: true,
      message: 'Health check concluído',
      timestamp: new Date().toISOString(),
      environment_variables: envVars,
      status: 'healthy'
    })

  } catch (error) {
    console.error('❌ Erro no health check:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : null,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}