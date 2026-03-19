import { Article, getArticleTypeLabel, getArticleUnitLabel, getTrackingModeLabel } from './types'
import type { TrackingMode } from './types'

interface ArticleMasterDataTabProps {
  article: Article
}

function Field({ label, value, testId }: { label: string; value: string | number | null | undefined; testId?: string }) {
  return (
    <div className="space-y-1">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm" data-testid={testId}>{value || '-'}</dd>
    </div>
  )
}

export function ArticleMasterDataTab({ article }: ArticleMasterDataTabProps) {
  return (
    <div className="space-y-6">
      {/* Grunddaten */}
      <div>
        <h4 className="font-semibold mb-3">Grunddaten</h4>
        <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Field label="Artikelnummer" value={article.article_number} testId="detail-article-number" />
          <Field label="Artikeltyp" value={getArticleTypeLabel(article.article_type)} testId="detail-article-type" />
          <Field label="Artikelbezeichnung" value={article.article_name} testId="detail-article-name" />
          <Field label="Zusatzbezeichnung" value={article.additional_description} testId="detail-additional-description" />
          <Field label="Einheit" value={getArticleUnitLabel(article.unit)} testId="detail-unit" />
          <Field label="Nettogewicht (g)" value={article.net_weight} testId="detail-net-weight" />
          <Field label="Material" value={article.material} testId="detail-material" />
          <Field label="Ursprungsland" value={article.country_of_origin} testId="detail-country" />
          <Field label="Zolltarifnummer" value={article.customs_tariff_number} testId="detail-customs-tariff" />
        </dl>
      </div>

      {/* Zeichnung */}
      <div>
        <h4 className="font-semibold mb-3">Zeichnung</h4>
        <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Field label="Zeichnungsnummer" value={article.drawing_number} testId="detail-drawing-number" />
          <Field label="Zeichnungsrevision" value={article.drawing_revision} testId="detail-drawing-revision" />
        </dl>
      </div>

      {/* Preise & Kosten */}
      <div>
        <h4 className="font-semibold mb-3">Preise & Kosten</h4>
        <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Field
            label="Standardpreis"
            value={article.default_price != null ? `${article.default_price.toFixed(2)} \u20AC` : null}
            testId="detail-default-price"
          />
          <Field
            label="Herstellkosten"
            value={article.manufacturing_cost != null ? `${article.manufacturing_cost.toFixed(2)} \u20AC` : null}
            testId="detail-manufacturing-cost"
          />
          <Field
            label="Garantie"
            value={article.default_warranty_months != null ? `${article.default_warranty_months} Monate` : null}
            testId="detail-warranty-months"
          />
        </dl>
      </div>

      {/* Lieferant & Nachverfolgung */}
      <div>
        <h4 className="font-semibold mb-3">Lieferant & Nachverfolgung</h4>
        <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Field label="Lieferanten-Artikelnummer" value={article.supplier_article_number} testId="detail-supplier-article-number" />
          <Field
            label="Nachverfolgung"
            value={article.tracking_mode ? getTrackingModeLabel(article.tracking_mode as TrackingMode) : null}
            testId="detail-tracking-mode"
          />
        </dl>
      </div>

      {/* Qualitätsanforderungen */}
      <div>
        <h4 className="font-semibold mb-3">Qualitätsanforderungen</h4>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Kalibrierung erforderlich" value={article.requires_calibration ? 'Ja' : 'Nein'} testId="detail-requires-calibration" />
          <Field label="Zertifikat erforderlich" value={article.requires_certificate ? 'Ja' : 'Nein'} testId="detail-requires-certificate" />
          <Field label="Ablaufverfolgung erforderlich" value={article.requires_expiry_tracking ? 'Ja' : 'Nein'} testId="detail-requires-expiry" />
          <Field label="Wareneingangsprüfung" value={article.requires_incoming_inspection ? 'Ja' : 'Nein'} testId="detail-requires-inspection" />
        </dl>
      </div>
    </div>
  )
}
