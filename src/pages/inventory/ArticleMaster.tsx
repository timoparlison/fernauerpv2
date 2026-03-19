import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileUp } from 'lucide-react'
import { useArticleManagement } from '@/hooks/inventory/useArticleManagement'
import { ArticleTable } from '@/components/inventory/articles/ArticleTable'
import { ArticleFormDialog } from '@/components/inventory/articles/ArticleFormDialog'
import { ArticleDetailsDialog } from '@/components/inventory/articles/ArticleDetailsDialog'
import { TablePagination } from '@/components/ui/table-pagination'

export default function ArticleMaster() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const {
    articles, isLoading, selectedArticle,
    isAddDialogOpen, setIsAddDialogOpen,
    isEditDialogOpen, setIsEditDialogOpen,
    isDetailDialogOpen, setIsDetailDialogOpen,
    fileInputRef,
    handleCreateSubmit, handleUpdateSubmit,
    handleExport, handleImportClick, handleFileChange,
    openDetailDialog, openEditDialog,
    toggleArticleStatus,
    isCreating, isUpdating,
  } = useArticleManagement()

  const totalPages = Math.ceil(articles.length / pageSize)
  const paginatedArticles = articles.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-bold">Artikelstamm</h1>
          <p className="text-muted-foreground text-xs md:text-base">
            Verwalten Sie Ihre Artikel, Materialien, Prüfmittel und Werkzeuge
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
          <ArticleFormDialog
            mode="create"
            open={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onSubmit={handleCreateSubmit}
            isSubmitting={isCreating}
          />
        </div>
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="text-lg md:text-xl">Artikel</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Übersicht aller Artikel ({articles.length})
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0 md:p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            <>
              <ArticleTable
                articles={paginatedArticles}
                onViewDetails={openDetailDialog}
                onEdit={openEditDialog}
                onToggleStatus={toggleArticleStatus}
              />
              {articles.length > 0 && (
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={articles.length}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1) }}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <ArticleDetailsDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        article={selectedArticle}
      />

      {/* Edit Dialog */}
      <ArticleFormDialog
        mode="edit"
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdateSubmit}
        article={selectedArticle}
        isSubmitting={isUpdating}
      />
    </div>
  )
}
