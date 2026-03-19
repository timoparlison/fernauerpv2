import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { Supplier } from './types'

interface SupplierFormDialogProps {
  mode: 'create' | 'edit'
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  supplier?: Supplier | null
  paymentTerms: string
  onPaymentTermsChange: (value: string) => void
  deliveryTerms: string
  onDeliveryTermsChange: (value: string) => void
  isSubmitting?: boolean
}

export function SupplierFormDialog({
  mode, open, onOpenChange, onSubmit, supplier,
  paymentTerms, onPaymentTermsChange,
  deliveryTerms, onDeliveryTermsChange,
  isSubmitting,
}: SupplierFormDialogProps) {
  const isEdit = mode === 'edit'
  const title = isEdit ? 'Lieferant bearbeiten' : 'Neuer Lieferant'
  const description = isEdit ? 'Ändern Sie die Daten des Lieferanten' : 'Erfassen Sie die Daten des neuen Lieferanten'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!isEdit && (
        <DialogTrigger asChild>
          <Button className="w-full sm:w-auto" data-testid="open-supplier-dialog">
            <Plus className="mr-2 h-4 w-4" />
            Lieferant anlegen
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto w-[95vw] md:w-full p-3 md:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-xl" data-testid="dialog-title">{title}</DialogTitle>
          <DialogDescription className="text-xs md:text-sm">{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4" data-testid="supplier-form">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="col-span-1 sm:col-span-2">
              <Label htmlFor={`${mode}-name`}>Firmenname *</Label>
              <Input
                id={`${mode}-name`}
                name="name"
                defaultValue={supplier?.name || ''}
                required
                data-testid="input-name"
              />
            </div>

            <div>
              <Label htmlFor={`${mode}-supplier_type`}>Lieferantentyp *</Label>
              <Select name="supplier_type" defaultValue={supplier?.supplier_type || undefined} required>
                <SelectTrigger data-testid="select-supplier-type">
                  <SelectValue placeholder="Typ auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="material">Material</SelectItem>
                  <SelectItem value="service">Dienstleistung</SelectItem>
                  <SelectItem value="both">Beides</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isEdit && (
              <div>
                <Label htmlFor={`${mode}-active`}>Status</Label>
                <Select name="active" defaultValue={supplier?.active ? 'true' : 'false'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Aktiv</SelectItem>
                    <SelectItem value="false">Inaktiv</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className={isEdit ? '' : 'col-span-1'}>
              <Label htmlFor={`${mode}-contact_person`}>Ansprechpartner</Label>
              <Input
                id={`${mode}-contact_person`}
                name="contact_person"
                defaultValue={supplier?.contact_person || ''}
                data-testid="input-contact-person"
              />
            </div>

            <div>
              <Label htmlFor={`${mode}-email`}>E-Mail</Label>
              <Input
                id={`${mode}-email`}
                name="email"
                type="email"
                defaultValue={supplier?.email || ''}
                data-testid="input-email"
              />
            </div>

            <div>
              <Label htmlFor={`${mode}-phone`}>Telefon</Label>
              <Input
                id={`${mode}-phone`}
                name="phone"
                defaultValue={supplier?.phone || ''}
                data-testid="input-phone"
              />
            </div>

            <div className="col-span-1 sm:col-span-2">
              <Label htmlFor={`${mode}-address`}>Rechnungsadresse</Label>
              <Textarea
                id={`${mode}-address`}
                name="address"
                defaultValue={supplier?.address || ''}
                data-testid="input-address"
              />
            </div>

            <div className="col-span-1 sm:col-span-2">
              <Label htmlFor={`${mode}-delivery_address`}>Lieferadresse</Label>
              <Textarea
                id={`${mode}-delivery_address`}
                name="delivery_address"
                defaultValue={supplier?.delivery_address || ''}
                data-testid="input-delivery-address"
              />
            </div>

            <div>
              <Label>Zahlungsbedingungen</Label>
              <Input
                name="payment_terms"
                value={paymentTerms}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onPaymentTermsChange(e.target.value)}
                placeholder="z.B. 30 Tage netto"
                data-testid="input-payment-terms"
              />
            </div>

            <div>
              <Label>Lieferbedingungen</Label>
              <Input
                name="delivery_terms"
                value={deliveryTerms}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onDeliveryTermsChange(e.target.value)}
                placeholder="z.B. DAP Werk"
                data-testid="input-delivery-terms"
              />
            </div>

            <div>
              <Label htmlFor={`${mode}-customer_number_at_supplier`}>Unsere Kundennummer</Label>
              <Input
                id={`${mode}-customer_number_at_supplier`}
                name="customer_number_at_supplier"
                defaultValue={supplier?.customer_number_at_supplier || ''}
                data-testid="input-customer-number"
              />
            </div>

            <div>
              <Label htmlFor={`${mode}-vat_id`}>USt-IdNr.</Label>
              <Input
                id={`${mode}-vat_id`}
                name="vat_id"
                defaultValue={supplier?.vat_id || ''}
                data-testid="input-vat-id"
              />
            </div>

            {isEdit && (
              <>
                <div className="col-span-1 sm:col-span-2">
                  <h4 className="font-semibold mt-2 mb-1">Bankdaten</h4>
                </div>
                <div>
                  <Label htmlFor={`${mode}-iban`}>IBAN</Label>
                  <Input id={`${mode}-iban`} name="iban" defaultValue={supplier?.iban || ''} data-testid="input-iban" />
                </div>
                <div>
                  <Label htmlFor={`${mode}-bic`}>BIC</Label>
                  <Input id={`${mode}-bic`} name="bic" defaultValue={supplier?.bic || ''} data-testid="input-bic" />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <Label htmlFor={`${mode}-account_holder`}>Kontoinhaber</Label>
                  <Input id={`${mode}-account_holder`} name="account_holder" defaultValue={supplier?.account_holder || ''} data-testid="input-account-holder" />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <Label htmlFor={`${mode}-payment_reference`}>Feste Referenznummer</Label>
                  <Input id={`${mode}-payment_reference`} name="payment_reference" defaultValue={supplier?.payment_reference || ''} placeholder="z.B. Kundennummer für Verwendungszweck" />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <Label htmlFor={`${mode}-payment_purpose`}>Verwendungszweck</Label>
                  <Input id={`${mode}-payment_purpose`} name="payment_purpose" defaultValue={supplier?.payment_purpose || ''} />
                </div>
              </>
            )}

            <div className="col-span-1 sm:col-span-2">
              <Label htmlFor={`${mode}-notes`}>Interne Anmerkungen</Label>
              <Textarea
                id={`${mode}-notes`}
                name="notes"
                defaultValue={supplier?.notes || ''}
                data-testid="input-notes"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={isSubmitting} data-testid="submit-supplier">
              {isSubmitting ? 'Speichert...' : 'Speichern'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
