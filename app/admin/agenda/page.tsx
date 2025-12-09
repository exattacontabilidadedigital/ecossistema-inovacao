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
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Plus, Search, Edit2, Trash2, Eye, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface Hub {
  id: string
  name: string
}

interface Appointment {
  id: string
  name: string
  email: string
  organization?: string
  phone?: string
  purpose: string
  date: string
  time: string
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  hubId: string
  hub: Hub
  notes?: string
  createdAt: string
}

const STATUS_LABELS = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmado', 
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado'
}

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800'
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [hubs, setHubs] = useState<Hub[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    phone: '',
    purpose: '',
    date: undefined as Date | undefined,
    time: '',
    status: 'PENDING' as 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED',
    hubId: '',
    notes: ''
  })

  useEffect(() => {
    fetchAppointments()
    fetchHubs()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/admin/appointments')
      if (response.ok) {
        const data = await response.json()
        setAppointments(data)
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchHubs = async () => {
    try {
      const response = await fetch('/api/admin/hubs')
      if (response.ok) {
        const data = await response.json()
        setHubs(data.filter((hub: any) => hub.active))
      }
    } catch (error) {
      console.error('Error fetching hubs:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      organization: '',
      phone: '',
      purpose: '',
      date: undefined,
      time: '',
      status: 'PENDING',
      hubId: '',
      notes: ''
    })
  }

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/admin/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          date: formData.date?.toISOString()
        })
      })

      if (response.ok) {
        await fetchAppointments()
        setIsCreateModalOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error creating appointment:', error)
    }
  }

  const handleEdit = async () => {
    if (!selectedAppointment) return

    try {
      const response = await fetch(`/api/admin/appointments/${selectedAppointment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          date: formData.date?.toISOString()
        })
      })

      if (response.ok) {
        await fetchAppointments()
        setIsEditModalOpen(false)
        setSelectedAppointment(null)
        resetForm()
      }
    } catch (error) {
      console.error('Error updating appointment:', error)
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        await fetchAppointments()
      }
    } catch (error) {
      console.error('Error updating appointment status:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este agendamento?')) return

    try {
      const response = await fetch(`/api/admin/appointments/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchAppointments()
      }
    } catch (error) {
      console.error('Error deleting appointment:', error)
    }
  }

  const openEditModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setFormData({
      name: appointment.name,
      email: appointment.email,
      organization: appointment.organization || '',
      phone: appointment.phone || '',
      purpose: appointment.purpose,
      date: new Date(appointment.date),
      time: appointment.time,
      status: appointment.status,
      hubId: appointment.hubId,
      notes: appointment.notes || ''
    })
    setIsEditModalOpen(true)
  }

  const openViewModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsViewModalOpen(true)
  }

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.hub.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agendamentos</h1>
          <p className="text-muted-foreground">
            Gerencie os agendamentos dos hubs de inovação
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Agendamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Agendamento</DialogTitle>
              <DialogDescription>
                Adicione um novo agendamento ao sistema
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nome completo"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@exemplo.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="organization">Organização</Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="Nome da empresa/organização"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="purpose">Finalidade</Label>
                <Textarea
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="Descreva o motivo do agendamento"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Data</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !formData.date && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.date ? format(formData.date, 'PPP', { locale: ptBR }) : 'Selecionar data'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.date}
                        onSelect={(date) => setFormData({ ...formData, date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="time">Horário</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="hubId">Hub</Label>
                <Select value={formData.hubId} onValueChange={(value) => setFormData({ ...formData, hubId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um hub" />
                  </SelectTrigger>
                  <SelectContent>
                    {hubs.map((hub) => (
                      <SelectItem key={hub.id} value={hub.id}>
                        {hub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Observações adicionais"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="button" onClick={handleCreate}>
                Criar Agendamento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtre os agendamentos por termo ou status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, email, finalidade ou hub..."
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
          <CardTitle>Lista de Agendamentos</CardTitle>
          <CardDescription>
            {filteredAppointments.length} agendamento(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando agendamentos...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome/Email</TableHead>
                  <TableHead>Hub</TableHead>
                  <TableHead>Finalidade</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{appointment.name}</div>
                        <div className="text-sm text-muted-foreground">{appointment.email}</div>
                        {appointment.organization && (
                          <div className="text-xs text-muted-foreground">{appointment.organization}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{appointment.hub.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{appointment.purpose}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>{format(new Date(appointment.date), 'PPP', { locale: ptBR })}</div>
                          <div className="text-sm text-muted-foreground">{appointment.time}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={appointment.status}
                        onValueChange={(value) => handleStatusChange(appointment.id, value)}
                      >
                        <SelectTrigger className="w-[130px]">
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
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openViewModal(appointment)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(appointment)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(appointment.id)}
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

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Agendamento</DialogTitle>
            <DialogDescription>
              Modifique as informações do agendamento
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Nome</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-organization">Organização</Label>
                <Input
                  id="edit-organization"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Telefone</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-purpose">Finalidade</Label>
              <Textarea
                id="edit-purpose"
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Data</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !formData.date && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, 'PPP', { locale: ptBR }) : 'Selecionar data'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => setFormData({ ...formData, date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="edit-time">Horário</Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STATUS_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-hubId">Hub</Label>
              <Select value={formData.hubId} onValueChange={(value) => setFormData({ ...formData, hubId: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {hubs.map((hub) => (
                    <SelectItem key={hub.id} value={hub.id}>
                      {hub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-notes">Observações</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleEdit}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Agendamento</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Nome</Label>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.email}</p>
                </div>
              </div>
              {selectedAppointment.organization && (
                <div>
                  <Label className="text-sm font-medium">Organização</Label>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.organization}</p>
                </div>
              )}
              {selectedAppointment.phone && (
                <div>
                  <Label className="text-sm font-medium">Telefone</Label>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.phone}</p>
                </div>
              )}
              <div>
                <Label className="text-sm font-medium">Hub</Label>
                <p className="text-sm text-muted-foreground">{selectedAppointment.hub.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Finalidade</Label>
                <p className="text-sm text-muted-foreground">{selectedAppointment.purpose}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Data</Label>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(selectedAppointment.date), 'PPP', { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Horário</Label>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.time}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <Badge className={STATUS_COLORS[selectedAppointment.status]}>
                  {STATUS_LABELS[selectedAppointment.status]}
                </Badge>
              </div>
              {selectedAppointment.notes && (
                <div>
                  <Label className="text-sm font-medium">Observações</Label>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.notes}</p>
                </div>
              )}
              <div>
                <Label className="text-sm font-medium">Criado em</Label>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(selectedAppointment.createdAt), 'PPP HH:mm', { locale: ptBR })}
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
    </div>
  )
}