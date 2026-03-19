import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchSupplierContacts,
  createSupplierContact,
  updateSupplierContact,
  deleteSupplierContact,
} from '@/services/procurementService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import type { SupplierContact } from './suppliers/types'

interface SupplierContactsTabProps {
  supplierId: string
}

export function SupplierContactsTab({ supplierId }: SupplierContactsTabProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<SupplierContact | null>(null)
  const queryClient = useQueryClient()

  const { data: contacts = [] } = useQuery({
    queryKey: ['supplier-contacts', supplierId],
    queryFn: () => fetchSupplierContacts(supplierId),
  })

  const createMutation = useMutation({
    mutationFn: (contactData: Record<string, unknown>) =>
      createSupplierContact(supplierId, contactData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-contacts', supplierId] })
      toast.success('Kontakt erfolgreich erstellt')
      setIsAddDialogOpen(false)
    },
    onError: (error: Error) => toast.error(`Fehler: ${error.message}`),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Record<string, unknown> }) =>
      updateSupplierContact(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-contacts', supplierId] })
      toast.success('Kontakt erfolgreich aktualisiert')
      setEditingContact(null)
    },
    onError: (error: Error) => toast.error(`Fehler: ${error.message}`),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSupplierContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-contacts', supplierId] })
      toast.success('Kontakt erfolgreich gelöscht')
    },
    onError: (error: Error) => toast.error(`Fehler: ${error.message}`),
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>, isEdit = false) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const contactData = {
      contact_person: formData.get('contact_person'),
      phone: formData.get('phone') || null,
      email: formData.get('email') || null,
      availability: formData.get('availability') || null,
      birthday: formData.get('birthday') || null,
      notes: formData.get('notes') || null,
    }

    if (isEdit && editingContact) {
      updateMutation.mutate({ id: editingContact.id, updates: contactData })
    } else {
      createMutation.mutate(contactData)
    }
  }

  const contactForm = (defaults?: SupplierContact | null, isEdit = false) => (
    <form onSubmit={(e) => handleSubmit(e, isEdit)} className="space-y-4" data-testid="supplier-contact-form">
      <div className="space-y-2">
        <Label htmlFor={`${isEdit ? 'edit' : 'add'}-contact_person`}>Ansprechpartner *</Label>
        <Input id={`${isEdit ? 'edit' : 'add'}-contact_person`} name="contact_person" defaultValue={defaults?.contact_person || ''} required data-testid="input-supplier-contact-person" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${isEdit ? 'edit' : 'add'}-phone`}>Telefon</Label>
          <Input id={`${isEdit ? 'edit' : 'add'}-phone`} name="phone" defaultValue={defaults?.phone || ''} data-testid="input-supplier-contact-phone" />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${isEdit ? 'edit' : 'add'}-email`}>E-Mail</Label>
          <Input id={`${isEdit ? 'edit' : 'add'}-email`} name="email" type="email" defaultValue={defaults?.email || ''} data-testid="input-supplier-contact-email" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${isEdit ? 'edit' : 'add'}-birthday`}>Geburtstag</Label>
          <Input id={`${isEdit ? 'edit' : 'add'}-birthday`} name="birthday" type="date" defaultValue={defaults?.birthday || ''} data-testid="input-supplier-contact-birthday" />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${isEdit ? 'edit' : 'add'}-availability`}>Erreichbarkeit</Label>
          <Input id={`${isEdit ? 'edit' : 'add'}-availability`} name="availability" defaultValue={defaults?.availability || ''} placeholder="z.B. Mo-Fr 9-17 Uhr" data-testid="input-supplier-contact-availability" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${isEdit ? 'edit' : 'add'}-notes`}>Notizen</Label>
        <Textarea id={`${isEdit ? 'edit' : 'add'}-notes`} name="notes" defaultValue={defaults?.notes || ''} data-testid="input-supplier-contact-notes" />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => isEdit ? setEditingContact(null) : setIsAddDialogOpen(false)}>Abbrechen</Button>
        <Button type="submit" disabled={isEdit ? updateMutation.isPending : createMutation.isPending} data-testid="submit-supplier-contact">Speichern</Button>
      </div>
    </form>
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Ansprechpartner</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" data-testid="add-supplier-contact-btn">
              <Plus className="mr-2 h-4 w-4" />
              Neuer Kontakt
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neuer Kontakt</DialogTitle>
              <DialogDescription>Fügen Sie einen neuen Ansprechpartner hinzu</DialogDescription>
            </DialogHeader>
            {contactForm()}
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {contacts.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">Keine Ansprechpartner vorhanden.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>E-Mail</TableHead>
                <TableHead>Geburtstag</TableHead>
                <TableHead>Erreichbarkeit</TableHead>
                <TableHead>Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">{contact.contact_person}</TableCell>
                  <TableCell>{contact.phone || '-'}</TableCell>
                  <TableCell>{contact.email || '-'}</TableCell>
                  <TableCell>
                    {contact.birthday ? format(new Date(contact.birthday), 'dd.MM.yyyy') : '-'}
                  </TableCell>
                  <TableCell>{contact.availability || '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setEditingContact(contact)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm('Kontakt wirklich löschen?')) {
                            deleteMutation.mutate(contact.id)
                          }
                        }}
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

        <Dialog open={!!editingContact} onOpenChange={() => setEditingContact(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Kontakt bearbeiten</DialogTitle>
            </DialogHeader>
            {editingContact && contactForm(editingContact, true)}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
