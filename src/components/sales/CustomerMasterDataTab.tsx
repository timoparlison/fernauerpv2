import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCustomer } from '@/services/customerService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Edit, Save, X } from 'lucide-react'
import type { Customer } from './types'

interface CustomerMasterDataTabProps {
  customer: Customer
  onUpdated?: (customer: Customer) => void
}

export function CustomerMasterDataTab({ customer, onUpdated }: CustomerMasterDataTabProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [paymentTerms, setPaymentTerms] = useState(customer.payment_terms || '')
  const [deliveryTerms, setDeliveryTerms] = useState(customer.delivery_terms || '')
  const [customerType, setCustomerType] = useState<string>(customer.customer_type || 'other')
  const [billingAddress, setBillingAddress] = useState(customer.billing_address || '')
  const [deliveryAddress, setDeliveryAddress] = useState(customer.delivery_address || '')
  const queryClient = useQueryClient()

  useEffect(() => {
    setPaymentTerms(customer.payment_terms || '')
    setDeliveryTerms(customer.delivery_terms || '')
    setCustomerType(customer.customer_type || 'other')
    setBillingAddress(customer.billing_address || '')
    setDeliveryAddress(customer.delivery_address || '')
  }, [customer])

  const updateMutation = useMutation({
    mutationFn: (updates: Record<string, unknown>) => updateCustomer(customer.id, updates as Parameters<typeof updateCustomer>[1]),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      toast.success('Kundenstammdaten aktualisiert')
      setIsEditing(false)
      onUpdated?.(updated)
    },
    onError: (error: Error) => {
      toast.error(`Fehler: ${error.message}`)
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const discountRaw = formData.get('default_discount_percent')
    updateMutation.mutate({
      name: formData.get('name'),
      customer_type: customerType,
      customer_number: formData.get('customer_number') || null,
      contact_person: formData.get('contact_person') || null,
      email: formData.get('email') || null,
      phone: formData.get('phone') || null,
      address: formData.get('address') || null,
      billing_address: billingAddress || null,
      delivery_address: deliveryAddress || null,
      vat_id: formData.get('vat_id') || null,
      payment_terms: paymentTerms || null,
      delivery_terms: deliveryTerms || null,
      delivery_days: formData.get('delivery_days') || null,
      our_supplier_number_at_customer: formData.get('our_supplier_number_at_customer') || null,
      default_discount_percent: discountRaw ? parseFloat(discountRaw as string) : 0,
      iban: formData.get('iban') || null,
      bic: formData.get('bic') || null,
      account_holder: formData.get('account_holder') || null,
      payment_reference: formData.get('payment_reference') || null,
      payment_purpose: formData.get('payment_purpose') || null,
      invoice_email_1: formData.get('invoice_email_1') || null,
      invoice_email_2: formData.get('invoice_email_2') || null,
      invoice_email_3: formData.get('invoice_email_3') || null,
      notes: formData.get('notes') || null,
    })
  }

  if (isEditing) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Stammdaten bearbeiten</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" data-testid="customer-edit-form">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name *</Label>
                <Input id="edit-name" name="name" defaultValue={customer.name} required data-testid="edit-input-name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-customer_type">Typ *</Label>
                <Select value={customerType} onValueChange={setCustomerType} required>
                  <SelectTrigger data-testid="edit-select-customer-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retail">Einzelhandel</SelectItem>
                    <SelectItem value="wholesale">Großhandel</SelectItem>
                    <SelectItem value="service">Dienstleistung</SelectItem>
                    <SelectItem value="other">Sonstige</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-customer_number">Kundennummer</Label>
                <Input id="edit-customer_number" name="customer_number" defaultValue={customer.customer_number || ''} data-testid="edit-input-customer-number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-contact_person">Ansprechpartner</Label>
                <Input id="edit-contact_person" name="contact_person" defaultValue={customer.contact_person || ''} data-testid="edit-input-contact-person" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">E-Mail</Label>
                <Input id="edit-email" name="email" type="email" defaultValue={customer.email || ''} data-testid="edit-input-email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Telefon</Label>
                <Input id="edit-phone" name="phone" defaultValue={customer.phone || ''} data-testid="edit-input-phone" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-vat_id">USt-IdNr.</Label>
                <Input id="edit-vat_id" name="vat_id" defaultValue={customer.vat_id || ''} data-testid="edit-input-vat-id" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-our_supplier_number_at_customer">Unsere Lieferantennr. beim Kunden</Label>
                <Input id="edit-our_supplier_number_at_customer" name="our_supplier_number_at_customer" defaultValue={customer.our_supplier_number_at_customer || ''} data-testid="edit-input-supplier-number-at-customer" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-default_discount_percent">Standard-Rabatt (%)</Label>
                <Input id="edit-default_discount_percent" name="default_discount_percent" type="number" step="0.01" defaultValue={customer.default_discount_percent ?? 0} data-testid="edit-input-discount" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-address">Adresse</Label>
              <Textarea id="edit-address" name="address" defaultValue={customer.address || ''} rows={2} data-testid="edit-input-address" />
            </div>
            <div className="space-y-2">
              <Label>Rechnungsadresse</Label>
              <Textarea value={billingAddress} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBillingAddress(e.target.value)} rows={2} data-testid="edit-input-billing-address" />
            </div>
            <div className="space-y-2">
              <Label>Lieferadresse</Label>
              <Textarea value={deliveryAddress} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDeliveryAddress(e.target.value)} rows={2} data-testid="edit-input-delivery-address" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Zahlungsbedingungen</Label>
                <Input
                  name="payment_terms"
                  value={paymentTerms}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPaymentTerms(e.target.value)}
                  placeholder="z.B. 30 Tage netto"
                  data-testid="edit-input-payment-terms"
                />
              </div>
              <div className="space-y-2">
                <Label>Lieferbedingungen</Label>
                <Input
                  name="delivery_terms"
                  value={deliveryTerms}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeliveryTerms(e.target.value)}
                  placeholder="z.B. DAP Werk"
                  data-testid="edit-input-delivery-terms"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-delivery_days">Liefertage</Label>
                <Input id="edit-delivery_days" name="delivery_days" defaultValue={customer.delivery_days || ''} placeholder="z.B. Mo, Mi, Fr" data-testid="edit-input-delivery-days" />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Bankdaten</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-account_holder">Kontoinhaber</Label>
                  <Input id="edit-account_holder" name="account_holder" defaultValue={customer.account_holder || ''} data-testid="edit-input-account-holder" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-iban">IBAN</Label>
                  <Input id="edit-iban" name="iban" defaultValue={customer.iban || ''} data-testid="edit-input-iban" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-bic">BIC</Label>
                  <Input id="edit-bic" name="bic" defaultValue={customer.bic || ''} data-testid="edit-input-bic" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-payment_reference">Zahlungsreferenz</Label>
                  <Input id="edit-payment_reference" name="payment_reference" defaultValue={customer.payment_reference || ''} data-testid="edit-input-payment-reference" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="edit-payment_purpose">Verwendungszweck</Label>
                  <Input id="edit-payment_purpose" name="payment_purpose" defaultValue={customer.payment_purpose || ''} data-testid="edit-input-payment-purpose" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">E-Mails für Rechnungsversand</h4>
              <p className="text-sm text-muted-foreground">Rechnungen werden an alle angegebenen E-Mail-Adressen versendet.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-invoice_email_1">E-Mail 1</Label>
                  <Input id="edit-invoice_email_1" name="invoice_email_1" type="email" defaultValue={customer.invoice_email_1 || ''} placeholder="rechnung@beispiel.de" data-testid="edit-input-invoice-email-1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-invoice_email_2">E-Mail 2</Label>
                  <Input id="edit-invoice_email_2" name="invoice_email_2" type="email" defaultValue={customer.invoice_email_2 || ''} placeholder="buchhaltung@beispiel.de" data-testid="edit-input-invoice-email-2" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-invoice_email_3">E-Mail 3</Label>
                  <Input id="edit-invoice_email_3" name="invoice_email_3" type="email" defaultValue={customer.invoice_email_3 || ''} placeholder="kopie@beispiel.de" data-testid="edit-input-invoice-email-3" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notizen</Label>
              <Textarea id="edit-notes" name="notes" defaultValue={customer.notes || ''} rows={3} data-testid="edit-input-notes" />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Abbrechen</Button>
              <Button type="submit" disabled={updateMutation.isPending} data-testid="edit-submit-customer">
                <Save className="mr-2 h-4 w-4" />
                {updateMutation.isPending ? 'Speichert...' : 'Speichern'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Stammdaten</CardTitle>
        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} data-testid="edit-customer-btn">
          <Edit className="mr-2 h-4 w-4" />
          Bearbeiten
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Name</p>
            <p className="text-sm">{customer.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Typ</p>
            <p className="text-sm">{customer.customer_type}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <Badge variant={customer.active ? 'default' : 'destructive'}>
              {customer.active ? 'Aktiv' : 'Inaktiv'}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Kundennummer</p>
            <p className="text-sm">{customer.customer_number || '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Ansprechpartner</p>
            <p className="text-sm">{customer.contact_person || '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">E-Mail</p>
            <p className="text-sm">{customer.email || '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Telefon</p>
            <p className="text-sm">{customer.phone || '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">USt-IdNr.</p>
            <p className="text-sm">{customer.vat_id || '-'}</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">Adresse</p>
          <p className="text-sm whitespace-pre-line">{customer.address || '-'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Rechnungsadresse</p>
          <p className="text-sm whitespace-pre-line">{customer.billing_address || '-'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Lieferadresse</p>
          <p className="text-sm whitespace-pre-line">{customer.delivery_address || '-'}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Zahlungsbedingungen</p>
            <p className="text-sm">{customer.payment_terms || '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Lieferbedingungen</p>
            <p className="text-sm">{customer.delivery_terms || '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Liefertage</p>
            <p className="text-sm">{customer.delivery_days || '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Unsere Lieferantennr. beim Kunden</p>
            <p className="text-sm">{customer.our_supplier_number_at_customer || '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Standard-Rabatt</p>
            <p className="text-sm">{customer.default_discount_percent != null ? `${customer.default_discount_percent}%` : '-'}</p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">Bankdaten</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Kontoinhaber</p>
              <p className="text-sm">{customer.account_holder || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">IBAN</p>
              <p className="text-sm">{customer.iban || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">BIC</p>
              <p className="text-sm">{customer.bic || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Zahlungsreferenz</p>
              <p className="text-sm">{customer.payment_reference || '-'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Verwendungszweck</p>
              <p className="text-sm">{customer.payment_purpose || '-'}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">E-Mails für Rechnungsversand</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">E-Mail 1</p>
              <p className="text-sm">{customer.invoice_email_1 || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">E-Mail 2</p>
              <p className="text-sm">{customer.invoice_email_2 || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">E-Mail 3</p>
              <p className="text-sm">{customer.invoice_email_3 || '-'}</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">Notizen</p>
          <p className="text-sm whitespace-pre-line">{customer.notes || '-'}</p>
        </div>
      </CardContent>
    </Card>
  )
}
