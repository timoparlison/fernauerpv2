import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus } from 'lucide-react'
import { format } from 'date-fns'
import { absenceTypeLabels } from './types'
import type { EmployeeAbsence } from './types'

interface AbsenceFormState {
  absence_type: string
  start_date: string
  end_date: string
  days_count: number
  notes: string
}

interface EmployeeAbsencesTabProps {
  absences: EmployeeAbsence[]
  onCreateAbsence: (data: AbsenceFormState) => Promise<void>
}

export function EmployeeAbsencesTab({ absences, onCreateAbsence }: EmployeeAbsencesTabProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState<AbsenceFormState>({
    absence_type: 'urlaub',
    start_date: '',
    end_date: '',
    days_count: 1,
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreate = async () => {
    setIsSubmitting(true)
    try {
      await onCreateAbsence(form)
      setIsOpen(false)
      setForm({ absence_type: 'urlaub', start_date: '', end_date: '', days_count: 1, notes: '' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" data-testid="add-absence-btn">
              <Plus className="h-4 w-4 mr-2" />
              Abwesenheit hinzufügen
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neue Abwesenheit</DialogTitle>
            </DialogHeader>
            <div className="space-y-4" data-testid="absence-form">
              <div>
                <Label>Typ</Label>
                <Select
                  value={form.absence_type}
                  onValueChange={(value) => setForm({ ...form, absence_type: value })}
                >
                  <SelectTrigger data-testid="select-absence-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(absenceTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Von</Label>
                  <Input
                    type="date"
                    value={form.start_date}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, start_date: e.target.value })}
                    data-testid="input-absence-start"
                  />
                </div>
                <div>
                  <Label>Bis</Label>
                  <Input
                    type="date"
                    value={form.end_date}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, end_date: e.target.value })}
                    data-testid="input-absence-end"
                  />
                </div>
              </div>
              <div>
                <Label>Anzahl Tage</Label>
                <Input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={form.days_count}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, days_count: parseFloat(e.target.value) })}
                  data-testid="input-absence-days"
                />
              </div>
              <div>
                <Label>Notizen</Label>
                <Textarea
                  value={form.notes}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, notes: e.target.value })}
                  data-testid="input-absence-notes"
                />
              </div>
              <Button onClick={handleCreate} className="w-full" disabled={isSubmitting} data-testid="submit-absence">
                {isSubmitting ? 'Speichert...' : 'Abwesenheit eintragen'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Typ</TableHead>
            <TableHead>Von</TableHead>
            <TableHead>Bis</TableHead>
            <TableHead>Tage</TableHead>
            <TableHead>Notizen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {absences.map((absence) => (
            <TableRow key={absence.id} data-testid="absence-row">
              <TableCell>{absenceTypeLabels[absence.absence_type] ?? absence.absence_type}</TableCell>
              <TableCell>{format(new Date(absence.start_date), 'dd.MM.yyyy')}</TableCell>
              <TableCell>{format(new Date(absence.end_date), 'dd.MM.yyyy')}</TableCell>
              <TableCell>{absence.days_count ?? '-'}</TableCell>
              <TableCell>{absence.notes || '-'}</TableCell>
            </TableRow>
          ))}
          {absences.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">Keine Abwesenheiten erfasst</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
