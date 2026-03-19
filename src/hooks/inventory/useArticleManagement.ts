import { useState, useRef, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'
import {
  Article, ArticleFormData, ArticleType, ArticleUnit, TrackingMode,
  articleTypePrefixes, parseArticleTypeFromImport, parseArticleUnitFromImport,
} from '@/components/inventory/articles/types'
import {
  fetchArticles,
  createArticle,
  updateArticle,
  toggleArticleStatus,
  generateArticleNumber,
  importArticlesBatch,
} from '@/services/inventoryService'

export function useArticleManagement() {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: fetchArticles,
    staleTime: 5 * 60 * 1000,
  })

  const createArticleMutation = useMutation({
    mutationFn: async (data: ArticleFormData) => {
      const prefix = articleTypePrefixes[data.article_type]
      const articleNumber = await generateArticleNumber(prefix)
      return createArticle({ ...data, article_number: articleNumber })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
      toast.success('Artikel erfolgreich erstellt')
      setIsAddDialogOpen(false)
    },
    onError: (error: Error) => {
      toast.error(`Fehler: ${error.message}`)
    },
  })

  const updateArticleMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<ArticleFormData> & { active?: boolean } }) =>
      updateArticle(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
      toast.success('Artikel erfolgreich aktualisiert')
      setIsEditDialogOpen(false)
    },
    onError: (error: Error) => {
      toast.error(`Fehler: ${error.message}`)
    },
  })

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => toggleArticleStatus(id, active),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
      toast.success(data.active ? 'Artikel aktiviert' : 'Artikel deaktiviert')
    },
    onError: (error: Error) => {
      toast.error(`Fehler: ${error.message}`)
    },
  })

  const handleCreateSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const articleData: ArticleFormData = {
      article_type: formData.get('article_type') as ArticleType,
      article_name: formData.get('article_name') as string,
      additional_description: (formData.get('additional_description') as string) || null,
      unit: (formData.get('unit') as ArticleUnit) || 'piece',
      net_weight: formData.get('net_weight') ? Number(formData.get('net_weight')) : null,
      material: (formData.get('material') as string) || null,
      country_of_origin: (formData.get('country_of_origin') as string) || null,
      customs_tariff_number: (formData.get('customs_tariff_number') as string) || null,
      drawing_number: (formData.get('drawing_number') as string) || null,
      drawing_revision: (formData.get('drawing_revision') as string) || null,
      default_price: formData.get('default_price') ? Number(formData.get('default_price')) : null,
      manufacturing_cost: formData.get('manufacturing_cost') ? Number(formData.get('manufacturing_cost')) : null,
      default_warranty_months: formData.get('default_warranty_months') ? Number(formData.get('default_warranty_months')) : null,
      supplier_article_number: (formData.get('supplier_article_number') as string) || null,
      tracking_mode: (formData.get('tracking_mode') as TrackingMode) || null,
      requires_calibration: formData.get('requires_calibration') === 'true',
      requires_certificate: formData.get('requires_certificate') === 'true',
      requires_expiry_tracking: formData.get('requires_expiry_tracking') === 'true',
      requires_incoming_inspection: formData.get('requires_incoming_inspection') === 'true',
    }
    createArticleMutation.mutate(articleData)
  }, [createArticleMutation])

  const handleUpdateSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedArticle) return
    const formData = new FormData(e.currentTarget)
    const updates: Partial<ArticleFormData> & { active: boolean } = {
      article_type: formData.get('article_type') as ArticleType,
      article_name: formData.get('article_name') as string,
      additional_description: (formData.get('additional_description') as string) || null,
      unit: (formData.get('unit') as ArticleUnit) || 'piece',
      net_weight: formData.get('net_weight') ? Number(formData.get('net_weight')) : null,
      material: (formData.get('material') as string) || null,
      country_of_origin: (formData.get('country_of_origin') as string) || null,
      customs_tariff_number: (formData.get('customs_tariff_number') as string) || null,
      drawing_number: (formData.get('drawing_number') as string) || null,
      drawing_revision: (formData.get('drawing_revision') as string) || null,
      default_price: formData.get('default_price') ? Number(formData.get('default_price')) : null,
      manufacturing_cost: formData.get('manufacturing_cost') ? Number(formData.get('manufacturing_cost')) : null,
      default_warranty_months: formData.get('default_warranty_months') ? Number(formData.get('default_warranty_months')) : null,
      supplier_article_number: (formData.get('supplier_article_number') as string) || null,
      tracking_mode: (formData.get('tracking_mode') as TrackingMode) || null,
      requires_calibration: formData.get('requires_calibration') === 'true',
      requires_certificate: formData.get('requires_certificate') === 'true',
      requires_expiry_tracking: formData.get('requires_expiry_tracking') === 'true',
      requires_incoming_inspection: formData.get('requires_incoming_inspection') === 'true',
      active: formData.get('active') === 'true',
    }
    updateArticleMutation.mutate({ id: selectedArticle.id, updates })
  }, [selectedArticle, updateArticleMutation])

  const handleExport = useCallback(() => {
    try {
      const exportData = articles.map((a) => ({
        'Artikelnummer': a.article_number,
        'Artikeltyp': a.article_type,
        'Artikelbezeichnung': a.article_name,
        'Zusatzbezeichnung': a.additional_description || '',
        'Einheit': a.unit,
        'Nettogewicht (g)': a.net_weight ?? '',
        'Material': a.material || '',
        'Ursprungsland': a.country_of_origin || '',
        'Zolltarifnummer': a.customs_tariff_number || '',
        'Zeichnungsnummer': a.drawing_number || '',
        'Zeichnungsrevision': a.drawing_revision || '',
        'Standardpreis': a.default_price ?? '',
        'Herstellkosten': a.manufacturing_cost ?? '',
        'Garantie (Monate)': a.default_warranty_months ?? '',
        'Lieferanten-Artikelnummer': a.supplier_article_number || '',
        'Nachverfolgung': a.tracking_mode || '',
        'Aktiv': a.active ? 'Ja' : 'Nein',
      }))
      const ws = XLSX.utils.json_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Artikel')
      const date = new Date().toISOString().split('T')[0]
      XLSX.writeFile(wb, `Artikel_${date}.xlsx`)
      toast.success('Export erfolgreich')
    } catch {
      toast.error('Export fehlgeschlagen')
    }
  }, [articles])

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

        const articlesToInsert: Record<string, unknown>[] = []
        for (const row of jsonData) {
          const articleType = parseArticleTypeFromImport(String(row['Artikeltyp'] || 'article'))
          const prefix = articleTypePrefixes[articleType]
          const articleNumber = (row['Artikelnummer'] as string) || await generateArticleNumber(prefix)
          const name = (row['Artikelbezeichnung'] as string) || (row['Name'] as string) || ''
          if (!name) continue

          articlesToInsert.push({
            article_number: articleNumber,
            article_type: articleType,
            article_name: name,
            additional_description: (row['Zusatzbezeichnung'] as string) || null,
            unit: parseArticleUnitFromImport(String(row['Einheit'] || 'piece')),
            net_weight: row['Nettogewicht (g)'] ? Number(row['Nettogewicht (g)']) : null,
            material: (row['Material'] as string) || null,
            country_of_origin: (row['Ursprungsland'] as string) || null,
            customs_tariff_number: (row['Zolltarifnummer'] as string) || null,
            drawing_number: (row['Zeichnungsnummer'] as string) || null,
            drawing_revision: (row['Zeichnungsrevision'] as string) || null,
            default_price: row['Standardpreis'] ? Number(row['Standardpreis']) : null,
            active: row['Aktiv'] !== 'Nein' && row['Aktiv'] !== 'nein' && row['Aktiv'] !== false,
            version: 1,
          })
        }

        if (articlesToInsert.length === 0) { toast.error('Keine gültigen Artikel gefunden'); return }

        let insertedCount = 0, errorCount = 0
        for (let i = 0; i < articlesToInsert.length; i += 50) {
          const batch = articlesToInsert.slice(i, i + 50)
          try { await importArticlesBatch(batch); insertedCount += batch.length }
          catch { errorCount += batch.length }
        }

        queryClient.invalidateQueries({ queryKey: ['articles'] })
        if (errorCount > 0) toast.warning(`${insertedCount} importiert, ${errorCount} fehlgeschlagen`)
        else toast.success(`${insertedCount} Artikel erfolgreich importiert`)
      } catch { toast.error('Import fehlgeschlagen - ungültiges Dateiformat') }
    }
    reader.readAsArrayBuffer(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [queryClient])

  const openDetailDialog = useCallback((article: Article) => {
    setSelectedArticle(article)
    setIsDetailDialogOpen(true)
  }, [])

  const openEditDialog = useCallback((article: Article) => {
    setSelectedArticle(article)
    setIsEditDialogOpen(true)
  }, [])

  const handleToggleStatus = useCallback((article: Article) => {
    toggleStatusMutation.mutate({ id: article.id, active: !article.active })
  }, [toggleStatusMutation])

  return {
    articles, isLoading, selectedArticle,
    isAddDialogOpen, setIsAddDialogOpen,
    isEditDialogOpen, setIsEditDialogOpen,
    isDetailDialogOpen, setIsDetailDialogOpen,
    fileInputRef,
    handleCreateSubmit, handleUpdateSubmit,
    handleExport, handleImportClick, handleFileChange,
    openDetailDialog, openEditDialog,
    toggleArticleStatus: handleToggleStatus,
    isCreating: createArticleMutation.isPending,
    isUpdating: updateArticleMutation.isPending,
  }
}
