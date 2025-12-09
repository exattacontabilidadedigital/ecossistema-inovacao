'use client'

import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { 
  $getRoot, 
  $getSelection,
  EditorState,
  SerializedEditorState 
} from 'lexical'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'

import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListItemNode, ListNode } from '@lexical/list'
import { CodeNode } from '@lexical/code'
import { AutoLinkNode, LinkNode } from '@lexical/link'

import ToolbarPlugin from './lexical-toolbar-plugin'
import { cn } from '@/lib/utils'

const theme = {
  ltr: 'text-left',
  rtl: 'text-right',
  paragraph: 'mb-1',
  quote: 'border-l-4 border-gray-300 pl-4 italic text-gray-600',
  heading: {
    h1: 'text-2xl font-bold mb-2',
    h2: 'text-xl font-bold mb-2',
    h3: 'text-lg font-bold mb-1',
  },
  list: {
    nested: {
      listitem: 'list-none',
    },
    ol: 'list-decimal list-inside',
    ul: 'list-disc list-inside',
    listitem: 'mb-1',
  },
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    code: 'bg-gray-100 px-1 py-0.5 rounded font-mono text-sm',
  },
  code: 'bg-gray-100 p-2 rounded font-mono text-sm block',
  link: 'text-blue-600 hover:text-blue-800 underline',
}

const initialValue = {
  root: {
    children: [
      {
        children: [],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
} as unknown as SerializedEditorState

interface LexicalEditorProps {
  label: string
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  id?: string
  className?: string
}

export function LexicalEditor({ 
  label, 
  value = '', 
  onChange, 
  placeholder = 'Escreva o conteúdo aqui...', 
  id,
  className 
}: LexicalEditorProps) {
  const initialConfig = {
    namespace: 'LexicalEditor',
    theme,
    onError(error: Error) {
      console.error('Lexical Error:', error)
    },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      AutoLinkNode,
      LinkNode,
    ],
    editorState: undefined
  }

  const handleEditorChange = (newEditorState: EditorState) => {
    newEditorState.read(() => {
      const root = $getRoot()
      const textContent = root.getTextContent()
      
      // Para simplicidade, vamos apenas retornar o texto
      // Em uma implementação completa, você poderia serializar o estado completo
      onChange(textContent)
    })
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <div className="border rounded-lg overflow-hidden">
        <LexicalComposer initialConfig={initialConfig}>
          <ToolbarPlugin />
          <div className="relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable 
                  className="min-h-[120px] p-3 outline-none resize-none"
                />
              }
              placeholder={
                <div className="absolute top-3 left-3 text-gray-400 pointer-events-none">
                  {placeholder}
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <OnChangePlugin onChange={handleEditorChange} />
            <HistoryPlugin />
            <LinkPlugin />
            <ListPlugin />
            <MarkdownShortcutPlugin />
          </div>
        </LexicalComposer>
      </div>
      <div className="text-xs text-muted-foreground">
        Use a barra de ferramentas para formatar o texto. Suporte para Markdown shortcuts.
      </div>
    </div>
  )
}