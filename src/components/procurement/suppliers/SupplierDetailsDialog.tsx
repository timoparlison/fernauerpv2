import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SupplierMasterDataTab } from '@/components/procurement/SupplierMasterDataTab'
import { SupplierContactsTab } from '@/components/procurement/SupplierContactsTab'
import { SupplierDocumentsTab } from '@/components/procurement/SupplierDocumentsTab'
import { Supplier } from './types'

interface SupplierDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier: Supplier | null
}

export function SupplierDetailsDialog({ open, onOpenChange, supplier }: SupplierDetailsDialogProps) {
  if (!supplier) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="supplier-details-dialog">
        <DialogHeader>
          <DialogTitle data-testid="details-dialog-title">{supplier.name}</DialogTitle>
          <DialogDescription>Detailansicht des Lieferanten</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="master">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="master">Stammdaten</TabsTrigger>
            <TabsTrigger value="contacts">Ansprechpartner</TabsTrigger>
            <TabsTrigger value="documents">Dokumente</TabsTrigger>
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
          </TabsList>

          <TabsContent value="master" className="mt-4">
            <SupplierMasterDataTab supplier={supplier} />
          </TabsContent>

          <TabsContent value="contacts" className="mt-4">
            <SupplierContactsTab supplierId={supplier.id} />
          </TabsContent>

          <TabsContent value="documents" className="mt-4">
            <SupplierDocumentsTab supplierId={supplier.id} />
          </TabsContent>

          <TabsContent value="overview" className="mt-4">
            <div className="text-center py-12 text-muted-foreground">
              <p>Anfragen, Bestellungen und Rechnungen werden in einem späteren Schritt implementiert.</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
