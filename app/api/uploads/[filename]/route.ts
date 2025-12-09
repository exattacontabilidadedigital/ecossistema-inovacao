import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Diretório de uploads - usa volume persistente em produção
const getUploadDir = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.UPLOAD_DIR || '/data/uploads'
  }
  return join(process.cwd(), 'public/images')
}

// Mapeamento de extensões para MIME types
const mimeTypes: Record<string, string> = {
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'png': 'image/png',
  'gif': 'image/gif',
  'webp': 'image/webp',
  'svg': 'image/svg+xml',
  'ico': 'image/x-icon',
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params
    
    // Validar filename para prevenir path traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
    }

    const uploadDir = getUploadDir()
    const filePath = join(uploadDir, filename)

    // Verificar se o arquivo existe
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Ler o arquivo
    const fileBuffer = await readFile(filePath)

    // Determinar o MIME type
    const extension = filename.split('.').pop()?.toLowerCase() || ''
    const contentType = mimeTypes[extension] || 'application/octet-stream'

    // Retornar o arquivo com headers apropriados
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving file:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
