'use client'

import { useEffect, useRef, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Bold, Italic, Underline, List, ListOrdered, Link, Quote, Type, Heading1, Heading2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  id?: string
}

export function RichTextEditor({ label, value, onChange, placeholder, id }: RichTextEditorProps) {
  const [isQuillLoaded, setIsQuillLoaded] = useState(false)
  const ReactQuill = useRef<any>(null)
  const editorRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const loadQuill = async () => {
      if (typeof window !== 'undefined') {
        try {
          const QuillModule = await import('react-quill')
          ReactQuill.current = QuillModule.default
          setIsQuillLoaded(true)
        } catch (error) {
          console.warn('Failed to load React Quill:', error)
          // Fallback para textarea simples
        }
      }
    }
    loadQuill()
  }, [])

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'link'],
      ['clean']
    ],
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline',
    'align',
    'list', 'bullet',
    'blockquote',
    'link'
  ]

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
    } else if (wrapper === 'underline') {
      newText = `<u>${textToInsert}</u>`
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

  if (!isQuillLoaded) {
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
              title="Negrito"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => insertText('italic', 'texto em itálico')}
              className="h-8 w-8 p-0"
              title="Itálico"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => insertText('h1', 'Título 1')}
              className="h-8 w-8 p-0"
              title="Título 1"
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => insertText('h2', 'Título 2')}
              className="h-8 w-8 p-0"
              title="Título 2"
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => insertText('ul', 'item da lista')}
              className="h-8 w-8 p-0"
              title="Lista"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => insertText('ol', 'item numerado')}
              className="h-8 w-8 p-0"
              title="Lista numerada"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => insertText('link', 'texto do link')}
              className="h-8 w-8 p-0"
              title="Link"
            >
              <Link className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => insertText('quote', 'citação')}
              className="h-8 w-8 p-0"
              title="Citação"
            >
              <Quote className="h-4 w-4" />
            </Button>
          </div>
          
          <Textarea
            ref={editorRef}
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[120px] rounded-t-none border-t-0"
            style={{ fontFamily: 'ui-monospace, monospace' }}
          />
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Editor com suporte a Markdown. Use os botões ou digite ** para negrito, * para itálico, # para títulos.
        </div>
      </div>
    )
  }

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="mt-1">
        <ReactQuill.current
          theme="snow"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          modules={modules}
          formats={formats}
          className="rich-text-editor"
          style={{ minHeight: '120px' }}
        />
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        Editor rico com formatação completa: negrito, itálico, sublinhado, cabeçalhos, listas, cores, alinhamento e muito mais.
      </div>
    </div>
  )
}