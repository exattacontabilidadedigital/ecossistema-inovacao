import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🔍 Testando conexão do banco...')
    
    // Verificar variável de ambiente
    const databaseUrl = process.env.DATABASE_URL
    console.log('📍 DATABASE_URL:', databaseUrl)
    
    if (!databaseUrl) {
      return NextResponse.json({
        success: false,
        error: 'DATABASE_URL não configurada',
        env: process.env
      })
    }
    
    // Testar conexão Prisma
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error']
    })
    
    console.log('🔌 Tentando conectar...')
    await prisma.$connect()
    console.log('✅ Conectado com sucesso')
    
    // Testar query básica
    console.log('🔍 Testando query básica...')
    
    try {
      const result = await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table';`
      console.log('📋 Tabelas encontradas:', result)
      
      await prisma.$disconnect()
      
      return NextResponse.json({
        success: true,
        message: 'Conexão testada com sucesso',
        databaseUrl: databaseUrl.replace(/\/[^/]+\.db/, '/******.db'), // Ocultar path completo
        tables: result
      })
      
    } catch (queryError) {
      console.log('❌ Erro na query:', queryError)
      await prisma.$disconnect()
      
      return NextResponse.json({
        success: false,
        error: 'Erro ao executar query',
        details: queryError instanceof Error ? queryError.message : 'Erro desconhecido',
        databaseUrl: databaseUrl.replace(/\/[^/]+\.db/, '/******.db')
      })
    }
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : null
    }, { status: 500 })
  }
}

export async function POST() {
  try {
    console.log('🔧 Forçando criação do banco...')
    
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()
    
    await prisma.$connect()
    console.log('✅ Conectado')
    
    // Executar db push manualmente
    const { execSync } = await import('child_process')
    
    try {
      console.log('🔄 Executando prisma db push...')
      const output = execSync('npx prisma db push --force-reset', {
        cwd: process.cwd(),
        encoding: 'utf8',
        env: { 
          ...process.env,
          DATABASE_URL: process.env.DATABASE_URL
        }
      })
      
      console.log('📋 Output:', output)
      
      // Verificar se funcionou
      const tables = await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table';`
      await prisma.$disconnect()
      
      return NextResponse.json({
        success: true,
        message: 'DB Push executado com sucesso',
        output,
        tables
      })
      
    } catch (pushError) {
      console.log('❌ Erro no push:', pushError)
      await prisma.$disconnect()
      
      return NextResponse.json({
        success: false,
        error: 'Erro no db push',
        details: pushError instanceof Error ? pushError.message : 'Erro desconhecido'
      })
    }
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}