import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArticleMasterDataTab } from './ArticleMasterDataTab'
import { Article } from './types'

interface ArticleDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  article: Article | null
}

export function ArticleDetailsDialog({ open, onOpenChange, article }: ArticleDetailsDialogProps) {
  if (!article) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="article-details-dialog">
        <DialogHeader>
          <DialogTitle data-testid="details-dialog-title">
            {article.article_number} – {article.article_name}
          </DialogTitle>
          <DialogDescription>Detailansicht des Artikels</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="master">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="master">Stammdaten</TabsTrigger>
            <TabsTrigger value="pricing">Preise</TabsTrigger>
            <TabsTrigger value="inventory">Bestand</TabsTrigger>
          </TabsList>

          <TabsContent value="master" className="mt-4">
            <ArticleMasterDataTab article={article} />
          </TabsContent>

          <TabsContent value="pricing" className="mt-4">
            <div className="text-center py-12 text-muted-foreground">
              <p>Preisgestaltung und Preisstaffeln werden in einem späteren Schritt implementiert.</p>
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="mt-4">
            <div className="text-center py-12 text-muted-foreground">
              <p>Bestandsführung und Lagerbewegungen werden in einem späteren Schritt implementiert.</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
