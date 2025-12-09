'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, Edit2, Trash2, Eye, Mail, Phone, User, MessageCircle, Reply, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  replied: boolean
  createdAt: string
  updatedAt: string
}

const STATUS_LABELS = {
  NEW: 'Novo',
  IN_PROGRESS: 'Em Andamento',
  RESOLVED: 'Resolvido',
  CLOSED: 'Fechado'
}

const STATUS_COLORS = {
  NEW: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  RESOLVED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-800'
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [replyMessage, setReplyMessage] = useState('')

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/admin/contacts')
      if (response.ok) {
        const data = await response.json()
        setContacts(data)
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        await fetchContacts()
      }
    } catch (error) {
      console.error('Error updating contact status:', error)
    }
  }

  const handleMarkReplied = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replied: true })
      })

      if (response.ok) {
        await fetchContacts()
        setIsReplyModalOpen(false)
        setReplyMessage('')
      }
    } catch (error) {
      console.error('Error marking contact as replied:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este contato?')) return

    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchContacts()
      }
    } catch (error) {
      console.error('Error deleting contact:', error)
    }
  }

  const openViewModal = (contact: Contact) => {
    setSelectedContact(contact)
    setIsViewModalOpen(true)
  }

  const openReplyModal = (contact: Contact) => {
    setSelectedContact(contact)
    setIsReplyModalOpen(true)
  }

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || contact.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contatos</h1>
          <p className="text-muted-foreground">
            Gerencie os contatos recebidos através do formulário
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtre os contatos por termo ou status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, email ou assunto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Contatos</CardTitle>
          <CardDescription>
            {filteredContacts.length} contato(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando contatos...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome/Email</TableHead>
                  <TableHead>Assunto</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Respondido</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {contact.name}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          {contact.email}
                        </div>
                        {contact.phone && (
                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            {contact.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate font-medium">{contact.subject}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {contact.message.substring(0, 100)}...
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {format(new Date(contact.createdAt), 'PPP', { locale: ptBR })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(contact.createdAt), 'HH:mm')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={contact.status}
                        onValueChange={(value) => handleStatusChange(contact.id, value)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(STATUS_LABELS).map(([key, label]) => (
                            <SelectItem key={key} value={key}>
                              <Badge className={STATUS_COLORS[key as keyof typeof STATUS_COLORS]}>
                                {label}
                              </Badge>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {contact.replied ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Sim
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">
                          Não
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openViewModal(contact)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openReplyModal(contact)}
                          disabled={contact.replied}
                        >
                          <Reply className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(contact.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Contato</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Nome</Label>
                  <p className="text-sm text-muted-foreground">{selectedContact.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground">{selectedContact.email}</p>
                </div>
              </div>
              {selectedContact.phone && (
                <div>
                  <Label className="text-sm font-medium">Telefone</Label>
                  <p className="text-sm text-muted-foreground">{selectedContact.phone}</p>
                </div>
              )}
              <div>
                <Label className="text-sm font-medium">Assunto</Label>
                <p className="text-sm text-muted-foreground">{selectedContact.subject}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Mensagem</Label>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedContact.message}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={STATUS_COLORS[selectedContact.status]}>
                    {STATUS_LABELS[selectedContact.status]}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Respondido</Label>
                  <Badge className={selectedContact.replied ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {selectedContact.replied ? 'Sim' : 'Não'}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Recebido em</Label>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(selectedContact.createdAt), 'PPP HH:mm', { locale: ptBR })}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reply Modal */}
      <Dialog open={isReplyModalOpen} onOpenChange={setIsReplyModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Responder Contato</DialogTitle>
            <DialogDescription>
              Marque como respondido após enviar a resposta
            </DialogDescription>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-sm font-medium">De:</Label>
                    <p className="text-sm">{selectedContact.name} ({selectedContact.email})</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Assunto:</Label>
                    <p className="text-sm">{selectedContact.subject}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Mensagem Original:</Label>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>
              <div>
                <Label htmlFor="reply">Resposta (opcional)</Label>
                <Textarea
                  id="reply"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Digite sua resposta aqui (este campo é apenas para referência)..."
                  rows={6}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsReplyModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={() => selectedContact && handleMarkReplied(selectedContact.id)}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Marcar como Respondido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}