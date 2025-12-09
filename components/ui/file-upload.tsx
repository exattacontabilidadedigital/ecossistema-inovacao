'use client'

import { useCallback, useState } from 'react'
import { Upload, X, FileImage } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  onFileSelect: (file: File | null) => void
  preview?: string | null
  className?: string
  maxSize?: number // in MB
  accept?: string
  disabled?: boolean
  label?: string
  helperText?: string
  loading?: boolean
  onRemove?: () => void
}

export function FileUpload({
  onFileSelect,
  preview,
  className,
  maxSize = 5,
  accept = "image/*",
  disabled = false,
  label,
  helperText,
  loading = false,
  onRemove
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string>('')

  const validateFile = (file: File): boolean => {
    setError('')
    
    // Validar tamanho
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Arquivo muito grande. Máximo ${maxSize}MB`)
      return false
    }
    
    // Validar tipo (se for imagem)
    if (accept === "image/*" && !file.type.startsWith('image/')) {
      setError('Apenas imagens são permitidas')
      return false
    }
    
    return true
  }

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return
    
    const file = files[0]
    if (validateFile(file)) {
      onFileSelect(file)
    } else {
      onFileSelect(null)
    }
  }, [onFileSelect, maxSize])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (disabled) return
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [disabled])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (disabled) return
    
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles, disabled])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }, [handleFiles])

  const removeFile = useCallback(() => {
    onFileSelect(null)
    setError('')
  }, [onFileSelect])

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-200",
          "hover:border-primary/50 hover:bg-primary/5",
          {
            "border-primary bg-primary/10": dragActive,
            "border-destructive bg-destructive/10": error,
            "border-muted-foreground/25": !dragActive && !error,
            "cursor-not-allowed opacity-50": disabled || loading
          }
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && !loading && document.getElementById('file-upload')?.click()}
      >
        {preview ? (
          <div className="space-y-2">
            <div className="relative max-w-xs mx-auto">
              <img 
                src={preview} 
                alt="Preview" 
                className="rounded-lg max-h-24 w-auto mx-auto"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-5 w-5"
                onClick={(e) => {
                  e.stopPropagation()
                  if (onRemove) onRemove()
                  else removeFile()
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            {helperText && (
              <p className="text-xs text-muted-foreground">{helperText}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Clique para alterar ou arraste uma nova imagem
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {loading ? (
              <div className="mx-auto w-8 h-8 text-muted-foreground animate-spin">
                <Upload className="w-full h-full" />
              </div>
            ) : (
              <div className="mx-auto w-8 h-8 text-muted-foreground">
                <Upload className="w-full h-full" />
              </div>
            )}
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {loading ? 'Enviando...' : 'Arraste uma imagem aqui'}
              </p>
              {!loading && (
                <p className="text-xs text-muted-foreground">
                  ou <span className="text-primary font-medium">clique para selecionar</span> (máx. {maxSize}MB)
                </p>
              )}
            </div>
          </div>
        )}
        
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleInputChange}
          disabled={disabled}
        />
      </div>
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}