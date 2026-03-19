import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Edit, Ban, CheckCircle } from 'lucide-react'
import { Supplier, getSupplierTypeLabel } from './types'

interface SupplierTableProps {
  suppliers: Supplier[]
  onViewDetails: (supplier: Supplier) => void
  onEdit: (supplier: Supplier) => void
  onToggleStatus: (supplier: Supplier) => void
}

export function SupplierTable({ suppliers, onViewDetails, onEdit, onToggleStatus }: SupplierTableProps) {
  if (suppliers.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Keine Lieferanten vorhanden. Legen Sie den ersten Lieferanten an.
      </div>
    )
  }

  return (
    <Table className="min-w-[700px]">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Typ</TableHead>
          <TableHead>Ansprechpartner</TableHead>
          <TableHead>E-Mail</TableHead>
          <TableHead>Telefon</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Aktionen</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {suppliers.map((supplier) => (
          <TableRow key={supplier.id} data-testid={`supplier-row-${supplier.id}`}>
            <TableCell className="font-medium" data-testid="supplier-name">{supplier.name}</TableCell>
            <TableCell data-testid="supplier-type">
              <Badge variant="outline">{getSupplierTypeLabel(supplier.supplier_type)}</Badge>
            </TableCell>
            <TableCell>{supplier.contact_person || '-'}</TableCell>
            <TableCell>{supplier.email || '-'}</TableCell>
            <TableCell>{supplier.phone || '-'}</TableCell>
            <TableCell data-testid="supplier-status">
              <Badge variant={supplier.active ? 'default' : 'secondary'}>
                {supplier.active ? 'Aktiv' : 'Inaktiv'}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onViewDetails(supplier)}
                  title="Details anzeigen"
                  aria-label="Anzeigen"
                  data-testid="btn-view"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(supplier)}
                  title="Bearbeiten"
                  aria-label="Bearbeiten"
                  data-testid="btn-edit"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleStatus(supplier)}
                  title={supplier.active ? 'Lieferant sperren' : 'Lieferant entsperren'}
                  aria-label={supplier.active ? 'Lieferant sperren' : 'Lieferant entsperren'}
                  data-testid="btn-toggle-status"
                >
                  {supplier.active
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
