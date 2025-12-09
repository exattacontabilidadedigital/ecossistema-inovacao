'use client'

import { useRef } from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Bold, Italic, List, ListOrdered, Link, Quote, Heading1, Heading2, Code } from 'lucide-react'

interface RichTextEditorProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  id?: string
}

export function RichTextEditor({ label, value, onChange, placeholder, id }: RichTextEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null)

  const insertText = (wrapper: string, placeholder = '') => {
    if (!editorRef.current) return
    
    const textarea = editorRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const textToInsert = selectedText || placeholder
    
    let newText = ''
    if (wrapper === 'bold') {
      newText = `**${textToInsert}**`
    } else if (wrapper === 'italic') {
      newText = `*${textToInsert}*`
    } else if (wrapper === 'h1') {
      newText = `# ${textToInsert}`
    } else if (wrapper === 'h2') {
      newText = `## ${textToInsert}`
    } else if (wrapper === 'link') {
      const url = prompt('Digite a URL:')
      newText = url ? `[${textToInsert || 'link'}](${url})` : selectedText
    } else if (wrapper === 'quote') {
      newText = `> ${textToInsert}`
    } else if (wrapper === 'ul') {
      newText = `- ${textToInsert}`
    } else if (wrapper === 'ol') {
      newText = `1. ${textToInsert}`
    } else if (wrapper === 'code') {
      newText = `\`${textToInsert}\``
    }

    const newValue = value.substring(0, start) + newText + value.substring(end)
    onChange(newValue)
    
    // Reposicionar cursor
    setTimeout(() => {
      if (textarea) {
        const newPos = start + newText.length
        textarea.focus()
        textarea.setSelectionRange(newPos, newPos)
      }
    }, 0)
  }

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="space-y-2">
        {/* Toolbar de Formatação */}
        <div className="flex items-center gap-1 p-2 border rounded-t-lg bg-gray-50">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertText('bold', 'texto em negrito')}
            className="h-8 w-8 p-0"
            title="Negrito (**texto**)"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertText('italic', 'texto em itálico')}
            className="h-8 w-8 p-0"
            title="Itálico (*texto*)"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertText('h1', 'Título 1')}
            className="h-8 w-8 p-0"
            title="Título 1 (# texto)"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertText('h2', 'Título 2')}
            className="h-8 w-8 p-0"
            title="Título 2 (## texto)"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertText('ul', 'item da lista')}
            className="h-8 w-8 p-0"
            title="Lista (- texto)"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertText('ol', 'item numerado')}
            className="h-8 w-8 p-0"
            title="Lista numerada (1. texto)"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertText('link', 'texto do link')}
            className="h-8 w-8 p-0"
            title="Link ([texto](url))"
          >
            <Link className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertText('quote', 'citação')}
            className="h-8 w-8 p-0"
            title="Citação (> texto)"
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertText('code', 'código')}
            className="h-8 w-8 p-0"
            title="Código (`texto`)"
          >
            <Code className="h-4 w-4" />
          </Button>
        </div>
        
        <Textarea
          ref={editorRef}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[120px] rounded-t-none border-t-0 font-mono"
        />
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        Editor Markdown com formatação rica. Use os botões da toolbar ou digite a sintaxe diretamente.
      </div>
    </div>
  )
}