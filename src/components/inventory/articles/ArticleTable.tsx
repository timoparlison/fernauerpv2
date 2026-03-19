import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Edit, Ban, CheckCircle } from 'lucide-react'
import { Article, getArticleTypeLabel, getArticleUnitLabel } from './types'

interface ArticleTableProps {
  articles: Article[]
  onViewDetails: (article: Article) => void
  onEdit: (article: Article) => void
  onToggleStatus: (article: Article) => void
}

export function ArticleTable({ articles, onViewDetails, onEdit, onToggleStatus }: ArticleTableProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Keine Artikel vorhanden. Legen Sie den ersten Artikel an.
      </div>
    )
  }

  return (
    <Table className="min-w-[900px]">
      <TableHeader>
        <TableRow>
          <TableHead>Artikelnummer</TableHead>
          <TableHead>Bezeichnung</TableHead>
          <TableHead>Typ</TableHead>
          <TableHead>Einheit</TableHead>
          <TableHead>Zeichnungsnummer</TableHead>
          <TableHead>Preis</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Aktionen</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {articles.map((article) => (
          <TableRow key={article.id} data-testid={`article-row-${article.id}`}>
            <TableCell className="font-mono text-sm" data-testid="article-number">
              {article.article_number}
            </TableCell>
            <TableCell className="font-medium" data-testid="article-name">
              {article.article_name}
            </TableCell>
            <TableCell data-testid="article-type">
              <Badge variant="outline">{getArticleTypeLabel(article.article_type)}</Badge>
            </TableCell>
            <TableCell>{getArticleUnitLabel(article.unit)}</TableCell>
            <TableCell>{article.drawing_number || '-'}</TableCell>
            <TableCell>
              {article.default_price != null
                ? `${article.default_price.toFixed(2)} \u20AC`
                : '-'}
            </TableCell>
            <TableCell data-testid="article-status">
              <Badge variant={article.active ? 'default' : 'secondary'}>
                {article.active ? 'Aktiv' : 'Inaktiv'}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onViewDetails(article)}
                  title="Details anzeigen"
                  aria-label="Anzeigen"
                  data-testid="btn-view"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(article)}
                  title="Bearbeiten"
                  aria-label="Bearbeiten"
                  data-testid="btn-edit"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleStatus(article)}
                  title={article.active ? 'Artikel deaktivieren' : 'Artikel aktivieren'}
                  aria-label={article.active ? 'Artikel deaktivieren' : 'Artikel aktivieren'}
                  data-testid="btn-toggle-status"
                >
                  {article.active
                    ? <Ban className="h-4 w-4 text-destructive" />
                    : <CheckCircle className="h-4 w-4 text-green-600" />}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
