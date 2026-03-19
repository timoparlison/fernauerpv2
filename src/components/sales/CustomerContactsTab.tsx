import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchCustomerContacts,
  createCustomerContact,
  updateCustomerContact,
  deleteCustomerContact,
} from '@/services/customerService'
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
import type { CustomerContact } from './types'

interface CustomerContactsTabProps {
  customerId: string
}

export function CustomerContactsTab({ customerId }: CustomerContactsTabProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<CustomerContact | null>(null)
  const queryClient = useQueryClient()

  const { data: contacts = [] } = useQuery({
    queryKey: ['customer-contacts', customerId],
    queryFn: () => fetchCustomerContacts(customerId),
  })

  const createContactMutation = useMutation({
    mutationFn: (contactData: Record<string, unknown>) =>
      createCustomerContact(customerId, contactData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-contacts', customerId] })
      toast.success('Kontakt erfolgreich erstellt')
      setIsAddDialogOpen(false)
    },
    onError: (error: Error) => {
      toast.error(`Fehler: ${error.message}`)
    },
  })

  const updateContactMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Record<string, unknown> }) =>
      updateCustomerContact(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-contacts', customerId] })
      toast.success('Kontakt erfolgreich aktualisiert')
      setEditingContact(null)
    },
    onError: (error: Error) => {
      toast.error(`Fehler: ${error.message}`)
    },
  })

  const deleteContactMutation = useMutation({
    mutationFn: (id: string) => deleteCustomerContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-contacts', customerId] })
      toast.success('Kontakt erfolgreich gelöscht')
    },
    onError: (error: Error) => {
      toast.error(`Fehler: ${error.message}`)
    },
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
      updateContactMutation.mutate({ id: editingContact.id, updates: contactData })
    } else {
      createContactMutation.mutate(contactData)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Ansprechpartner</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" data-testid="add-contact-btn">
              <Plus className="mr-2 h-4 w-4" />
              Neuer Kontakt
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neuer Kontakt</DialogTitle>
              <DialogDescription>Fügen Sie einen neuen Ansprechpartner hinzu</DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4" data-testid="contact-form">
              <div className="space-y-2">
                <Label htmlFor="contact_person">Ansprechpartner *</Label>
                <Input id="contact_person" name="contact_person" required data-testid="input-contact-person" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" name="phone" data-testid="input-contact-phone" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input id="email" name="email" type="email" data-testid="input-contact-email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthday">Geburtstag</Label>
                <Input id="birthday" name="birthday" type="date" data-testid="input-contact-birthday" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availability">Erreichbarkeit</Label>
                <Input id="availability" name="availability" data-testid="input-contact-availability" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notizen</Label>
                <Textarea id="notes" name="notes" data-testid="input-contact-notes" />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Abbrechen</Button>
                <Button type="submit" disabled={createContactMutation.isPending} data-testid="submit-contact">Speichern</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
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
                <TableCell>{contact.contact_person}</TableCell>
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
                          deleteContactMutation.mutate(contact.id)
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

        <Dialog open={!!editingContact} onOpenChange={() => setEditingContact(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Kontakt bearbeiten</DialogTitle>
            </DialogHeader>
            {editingContact && (
              <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-contact_person">Ansprechpartner *</Label>
                  <Input id="edit-contact_person" name="contact_person" defaultValue={editingContact.contact_person} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Telefon</Label>
                  <Input id="edit-phone" name="phone" defaultValue={editingContact.phone || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">E-Mail</Label>
                  <Input id="edit-email" name="email" type="email" defaultValue={editingContact.email || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-birthday">Geburtstag</Label>
                  <Input id="edit-birthday" name="birthday" type="date" defaultValue={editingContact.birthday || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-availability">Erreichbarkeit</Label>
                  <Input id="edit-availability" name="availability" defaultValue={editingContact.availability || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-notes">Notizen</Label>
                  <Textarea id="edit-notes" name="notes" defaultValue={editingContact.notes || ''} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setEditingContact(null)}>Abbrechen</Button>
                  <Button type="submit" disabled={updateContactMutation.isPending}>Speichern</Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
