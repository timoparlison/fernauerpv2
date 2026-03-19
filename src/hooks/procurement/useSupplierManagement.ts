import { useState, useRef, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'
import { Supplier, SupplierFormData, parseSupplierTypeFromImport } from '@/components/procurement/suppliers/types'
import {
  fetchSuppliers,
  createSupplier,
  updateSupplier,
  toggleSupplierStatus,
  importSuppliersBatch,
} from '@/services/procurementService'

export function useSupplierManagement() {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  const [addPaymentTerms, setAddPaymentTerms] = useState('')
  const [addDeliveryTerms, setAddDeliveryTerms] = useState('')
  const [editPaymentTerms, setEditPaymentTerms] = useState('')
  const [editDeliveryTerms, setEditDeliveryTerms] = useState('')

  const { data: suppliers = [], isLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn: fetchSuppliers,
    staleTime: 5 * 60 * 1000,
  })

  const createSupplierMutation = useMutation({
    mutationFn: (data: SupplierFormData) => createSupplier(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
      toast.success('Lieferant erfolgreich erstellt')
      setIsAddDialogOpen(false)
      setAddPaymentTerms('')
      setAddDeliveryTerms('')
    },
    onError: (error: Error) => {
      toast.error(`Fehler: ${error.message}`)
    },
  })

  const updateSupplierMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<SupplierFormData> & { active?: boolean } }) =>
      updateSupplier(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
      toast.success('Lieferant erfolgreich aktualisiert')
      setIsEditDialogOpen(false)
    },
    onError: (error: Error) => {
      toast.error(`Fehler: ${error.message}`)
    },
  })

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => toggleSupplierStatus(id, active),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
      toast.success(data.active ? 'Lieferant entsperrt' : 'Lieferant gesperrt')
    },
    onError: (error: Error) => {
      toast.error(`Fehler: ${error.message}`)
    },
  })

  const extractFormData = (formData: FormData, payTerms: string, delTerms: string) => ({
    name: formData.get('name') as string,
    supplier_type: formData.get('supplier_type') as Supplier['supplier_type'],
    contact_person: (formData.get('contact_person') as string) || null,
    email: (formData.get('email') as string) || null,
    phone: (formData.get('phone') as string) || null,
    address: (formData.get('address') as string) || null,
    billing_address: (formData.get('billing_address') as string) || null,
    delivery_address: (formData.get('delivery_address') as string) || null,
    payment_terms: payTerms || null,
    delivery_terms: delTerms || null,
    customer_number_at_supplier: (formData.get('customer_number_at_supplier') as string) || null,
    vat_id: (formData.get('vat_id') as string) || null,
    iban: (formData.get('iban') as string) || null,
    bic: (formData.get('bic') as string) || null,
    bank_name: (formData.get('bank_name') as string) || null,
    account_holder: (formData.get('account_holder') as string) || null,
    payment_reference: (formData.get('payment_reference') as string) || null,
    payment_purpose: (formData.get('payment_purpose') as string) || null,
    notes: (formData.get('notes') as string) || null,
  })

  const handleCreateSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const supplierData: SupplierFormData = extractFormData(formData, addPaymentTerms, addDeliveryTerms)
    createSupplierMutation.mutate(supplierData)
  }, [createSupplierMutation, addPaymentTerms, addDeliveryTerms])

  const handleUpdateSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedSupplier) return
    const formData = new FormData(e.currentTarget)
    const updates: Partial<SupplierFormData> & { active: boolean } = {
      ...extractFormData(formData, editPaymentTerms, editDeliveryTerms),
      active: formData.get('active') === 'true',
    }
    updateSupplierMutation.mutate({ id: selectedSupplier.id, updates })
  }, [selectedSupplier, updateSupplierMutation, editPaymentTerms, editDeliveryTerms])

  const handleExport = useCallback(() => {
    try {
      const exportData = suppliers.map((s) => ({
        'Lieferantennummer': s.supplier_number || '',
        'Name': s.name,
        'Typ': s.supplier_type,
        'Ansprechpartner': s.contact_person || '',
        'E-Mail': s.email || '',
        'Telefon': s.phone || '',
        'Adresse': s.address || '',
        'Rechnungsadresse': s.billing_address || '',
        'Lieferadresse': s.delivery_address || '',
        'Kundennummer beim Lieferanten': s.customer_number_at_supplier || '',
        'USt-IdNr.': s.vat_id || '',
        'Zahlungsziel': s.payment_terms || '',
        'Lieferkonditionen': s.delivery_terms || '',
        'IBAN': s.iban || '',
        'BIC': s.bic || '',
        'Bank': s.bank_name || '',
        'Kontoinhaber': s.account_holder || '',
        'Referenznummer': s.payment_reference || '',
        'Verwendungszweck': s.payment_purpose || '',
        'Notizen': s.notes || '',
        'Aktiv': s.active ? 'Ja' : 'Nein',
      }))
      const ws = XLSX.utils.json_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Lieferanten')
      const date = new Date().toISOString().split('T')[0]
      XLSX.writeFile(wb, `Lieferanten_${date}.xlsx`)
      toast.success('Export erfolgreich')
    } catch {
      toast.error('Export fehlgeschlagen')
    }
  }, [suppliers])

  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'array' })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, unknown>[]
        if (jsonData.length === 0) { toast.error('Die Excel-Datei enthält keine Daten'); return }

        const suppliersToInsert = jsonData
          .map((row) => ({
            name: (row['Name'] as string) || (row['Firmenname'] as string) || '',
            supplier_type: parseSupplierTypeFromImport(String(row['Typ'] || '')),
            contact_person: (row['Ansprechpartner'] as string) || null,
            email: (row['E-Mail'] as string) || (row['Email'] as string) || null,
            phone: (row['Telefon'] as string) || null,
            address: (row['Adresse'] as string) || (row['Rechnungsadresse'] as string) || null,
            billing_address: (row['Rechnungsadresse'] as string) || null,
            delivery_address: (row['Lieferadresse'] as string) || null,
            customer_number_at_supplier: (row['Kundennummer beim Lieferanten'] as string) || null,
            vat_id: (row['USt-IdNr.'] as string) || null,
            payment_terms: (row['Zahlungsziel'] as string) || null,
            delivery_terms: (row['Lieferkonditionen'] as string) || null,
            iban: (row['IBAN'] as string) || null,
            bic: (row['BIC'] as string) || null,
            bank_name: (row['Bank'] as string) || null,
            account_holder: (row['Kontoinhaber'] as string) || null,
            payment_reference: (row['Referenznummer'] as string) || null,
            payment_purpose: (row['Verwendungszweck'] as string) || null,
            notes: (row['Notizen'] as string) || null,
            active: row['Aktiv'] !== 'Nein' && row['Aktiv'] !== 'nein' && row['Aktiv'] !== false,
          }))
          .filter((s) => s.name)

        if (suppliersToInsert.length === 0) { toast.error('Keine gültigen Lieferanten gefunden'); return }

        let insertedCount = 0, errorCount = 0
        for (let i = 0; i < suppliersToInsert.length; i += 50) {
          const batch = suppliersToInsert.slice(i, i + 50)
          try { await importSuppliersBatch(batch as Record<string, unknown>[]); insertedCount += batch.length }
          catch { errorCount += batch.length }
        }

        queryClient.invalidateQueries({ queryKey: ['suppliers'] })
        if (errorCount > 0) toast.warning(`${insertedCount} importiert, ${errorCount} fehlgeschlagen`)
        else toast.success(`${insertedCount} Lieferanten erfolgreich importiert`)
      } catch { toast.error('Import fehlgeschlagen - ungültiges Dateiformat') }
    }
    reader.readAsArrayBuffer(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [queryClient])

  const openDetailDialog = useCallback((supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setIsDetailDialogOpen(true)
  }, [])

  const openEditDialog = useCallback((supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setEditPaymentTerms(supplier.payment_terms || '')
    setEditDeliveryTerms(supplier.delivery_terms || '')
    setIsEditDialogOpen(true)
  }, [])

  const handleToggleStatus = useCallback((supplier: Supplier) => {
    toggleStatusMutation.mutate({ id: supplier.id, active: !supplier.active })
  }, [toggleStatusMutation])

  return {
    suppliers, isLoading, selectedSupplier,
    isAddDialogOpen, setIsAddDialogOpen,
    isEditDialogOpen, setIsEditDialogOpen,
    isDetailDialogOpen, setIsDetailDialogOpen,
    addPaymentTerms, setAddPaymentTerms,
    addDeliveryTerms, setAddDeliveryTerms,
    editPaymentTerms, setEditPaymentTerms,
    editDeliveryTerms, setEditDeliveryTerms,
    fileInputRef,
    handleCreateSubmit, handleUpdateSubmit,
    handleExport, handleImportClick, handleFileChange,
    openDetailDialog, openEditDialog,
    toggleSupplierStatus: handleToggleStatus,
    isCreating: createSupplierMutation.isPending,
    isUpdating: updateSupplierMutation.isPending,
  }
}
