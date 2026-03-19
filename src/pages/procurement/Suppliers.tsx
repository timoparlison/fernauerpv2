import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileUp } from 'lucide-react'
import { useSupplierManagement } from '@/hooks/procurement/useSupplierManagement'
import { SupplierTable } from '@/components/procurement/suppliers/SupplierTable'
import { SupplierFormDialog } from '@/components/procurement/suppliers/SupplierFormDialog'
import { SupplierDetailsDialog } from '@/components/procurement/suppliers/SupplierDetailsDialog'

export default function Suppliers() {
  const {
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
    toggleSupplierStatus,
    isCreating, isUpdating,
  } = useSupplierManagement()

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-bold">Lieferantenstamm</h1>
          <p className="text-muted-foreground text-xs md:text-base">
            Verwalten Sie Ihre Lieferanten und deren Daten
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
            data-testid="file-input"
          />
          <Button
            onClick={handleExport}
            variant="outline"
            className="gap-2 flex-1 sm:flex-initial"
            data-testid="btn-export"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Excel </span>Export
          </Button>
          <Button
            onClick={handleImportClick}
            variant="outline"
            className="gap-2 flex-1 sm:flex-initial"
            data-testid="btn-import"
          >
            <FileUp className="h-4 w-4" />
            <span className="hidden sm:inline">Excel </span>Import
          </Button>
          <SupplierFormDialog
            mode="create"
            open={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onSubmit={handleCreateSubmit}
            paymentTerms={addPaymentTerms}
            onPaymentTermsChange={setAddPaymentTerms}
            deliveryTerms={addDeliveryTerms}
            onDeliveryTermsChange={setAddDeliveryTerms}
            isSubmitting={isCreating}
          />
        </div>
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="text-lg md:text-xl">Lieferanten</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Übersicht aller Lieferanten ({suppliers.length})
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0 md:p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            <SupplierTable
              suppliers={suppliers}
              onViewDetails={openDetailDialog}
              onEdit={openEditDialog}
              onToggleStatus={toggleSupplierStatus}
            />
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <SupplierDetailsDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        supplier={selectedSupplier}
      />

      {/* Edit Dialog */}
      <SupplierFormDialog
        mode="edit"
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdateSubmit}
        supplier={selectedSupplier}
        paymentTerms={editPaymentTerms}
        onPaymentTermsChange={setEditPaymentTerms}
        deliveryTerms={editDeliveryTerms}
        onDeliveryTermsChange={setEditDeliveryTerms}
        isSubmitting={isUpdating}
      />
    </div>
  )
}
