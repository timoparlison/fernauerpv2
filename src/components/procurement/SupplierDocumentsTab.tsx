import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchSupplierDocuments,
  uploadSupplierDocument,
  deleteSupplierDocument,
  getSupplierDocumentUrl,
} from '@/services/procurementService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Upload, Trash2, Download, FileText, Mail, File } from 'lucide-react'
import { format } from 'date-fns'

interface SupplierDocumentsTabProps {
  supplierId: string
}

const DOCUMENT_TYPES = [
  { value: 'vertrag', label: 'Vertrag' },
  { value: 'rechnung', label: 'Rechnung' },
  { value: 'lieferschein', label: 'Lieferschein' },
  { value: 'zertifikat', label: 'Zertifikat' },
  { value: 'angebot', label: 'Angebot' },
  { value: 'korrespondenz', label: 'Korrespondenz' },
  { value: 'email', label: 'E-Mail' },
  { value: 'sonstiges', label: 'Sonstiges' },
]

function getDocumentTypeLabel(type: string): string {
  return DOCUMENT_TYPES.find((t) => t.value === type)?.label ?? type
}

function getDocumentIcon(type: string) {
  if (type === 'email') return <Mail className="h-4 w-4" />
  if (['vertrag', 'rechnung', 'lieferschein', 'angebot'].includes(type)) return <FileText className="h-4 w-4" />
  return <File className="h-4 w-4" />
}

export function SupplierDocumentsTab({ supplierId }: SupplierDocumentsTabProps) {
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [documentType, setDocumentType] = useState('sonstiges')
  const [uploadNotes, setUploadNotes] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const { data: documents = [] } = useQuery({
    queryKey: ['supplier-documents', supplierId],
    queryFn: () => fetchSupplierDocuments(supplierId),
  })

  const uploadMutation = useMutation({
    mutationFn: ({ file, docType, notes }: { file: File; docType: string; notes: string }) =>
      uploadSupplierDocument(supplierId, file, docType, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-documents', supplierId] })
      toast.success('Dokument erfolgreich hochgeladen')
      setIsUploadOpen(false)
      setDocumentType('sonstiges')
      setUploadNotes('')
      if (fileInputRef.current) fileInputRef.current.value = ''
    },
    onError: (error: Error) => toast.error(`Fehler beim Upload: ${error.message}`),
  })

  const deleteMutation = useMutation({
    mutationFn: ({ id, filePath }: { id: string; filePath: string }) =>
      deleteSupplierDocument(id, filePath),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-documents', supplierId] })
      toast.success('Dokument erfolgreich gelöscht')
    },
    onError: (error: Error) => toast.error(`Fehler: ${error.message}`),
  })

  const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const file = fileInputRef.current?.files?.[0]
    if (!file) {
      toast.error('Bitte wählen Sie eine Datei aus')
      return
    }
    uploadMutation.mutate({ file, docType: documentType, notes: uploadNotes })
  }

  const handleDownload = (filePath: string, fileName: string) => {
    const url = getSupplierDocumentUrl(filePath)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.target = '_blank'
    a.click()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Dokumente & E-Mails</CardTitle>
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button size="sm" data-testid="upload-supplier-document-btn">
              <Upload className="mr-2 h-4 w-4" />
              Hochladen
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dokument hochladen</DialogTitle>
              <DialogDescription>
                Laden Sie ein Dokument oder eine E-Mail hoch (PDF, Bilder, Word, .eml, .msg)
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4" data-testid="document-upload-form">
              <div className="space-y-2">
                <Label htmlFor="document-file">Datei *</Label>
                <Input
                  id="document-file"
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.gif,.doc,.docx,.xls,.xlsx,.eml,.msg,.txt"
                  required
                  data-testid="input-document-file"
                />
              </div>
              <div className="space-y-2">
                <Label>Dokumenttyp</Label>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger data-testid="select-document-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="document-notes">Notizen</Label>
                <Textarea
                  id="document-notes"
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  placeholder="Optionale Anmerkungen zum Dokument"
                  data-testid="input-document-notes"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsUploadOpen(false)}>Abbrechen</Button>
                <Button type="submit" disabled={uploadMutation.isPending} data-testid="submit-document-upload">
                  {uploadMutation.isPending ? 'Lädt hoch...' : 'Hochladen'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">Keine Dokumente vorhanden.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dateiname</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead>Notizen</TableHead>
                <TableHead>Hochgeladen am</TableHead>
                <TableHead>Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getDocumentIcon(doc.document_type)}
                      <span className="font-medium">{doc.document_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getDocumentTypeLabel(doc.document_type)}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{doc.notes || '-'}</TableCell>
                  <TableCell>{format(new Date(doc.created_at), 'dd.MM.yyyy HH:mm')}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(doc.file_path, doc.document_name)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm('Dokument wirklich löschen?')) {
                            deleteMutation.mutate({ id: doc.id, filePath: doc.file_path })
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
