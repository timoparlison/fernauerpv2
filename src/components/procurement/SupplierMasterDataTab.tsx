import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateSupplier } from '@/services/procurementService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Edit, Save, X } from 'lucide-react'
import { Supplier } from '@/components/procurement/suppliers/types'

interface SupplierMasterDataTabProps {
  supplier: Supplier
}

export function SupplierMasterDataTab({ supplier }: SupplierMasterDataTabProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [paymentTerms, setPaymentTerms] = useState(supplier.payment_terms || '')
  const [deliveryTerms, setDeliveryTerms] = useState(supplier.delivery_terms || '')
  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: (updates: Parameters<typeof updateSupplier>[1]) => updateSupplier(supplier.id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
      toast.success('Stammdaten erfolgreich aktualisiert')
      setIsEditing(false)
    },
    onError: (error: Error) => toast.error(`Fehler: ${error.message}`),
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const updates = {
      name: formData.get('name') as string,
      supplier_type: formData.get('supplier_type') as Supplier['supplier_type'],
      contact_person: (formData.get('contact_person') as string) || null,
      email: (formData.get('email') as string) || null,
      phone: (formData.get('phone') as string) || null,
      address: (formData.get('address') as string) || null,
      delivery_address: (formData.get('delivery_address') as string) || null,
      payment_terms: paymentTerms || null,
      delivery_terms: deliveryTerms || null,
      customer_number_at_supplier: (formData.get('customer_number_at_supplier') as string) || null,
      vat_id: (formData.get('vat_id') as string) || null,
      iban: (formData.get('iban') as string) || null,
      bic: (formData.get('bic') as string) || null,
      account_holder: (formData.get('account_holder') as string) || null,
      payment_reference: (formData.get('payment_reference') as string) || null,
      payment_purpose: (formData.get('payment_purpose') as string) || null,
      notes: (formData.get('notes') as string) || null,
      active: formData.get('active') === 'true',
    }
    updateMutation.mutate(updates)
  }

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Stammdaten bearbeiten
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)} aria-label="Schließen">
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="master-name">Firmenname *</Label>
                <Input id="master-name" name="name" defaultValue={supplier.name} required />
              </div>
              <div>
                <Label htmlFor="master-supplier_type">Lieferantentyp *</Label>
                <Select name="supplier_type" defaultValue={supplier.supplier_type}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="material">Material</SelectItem>
                    <SelectItem value="service">Dienstleistung</SelectItem>
                    <SelectItem value="both">Beides</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="master-active">Status</Label>
                <Select name="active" defaultValue={supplier.active ? 'true' : 'false'}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Aktiv</SelectItem>
                    <SelectItem value="false">Gesperrt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="master-contact_person">Ansprechpartner</Label>
                <Input id="master-contact_person" name="contact_person" defaultValue={supplier.contact_person || ''} />
              </div>
              <div>
                <Label htmlFor="master-email">E-Mail</Label>
                <Input id="master-email" name="email" type="email" defaultValue={supplier.email || ''} />
              </div>
              <div>
                <Label htmlFor="master-phone">Telefon</Label>
                <Input id="master-phone" name="phone" defaultValue={supplier.phone || ''} />
              </div>
              <div className="col-span-2">
                <Label htmlFor="master-address">Rechnungsadresse</Label>
                <Textarea id="master-address" name="address" defaultValue={supplier.address || ''} />
              </div>
              <div className="col-span-2">
                <Label htmlFor="master-delivery_address">Lieferadresse</Label>
                <Textarea id="master-delivery_address" name="delivery_address" defaultValue={supplier.delivery_address || ''} />
              </div>
              <div>
                <Label>Zahlungsbedingungen</Label>
                <Input value={paymentTerms} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPaymentTerms(e.target.value)} placeholder="z.B. 30 Tage netto" />
              </div>
              <div>
                <Label>Lieferbedingungen</Label>
                <Input value={deliveryTerms} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeliveryTerms(e.target.value)} placeholder="z.B. DAP Werk" />
              </div>
              <div>
                <Label htmlFor="master-customer_number">Unsere Kundennummer</Label>
                <Input id="master-customer_number" name="customer_number_at_supplier" defaultValue={supplier.customer_number_at_supplier || ''} />
              </div>
              <div>
                <Label htmlFor="master-vat_id">USt-IdNr.</Label>
                <Input id="master-vat_id" name="vat_id" defaultValue={supplier.vat_id || ''} />
              </div>
              <div className="col-span-2"><h4 className="font-semibold mt-4 mb-2">Bankdaten</h4></div>
              <div>
                <Label htmlFor="master-iban">IBAN</Label>
                <Input id="master-iban" name="iban" defaultValue={supplier.iban || ''} />
              </div>
              <div>
                <Label htmlFor="master-bic">BIC</Label>
                <Input id="master-bic" name="bic" defaultValue={supplier.bic || ''} />
              </div>
              <div className="col-span-2">
                <Label htmlFor="master-account_holder">Kontoinhaber</Label>
                <Input id="master-account_holder" name="account_holder" defaultValue={supplier.account_holder || ''} />
              </div>
              <div className="col-span-2">
                <Label htmlFor="master-payment_reference">Feste Referenznummer</Label>
                <Input id="master-payment_reference" name="payment_reference" defaultValue={supplier.payment_reference || ''} placeholder="z.B. Kundennummer für Verwendungszweck" />
              </div>
              <div className="col-span-2">
                <Label htmlFor="master-payment_purpose">Verwendungszweck</Label>
                <Input id="master-payment_purpose" name="payment_purpose" defaultValue={supplier.payment_purpose || ''} />
              </div>
              <div className="col-span-2">
                <Label htmlFor="master-notes">Interne Anmerkungen</Label>
                <Textarea id="master-notes" name="notes" defaultValue={supplier.notes || ''} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Abbrechen</Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                <Save className="mr-2 h-4 w-4" />
                Speichern
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Stammdaten
          <Button size="sm" onClick={() => setIsEditing(true)} data-testid="btn-edit-master">
            <Edit className="mr-2 h-4 w-4" />
            Bearbeiten
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Firmenname</Label><p className="text-sm mt-1" data-testid="detail-name">{supplier.name}</p></div>
          <div><Label>Lieferantentyp</Label><p className="text-sm mt-1">{supplier.supplier_type === 'material' ? 'Material' : supplier.supplier_type === 'service' ? 'Dienstleistung' : 'Beides'}</p></div>
          <div><Label>Ansprechpartner</Label><p className="text-sm mt-1" data-testid="detail-contact-person">{supplier.contact_person || '-'}</p></div>
          <div><Label>E-Mail</Label><p className="text-sm mt-1" data-testid="detail-email">{supplier.email || '-'}</p></div>
          <div><Label>Telefon</Label><p className="text-sm mt-1" data-testid="detail-phone">{supplier.phone || '-'}</p></div>
          <div><Label>Status</Label><div className="mt-1"><Badge variant={supplier.active ? 'default' : 'destructive'}>{supplier.active ? 'Aktiv' : 'Gesperrt'}</Badge></div></div>
          <div className="col-span-2"><Label>Rechnungsadresse</Label><p className="text-sm mt-1 whitespace-pre-line" data-testid="detail-address">{supplier.address || '-'}</p></div>
          <div className="col-span-2"><Label>Lieferadresse</Label><p className="text-sm mt-1 whitespace-pre-line" data-testid="detail-delivery-address">{supplier.delivery_address || '-'}</p></div>
          <div><Label>Zahlungsbedingungen</Label><p className="text-sm mt-1" data-testid="detail-payment-terms">{supplier.payment_terms || '-'}</p></div>
          <div><Label>Lieferbedingungen</Label><p className="text-sm mt-1" data-testid="detail-delivery-terms">{supplier.delivery_terms || '-'}</p></div>
          <div><Label>Unsere Kundennummer</Label><p className="text-sm mt-1" data-testid="detail-customer-number">{supplier.customer_number_at_supplier || '-'}</p></div>
          <div><Label>USt-IdNr.</Label><p className="text-sm mt-1" data-testid="detail-vat-id">{supplier.vat_id || '-'}</p></div>
        </div>
        <div className="mt-4">
          <h4 className="font-semibold mb-3">Bankdaten</h4>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>IBAN</Label><p className="text-sm mt-1" data-testid="detail-iban">{supplier.iban || '-'}</p></div>
            <div><Label>BIC</Label><p className="text-sm mt-1" data-testid="detail-bic">{supplier.bic || '-'}</p></div>
            <div className="col-span-2"><Label>Kontoinhaber</Label><p className="text-sm mt-1" data-testid="detail-account-holder">{supplier.account_holder || '-'}</p></div>
            <div className="col-span-2"><Label>Feste Referenznummer</Label><p className="text-sm mt-1">{supplier.payment_reference || '-'}</p></div>
            <div className="col-span-2"><Label>Verwendungszweck</Label><p className="text-sm mt-1">{supplier.payment_purpose || '-'}</p></div>
          </div>
        </div>
        <div className="mt-4">
          <Label>Interne Anmerkungen</Label>
          <p className="text-sm mt-1 whitespace-pre-line" data-testid="detail-notes">{supplier.notes || '-'}</p>
        </div>
      </CardContent>
    </Card>
  )
}
