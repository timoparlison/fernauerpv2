import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { Article, articleTypeLabels, articleUnitLabels, trackingModeLabels, europeanCountries } from './types'
import type { ArticleType, ArticleUnit, TrackingMode } from './types'

interface ArticleFormDialogProps {
  mode: 'create' | 'edit'
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  article?: Article | null
  isSubmitting?: boolean
}

export function ArticleFormDialog({
  mode, open, onOpenChange, onSubmit, article, isSubmitting,
}: ArticleFormDialogProps) {
  const isEdit = mode === 'edit'
  const title = isEdit ? 'Artikel bearbeiten' : 'Neuer Artikel'
  const description = isEdit ? 'Ändern Sie die Daten des Artikels' : 'Erfassen Sie die Daten des neuen Artikels'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!isEdit && (
        <DialogTrigger asChild>
          <Button className="w-full sm:w-auto" data-testid="open-article-dialog">
            <Plus className="mr-2 h-4 w-4" />
            Artikel anlegen
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] md:w-full p-3 md:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-xl" data-testid="dialog-title">{title}</DialogTitle>
          <DialogDescription className="text-xs md:text-sm">{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4" data-testid="article-form">
          {/* Grunddaten */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`${mode}-article_type`}>Artikeltyp *</Label>
              <Select name="article_type" defaultValue={article?.article_type || undefined} required>
                <SelectTrigger data-testid="select-article-type">
                  <SelectValue placeholder="Typ auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(articleTypeLabels) as [ArticleType, string][]).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isEdit && (
              <div>
                <Label htmlFor={`${mode}-active`}>Status</Label>
                <Select name="active" defaultValue={article?.active ? 'true' : 'false'}>
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

            <div className="col-span-1 sm:col-span-2">
              <Label htmlFor={`${mode}-article_name`}>Artikelbezeichnung *</Label>
              <Input
                id={`${mode}-article_name`}
                name="article_name"
                defaultValue={article?.article_name || ''}
                required
                data-testid="input-article-name"
              />
            </div>

            <div className="col-span-1 sm:col-span-2">
              <Label htmlFor={`${mode}-additional_description`}>Zusatzbezeichnung</Label>
              <Textarea
                id={`${mode}-additional_description`}
                name="additional_description"
                defaultValue={article?.additional_description || ''}
                data-testid="input-additional-description"
              />
            </div>

            <div>
              <Label htmlFor={`${mode}-unit`}>Einheit *</Label>
              <Select name="unit" defaultValue={article?.unit || 'piece'} required>
                <SelectTrigger data-testid="select-unit">
                  <SelectValue placeholder="Einheit auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(articleUnitLabels) as [ArticleUnit, string][]).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor={`${mode}-net_weight`}>Nettogewicht (g)</Label>
              <Input
                id={`${mode}-net_weight`}
                name="net_weight"
                type="number"
                step="0.01"
                min="0"
                defaultValue={article?.net_weight ?? ''}
                data-testid="input-net-weight"
              />
            </div>

            <div>
              <Label htmlFor={`${mode}-material`}>Material</Label>
              <Input
                id={`${mode}-material`}
                name="material"
                defaultValue={article?.material || ''}
                placeholder="z.B. Stahl, Aluminium, Kunststoff"
                data-testid="input-material"
              />
            </div>

            <div>
              <Label htmlFor={`${mode}-country_of_origin`}>Ursprungsland</Label>
              <Select name="country_of_origin" defaultValue={article?.country_of_origin || undefined}>
                <SelectTrigger data-testid="select-country">
                  <SelectValue placeholder="Land auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {europeanCountries.map((country) => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor={`${mode}-customs_tariff_number`}>Zolltarifnummer</Label>
              <Input
                id={`${mode}-customs_tariff_number`}
                name="customs_tariff_number"
                defaultValue={article?.customs_tariff_number || ''}
                data-testid="input-customs-tariff"
              />
            </div>

            <div>
              <Label htmlFor={`${mode}-drawing_number`}>Zeichnungsnummer</Label>
              <Input
                id={`${mode}-drawing_number`}
                name="drawing_number"
                defaultValue={article?.drawing_number || ''}
                data-testid="input-drawing-number"
              />
            </div>

            <div>
              <Label htmlFor={`${mode}-drawing_revision`}>Zeichnungsrevision</Label>
              <Input
                id={`${mode}-drawing_revision`}
                name="drawing_revision"
                defaultValue={article?.drawing_revision || ''}
                data-testid="input-drawing-revision"
              />
            </div>
          </div>

          {/* Preise & Kosten */}
          <div className="space-y-2">
            <h4 className="font-semibold mt-2">Preise & Kosten</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor={`${mode}-default_price`}>Standardpreis (&euro;)</Label>
                <Input
                  id={`${mode}-default_price`}
                  name="default_price"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={article?.default_price ?? ''}
                  data-testid="input-default-price"
                />
              </div>
              <div>
                <Label htmlFor={`${mode}-manufacturing_cost`}>Herstellkosten (&euro;)</Label>
                <Input
                  id={`${mode}-manufacturing_cost`}
                  name="manufacturing_cost"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={article?.manufacturing_cost ?? ''}
                  data-testid="input-manufacturing-cost"
                />
              </div>
              <div>
                <Label htmlFor={`${mode}-default_warranty_months`}>Garantie (Monate)</Label>
                <Input
                  id={`${mode}-default_warranty_months`}
                  name="default_warranty_months"
                  type="number"
                  min="0"
                  defaultValue={article?.default_warranty_months ?? ''}
                  data-testid="input-warranty-months"
                />
              </div>
            </div>
          </div>

          {/* Lieferant */}
          <div className="space-y-2">
            <h4 className="font-semibold mt-2">Lieferantendaten</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`${mode}-supplier_article_number`}>Lieferanten-Artikelnummer</Label>
                <Input
                  id={`${mode}-supplier_article_number`}
                  name="supplier_article_number"
                  defaultValue={article?.supplier_article_number || ''}
                  data-testid="input-supplier-article-number"
                />
              </div>
              <div>
                <Label htmlFor={`${mode}-tracking_mode`}>Nachverfolgung</Label>
                <Select name="tracking_mode" defaultValue={article?.tracking_mode || undefined}>
                  <SelectTrigger data-testid="select-tracking-mode">
                    <SelectValue placeholder="Keine" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(trackingModeLabels) as [TrackingMode, string][]).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Qualitätsanforderungen */}
          <div className="space-y-2">
            <h4 className="font-semibold mt-2">Qualitätsanforderungen</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Kalibrierung erforderlich</Label>
                <Select name="requires_calibration" defaultValue={article?.requires_calibration ? 'true' : 'false'}>
                  <SelectTrigger data-testid="select-requires-calibration">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Nein</SelectItem>
                    <SelectItem value="true">Ja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Zertifikat erforderlich</Label>
                <Select name="requires_certificate" defaultValue={article?.requires_certificate ? 'true' : 'false'}>
                  <SelectTrigger data-testid="select-requires-certificate">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Nein</SelectItem>
                    <SelectItem value="true">Ja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Ablaufverfolgung erforderlich</Label>
                <Select name="requires_expiry_tracking" defaultValue={article?.requires_expiry_tracking ? 'true' : 'false'}>
                  <SelectTrigger data-testid="select-requires-expiry">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Nein</SelectItem>
                    <SelectItem value="true">Ja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Wareneingangsprüfung</Label>
                <Select name="requires_incoming_inspection" defaultValue={article?.requires_incoming_inspection ? 'true' : 'false'}>
                  <SelectTrigger data-testid="select-requires-inspection">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Nein</SelectItem>
                    <SelectItem value="true">Ja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={isSubmitting} data-testid="submit-article">
              {isSubmitting ? 'Speichert...' : 'Speichern'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
