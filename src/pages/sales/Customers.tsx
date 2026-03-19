import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchCustomers, createCustomer, toggleCustomerStatus, importCustomersBatch } from '@/services/customerService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Plus, Eye, Ban, CheckCircle, Download, FileUp, Search } from 'lucide-react'
import { TablePagination } from '@/components/ui/table-pagination'
import { CustomerMasterDataTab } from '@/components/sales/CustomerMasterDataTab'
import { CustomerContactsTab } from '@/components/sales/CustomerContactsTab'
import { getCustomerTypeLabel } from '@/components/sales/types'
import type { Customer, CustomerType } from '@/components/sales/types'
import * as XLSX from 'xlsx'
import { z } from 'zod'

const CustomerImportRowSchema = z.object({
  customer_number: z.string().min(1, 'Kundennummer ist erforderlich'),
  name: z.string().min(1, 'Name ist erforderlich'),
  customer_type: z.string().optional().default('other'),
  email: z.string().email('Ungültige E-Mail-Adresse').optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  vat_id: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})

export default function Customers() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [addPaymentTerms, setAddPaymentTerms] = useState('')
  const [addDeliveryTerms, setAddDeliveryTerms] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: customers = [] } = useQuery({
    queryKey: ['customers', searchTerm],
    queryFn: () => fetchCustomers(searchTerm || undefined),
  })

  const totalPages = Math.ceil(customers.length / pageSize)
  const paginatedCustomers = customers.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const createMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      toast.success('Kunde erfolgreich erstellt')
      setIsAddDialogOpen(false)
      setAddPaymentTerms('')
      setAddDeliveryTerms('')
    },
    onError: (error: Error) => {
      toast.error(`Fehler: ${error.message}`)
    },
  })

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      toggleCustomerStatus(id, active),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      // Update selected customer if open
      if (selectedCustomer?.id === data.id) {
        setSelectedCustomer(data)
      }
      toast.success(data.active ? 'Kunde aktiviert' : 'Kunde deaktiviert')
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const discountRaw = formData.get('default_discount_percent')
    createMutation.mutate({
      name: formData.get('name') as string,
      customer_type: formData.get('customer_type') as CustomerType,
      customer_number: (formData.get('customer_number') as string) || null,
      contact_person: (formData.get('contact_person') as string) || null,
      email: (formData.get('email') as string) || null,
      phone: (formData.get('phone') as string) || null,
      address: (formData.get('address') as string) || null,
      billing_address: (formData.get('billing_address') as string) || null,
      delivery_address: (formData.get('delivery_address') as string) || null,
      vat_id: (formData.get('vat_id') as string) || null,
      payment_terms: addPaymentTerms || null,
      delivery_terms: addDeliveryTerms || null,
      delivery_days: (formData.get('delivery_days') as string) || null,
      our_supplier_number_at_customer: (formData.get('our_supplier_number_at_customer') as string) || null,
      default_discount_percent: discountRaw ? parseFloat(discountRaw as string) : 0,
      account_holder: (formData.get('account_holder') as string) || null,
      iban: (formData.get('iban') as string) || null,
      bic: (formData.get('bic') as string) || null,
      payment_reference: (formData.get('payment_reference') as string) || null,
      payment_purpose: (formData.get('payment_purpose') as string) || null,
      notes: (formData.get('notes') as string) || null,
    })
  }

  const handleExport = () => {
    try {
      const exportData = customers.map((c) => ({
        Kundennummer: c.customer_number || '',
        Name: c.name,
        Typ: c.customer_type,
        Ansprechpartner: c.contact_person || '',
        'E-Mail': c.email || '',
        Telefon: c.phone || '',
        Adresse: c.address || '',
        Rechnungsadresse: c.billing_address || '',
        Lieferadresse: c.delivery_address || '',
        'USt-IdNr.': c.vat_id || '',
        Zahlungsbedingungen: c.payment_terms || '',
        Lieferbedingungen: c.delivery_terms || '',
        IBAN: c.iban || '',
        BIC: c.bic || '',
        Kontoinhaber: c.account_holder || '',
        Notizen: c.notes || '',
        Aktiv: c.active ? 'Ja' : 'Nein',
      }))
      const ws = XLSX.utils.json_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Kunden')
      XLSX.writeFile(wb, `Kunden_${new Date().toISOString().split('T')[0]}.xlsx`)
      toast.success('Export erfolgreich')
    } catch {
      toast.error('Export fehlgeschlagen')
    }
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    event.target.value = ''

    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, unknown>[]

      if (jsonData.length === 0) {
        toast.error('Keine Daten in der Datei gefunden')
        return
      }

      const validRows: z.infer<typeof CustomerImportRowSchema>[] = []
      const errors: string[] = []

      for (const [index, row] of jsonData.entries()) {
        const emailRaw = row['E-Mail'] ?? row['email'] ?? null
        const result = CustomerImportRowSchema.safeParse({
          customer_number: String(row['Kundennummer'] ?? row['customer_number'] ?? '').trim(),
          name: String(row['Name'] ?? row['name'] ?? '').trim(),
          customer_type: String(row['Typ'] ?? row['customer_type'] ?? 'other').trim() || 'other',
          email: emailRaw && String(emailRaw).trim() !== '' ? String(emailRaw).trim() : null,
          phone: row['Telefon'] ?? row['phone'] ?? null,
          address: row['Adresse'] ?? row['address'] ?? null,
          vat_id: row['USt-IdNr.'] ?? row['vat_id'] ?? null,
          notes: row['Notizen'] ?? row['notes'] ?? null,
        })

        if (result.success) {
          validRows.push(result.data)
        } else {
          errors.push(`Zeile ${index + 2}: ${result.error.errors.map((e) => e.message).join(', ')}`)
        }
      }

      if (validRows.length === 0) {
        toast.error(errors[0] ?? 'Keine gültigen Zeilen gefunden')
        return
      }

      await importCustomersBatch(validRows as Record<string, unknown>[])
      queryClient.invalidateQueries({ queryKey: ['customers'] })

      if (errors.length > 0) {
        toast.warning(`${validRows.length} importiert, ${errors.length} Fehler: ${errors[0]}`)
      } else {
        toast.success(`${validRows.length} Kunden erfolgreich importiert`)
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Unbekannter Fehler'
      toast.error(`Import fehlgeschlagen: ${msg}`)
    }
  }

  return (
    <div className="p-3 md:p-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div>
              <CardTitle className="text-lg md:text-xl" data-testid="page-title">Kundenstamm</CardTitle>
              <CardDescription className="text-xs md:text-sm">Verwalten Sie Ihre Kunden</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Name, Kundennummer oder E-Mail suchen..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
                data-testid="search-input"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button onClick={handleExport} variant="outline" className="gap-2 flex-1 sm:flex-initial" data-testid="export-btn">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Excel </span>Export
              </Button>
              <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="gap-2 flex-1 sm:flex-initial" data-testid="import-btn">
                <FileUp className="h-4 w-4" />
                <span className="hidden sm:inline">Excel </span>Import
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto" data-testid="open-customer-dialog">
                    <Plus className="mr-2 h-4 w-4" />
                    Neuer Kunde
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-[95vw] md:w-full max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-lg md:text-xl" data-testid="dialog-title">Neuer Kunde</DialogTitle>
                    <DialogDescription className="text-xs md:text-sm">
                      Erfassen Sie die Daten des neuen Kunden
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 mt-2" data-testid="customer-form">
                    {/* Grunddaten */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input id="name" name="name" required data-testid="input-name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customer_type">Typ *</Label>
                        <Select name="customer_type" required>
                          <SelectTrigger data-testid="select-customer-type">
                            <SelectValue placeholder="Typ auswählen" />
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
                        <Label htmlFor="customer_number">Kundennummer</Label>
                        <Input id="customer_number" name="customer_number" placeholder="Wird automatisch vergeben" disabled className="bg-muted" data-testid="input-customer-number" />
                      </div>
                    </div>

                    {/* Kontaktdaten */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contact_person">Ansprechpartner</Label>
                        <Input id="contact_person" name="contact_person" data-testid="input-contact-person" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-Mail</Label>
                        <Input id="email" name="email" type="email" data-testid="input-email" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefon</Label>
                        <Input id="phone" name="phone" data-testid="input-phone" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vat_id">USt-IdNr.</Label>
                        <Input id="vat_id" name="vat_id" data-testid="input-vat-id" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="our_supplier_number_at_customer">Unsere Lieferantennr. beim Kunden</Label>
                        <Input id="our_supplier_number_at_customer" name="our_supplier_number_at_customer" data-testid="input-supplier-number-at-customer" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="default_discount_percent">Standard-Rabatt (%)</Label>
                        <Input id="default_discount_percent" name="default_discount_percent" type="number" step="0.01" defaultValue="0" data-testid="input-discount" />
                      </div>
                    </div>

                    {/* Adressen */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">Adresse</Label>
                        <Textarea id="address" name="address" rows={3} data-testid="input-address" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billing_address">Rechnungsadresse</Label>
                        <Textarea id="billing_address" name="billing_address" rows={3} data-testid="input-billing-address" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="delivery_address">Lieferadresse</Label>
                        <Textarea id="delivery_address" name="delivery_address" rows={3} data-testid="input-delivery-address" />
                      </div>
                    </div>

                    {/* Konditionen */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Zahlungsbedingungen</Label>
                        <Input
                          name="payment_terms"
                          value={addPaymentTerms}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddPaymentTerms(e.target.value)}
                          placeholder="z.B. 30 Tage netto"
                          data-testid="input-payment-terms"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Lieferbedingungen</Label>
                        <Input
                          name="delivery_terms"
                          value={addDeliveryTerms}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddDeliveryTerms(e.target.value)}
                          placeholder="z.B. DAP Werk"
                          data-testid="input-delivery-terms"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="delivery_days">Liefertage</Label>
                        <Input id="delivery_days" name="delivery_days" placeholder="z.B. Mo, Mi, Fr" data-testid="input-delivery-days" />
                      </div>
                    </div>

                    {/* Bankdaten */}
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3">Bankdaten</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="account_holder">Kontoinhaber</Label>
                          <Input id="account_holder" name="account_holder" data-testid="input-account-holder" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="iban">IBAN</Label>
                          <Input id="iban" name="iban" data-testid="input-iban" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bic">BIC</Label>
                          <Input id="bic" name="bic" data-testid="input-bic" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="payment_reference">Zahlungsreferenz</Label>
                          <Input id="payment_reference" name="payment_reference" data-testid="input-payment-reference" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="payment_purpose">Verwendungszweck</Label>
                          <Input id="payment_purpose" name="payment_purpose" data-testid="input-payment-purpose" />
                        </div>
                      </div>
                    </div>

                    {/* Notizen */}
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notizen</Label>
                      <Textarea id="notes" name="notes" rows={2} data-testid="input-notes" />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Abbrechen</Button>
                      <Button type="submit" disabled={createMutation.isPending} data-testid="submit-customer">
                        {createMutation.isPending ? 'Speichert...' : 'Speichern'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto -mx-3 md:-mx-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[150px]">Name</TableHead>
                <TableHead className="min-w-[120px]">Typ</TableHead>
                <TableHead className="min-w-[150px]">Ansprechpartner</TableHead>
                <TableHead className="min-w-[180px]">E-Mail</TableHead>
                <TableHead className="min-w-[120px]">Telefon</TableHead>
                <TableHead className="min-w-[100px]">Status</TableHead>
                <TableHead className="min-w-[100px]">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCustomers.map((customer) => (
                <TableRow key={customer.id} data-testid="customer-row">
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" data-testid="customer-type-badge">
                      {getCustomerTypeLabel(customer.customer_type)}
                    </Badge>
                  </TableCell>
                  <TableCell>{customer.contact_person || '-'}</TableCell>
                  <TableCell>{customer.email || '-'}</TableCell>
                  <TableCell>{customer.phone || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={customer.active ? 'default' : 'destructive'} data-testid="customer-status-badge">
                      {customer.active ? 'Aktiv' : 'Inaktiv'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        data-testid="view-customer-btn"
                        onClick={() => {
                          setSelectedCustomer(customer)
                          setIsDetailDialogOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        data-testid="toggle-status-btn"
                        onClick={() => toggleStatusMutation.mutate({ id: customer.id, active: !customer.active })}
                      >
                        {customer.active ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {customers.length > 0 && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={customers.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1) }}
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-6xl w-[95vw] md:w-full max-h-[90vh] overflow-y-auto p-3 md:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl" data-testid="detail-dialog-title">{selectedCustomer?.name}</DialogTitle>
            <DialogDescription className="text-xs md:text-sm">Kundendetails und Verwaltung</DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <Tabs defaultValue="master" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="master" className="text-xs md:text-sm">Stammdaten</TabsTrigger>
                <TabsTrigger value="contacts" className="text-xs md:text-sm">Kontakte</TabsTrigger>
              </TabsList>
              <TabsContent value="master">
                <CustomerMasterDataTab
                  customer={selectedCustomer}
                  onUpdated={(updated) => setSelectedCustomer(updated)}
                />
              </TabsContent>
              <TabsContent value="contacts">
                <CustomerContactsTab customerId={selectedCustomer.id} />
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
