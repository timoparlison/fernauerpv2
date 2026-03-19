import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchEmployees, createEmployee, updateEmployee, fetchEmployeeAbsences, createEmployeeAbsence } from '@/services/employeeService'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Plus, User, Edit, UserX, UserCheck } from 'lucide-react'
import { format } from 'date-fns'
import { EmployeeAbsencesTab } from '@/components/hr/EmployeeAbsencesTab'
import { employmentTypeLabels, DEFAULT_WEEKLY_HOURS, DAY_LABELS } from '@/components/hr/types'
import type { Employee, EmployeeAbsence, EmploymentType } from '@/components/hr/types'

interface EmployeeFormState {
  first_name: string
  last_name: string
  employee_number: string
  position: string
  employment_type: string
  birth_date: string
  entry_date: string
  vacation_days_per_year: number
  contact_phone: string
  mobile_phone: string
  contact_email: string
  emergency_contact_name: string
  emergency_contact_phone: string
  address: string
  iban: string
  bic: string
  account_holder: string
  monthly_gross_salary: number
  hourly_rate: number
  status: string
  time_tracking_enabled: boolean
  flextime_enabled: boolean
  bde_terminal_enabled: boolean
  weekly_hours: Record<string, number>
}

const EMPTY_FORM: EmployeeFormState = {
  first_name: '',
  last_name: '',
  employee_number: '',
  position: '',
  employment_type: 'fulltime',
  birth_date: '',
  entry_date: '',
  vacation_days_per_year: 30,
  contact_phone: '',
  mobile_phone: '',
  contact_email: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  address: '',
  iban: '',
  bic: '',
  account_holder: '',
  monthly_gross_salary: 0,
  hourly_rate: 0,
  status: 'active',
  time_tracking_enabled: true,
  flextime_enabled: true,
  bde_terminal_enabled: true,
  weekly_hours: { ...DEFAULT_WEEKLY_HOURS },
}

function employeeToForm(e: Employee): EmployeeFormState {
  return {
    first_name: e.first_name,
    last_name: e.last_name,
    employee_number: e.employee_number,
    position: e.position || '',
    employment_type: e.employment_type || 'fulltime',
    birth_date: e.birth_date || '',
    entry_date: e.entry_date || '',
    vacation_days_per_year: e.vacation_days_per_year ?? 30,
    contact_phone: e.contact_phone || '',
    mobile_phone: e.mobile_phone || '',
    contact_email: e.contact_email || '',
    emergency_contact_name: e.emergency_contact_name || '',
    emergency_contact_phone: e.emergency_contact_phone || '',
    address: e.address || '',
    iban: e.iban || '',
    bic: e.bic || '',
    account_holder: e.account_holder || '',
    monthly_gross_salary: e.monthly_gross_salary ?? 0,
    hourly_rate: e.hourly_rate ?? 0,
    status: e.status,
    time_tracking_enabled: e.time_tracking_enabled ?? true,
    flextime_enabled: e.flextime_enabled ?? true,
    bde_terminal_enabled: e.bde_terminal_enabled ?? true,
    weekly_hours: e.weekly_hours || { ...DEFAULT_WEEKLY_HOURS },
  }
}

interface EmployeeFormFieldsProps {
  form: EmployeeFormState
  setForm: (f: EmployeeFormState) => void
  showStatus?: boolean
}

function EmployeeFormFields({ form, setForm, showStatus = false }: EmployeeFormFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Vorname <span className="text-destructive">*</span></Label>
          <Input value={form.first_name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, first_name: e.target.value })} required minLength={2} data-testid="input-first-name" />
        </div>
        <div>
          <Label>Nachname <span className="text-destructive">*</span></Label>
          <Input value={form.last_name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, last_name: e.target.value })} required minLength={2} data-testid="input-last-name" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Personalnummer <span className="text-destructive">*</span></Label>
          <Input value={form.employee_number} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, employee_number: e.target.value })} required data-testid="input-employee-number" />
        </div>
        <div>
          <Label>Position</Label>
          <Input value={form.position} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, position: e.target.value })} data-testid="input-position" />
        </div>
        <div>
          <Label>Beschäftigungsart</Label>
          <Select value={form.employment_type} onValueChange={(v) => setForm({ ...form, employment_type: v })}>
            <SelectTrigger data-testid="select-employment-type">
              <SelectValue placeholder="Beschäftigungsart wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fulltime">Vollzeit</SelectItem>
              <SelectItem value="parttime">Teilzeit</SelectItem>
              <SelectItem value="minijob">Minijob</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Geburtsdatum <span className="text-destructive">*</span></Label>
          <Input type="date" value={form.birth_date} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, birth_date: e.target.value })} required data-testid="input-birth-date" />
        </div>
        <div>
          <Label>Eintrittsdatum <span className="text-destructive">*</span></Label>
          <Input type="date" value={form.entry_date} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, entry_date: e.target.value })} required data-testid="input-entry-date" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Urlaubstage/Jahr</Label>
          <Input type="number" value={form.vacation_days_per_year} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, vacation_days_per_year: parseInt(e.target.value) || 0 })} data-testid="input-vacation-days" />
        </div>
        <div>
          <Label>Bruttogehalt/Monat (€)</Label>
          <Input type="number" min="0" step="0.01" value={form.monthly_gross_salary} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, monthly_gross_salary: parseFloat(e.target.value) || 0 })} data-testid="input-salary" />
        </div>
        <div>
          <Label>Stundensatz (€)</Label>
          <Input type="number" min="0" step="0.01" value={form.hourly_rate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, hourly_rate: parseFloat(e.target.value) || 0 })} data-testid="input-hourly-rate" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Telefon</Label>
          <Input value={form.contact_phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, contact_phone: e.target.value })} data-testid="input-phone" />
        </div>
        <div>
          <Label>Mobiltelefon</Label>
          <Input value={form.mobile_phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, mobile_phone: e.target.value })} data-testid="input-mobile" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>E-Mail <span className="text-destructive">*</span></Label>
          <Input type="email" value={form.contact_email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, contact_email: e.target.value })} required data-testid="input-email" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Notfallkontakt Name</Label>
          <Input value={form.emergency_contact_name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, emergency_contact_name: e.target.value })} data-testid="input-emergency-name" />
        </div>
        <div>
          <Label>Notfallkontakt Telefon</Label>
          <Input value={form.emergency_contact_phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, emergency_contact_phone: e.target.value })} data-testid="input-emergency-phone" />
        </div>
      </div>
      <div>
        <Label>Adresse</Label>
        <Input value={form.address} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, address: e.target.value })} placeholder="Straße, Hausnummer, PLZ, Ort" data-testid="input-address" />
      </div>
      <div className="border-t pt-4 space-y-4">
        <h3 className="font-semibold">Bankverbindung</h3>
        <div>
          <Label>Kontoinhaber</Label>
          <Input value={form.account_holder} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, account_holder: e.target.value })} data-testid="input-account-holder" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>IBAN</Label>
            <Input value={form.iban} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, iban: e.target.value })} placeholder="DE89 3704 0044 0532 0130 00" data-testid="input-iban" />
          </div>
          <div>
            <Label>BIC</Label>
            <Input value={form.bic} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, bic: e.target.value })} placeholder="COBADEFFXXX" data-testid="input-bic" />
          </div>
        </div>
      </div>
      <div>
        <Label>Wöchentliche Arbeitszeit (Stunden pro Tag)</Label>
        <div className="grid grid-cols-7 gap-2 mt-2">
          {Object.keys(DEFAULT_WEEKLY_HOURS).map((day) => (
            <div key={day}>
              <Label className="text-xs">{DAY_LABELS[day]}</Label>
              <Input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={form.weekly_hours[day] ?? 0}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({
                  ...form,
                  weekly_hours: { ...form.weekly_hours, [day]: parseFloat(e.target.value) || 0 },
                })}
                data-testid={`input-hours-${day}`}
              />
            </div>
          ))}
        </div>
      </div>
      {showStatus && (
        <div>
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
            <SelectTrigger data-testid="select-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Aktiv</SelectItem>
              <SelectItem value="inactive">Inaktiv</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="border-t pt-4 space-y-4">
        <h3 className="font-semibold">Zeiterfassungs-Einstellungen</h3>
        <div className="flex items-center justify-between">
          <div>
            <Label>Zeiterfassung aktiviert</Label>
            <p className="text-sm text-muted-foreground">Mitarbeiter kann ein- und ausstempeln</p>
          </div>
          <Switch checked={form.time_tracking_enabled} onCheckedChange={(v) => setForm({ ...form, time_tracking_enabled: v })} data-testid="switch-time-tracking" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>Gleitzeitkonto aktiviert</Label>
            <p className="text-sm text-muted-foreground">Überstunden werden im Gleitzeitkonto erfasst</p>
          </div>
          <Switch checked={form.flextime_enabled} onCheckedChange={(v) => setForm({ ...form, flextime_enabled: v })} data-testid="switch-flextime" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>BDE-Terminal aktiviert</Label>
            <p className="text-sm text-muted-foreground">Mitarbeiter kann sich am BDE-Terminal anmelden</p>
          </div>
          <Switch checked={form.bde_terminal_enabled} onCheckedChange={(v) => setForm({ ...form, bde_terminal_enabled: v })} data-testid="switch-bde" />
        </div>
      </div>
    </div>
  )
}

export default function Employees() {
  const queryClient = useQueryClient()
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [absences, setAbsences] = useState<EmployeeAbsence[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [form, setForm] = useState<EmployeeFormState>({ ...EMPTY_FORM })

  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
  })

  const createMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => createEmployee(data),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      toast.success('Mitarbeiter erfolgreich angelegt')
      setIsCreateOpen(false)
      setForm({ ...EMPTY_FORM })
      setSelectedEmployee(created)
      loadAbsences(created.id)
    },
    onError: (error: Error) => {
      if (error.message.includes('employees_employee_number_key')) {
        toast.error(`Personalnummer "${form.employee_number}" ist bereits vergeben`)
      } else {
        toast.error(`Fehler: ${error.message}`)
      }
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => updateEmployee(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      toast.success('Mitarbeiter erfolgreich aktualisiert')
      setIsEditOpen(false)
      setSelectedEmployee(updated)
    },
    onError: (error: Error) => {
      toast.error(`Fehler: ${error.message}`)
    },
  })

  const loadAbsences = async (employeeId: string) => {
    try {
      const data = await fetchEmployeeAbsences(employeeId)
      setAbsences(data)
    } catch {
      toast.error('Abwesenheiten konnten nicht geladen werden')
    }
  }

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee)
    loadAbsences(employee.id)
  }

  const handleCreate = () => {
    if (!form.first_name || form.first_name.length < 2) { toast.error('Vorname ist erforderlich (mind. 2 Zeichen)'); return }
    if (!form.last_name || form.last_name.length < 2) { toast.error('Nachname ist erforderlich (mind. 2 Zeichen)'); return }
    if (!form.employee_number.trim()) { toast.error('Personalnummer ist erforderlich'); return }
    if (!form.birth_date) { toast.error('Geburtsdatum ist erforderlich'); return }
    if (!form.entry_date) { toast.error('Eintrittsdatum ist erforderlich'); return }
    if (!form.contact_email.trim()) { toast.error('E-Mail ist erforderlich'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact_email)) { toast.error('Ungültige E-Mail-Adresse'); return }

    createMutation.mutate(form as unknown as Record<string, unknown>)
  }

  const handleUpdate = () => {
    if (!selectedEmployee) return
    updateMutation.mutate({ id: selectedEmployee.id, data: form as unknown as Record<string, unknown> })
  }

  const handleToggleStatus = (employee: Employee) => {
    const newStatus = employee.status === 'active' ? 'inactive' : 'active'
    updateMutation.mutate(
      { id: employee.id, data: { status: newStatus } },
      {
        onSuccess: (updated) => {
          if (selectedEmployee?.id === updated.id) setSelectedEmployee(updated)
          toast.success(newStatus === 'active' ? 'Mitarbeiter aktiviert' : 'Mitarbeiter deaktiviert')
        },
      }
    )
  }

  const openEdit = (employee: Employee) => {
    setForm(employeeToForm(employee))
    setIsEditOpen(true)
  }

  const handleCreateAbsence = async (data: { absence_type: string; start_date: string; end_date: string; days_count: number; notes: string }) => {
    if (!selectedEmployee) return
    const absence = await createEmployeeAbsence({ ...data, employee_id: selectedEmployee.id })
    setAbsences((prev) => [absence, ...prev])
    toast.success('Abwesenheit erfolgreich eingetragen')
  }

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold" data-testid="page-title">Mitarbeiter</h1>
          <p className="text-xs md:text-sm text-muted-foreground">Verwaltung von Mitarbeitern und Abwesenheiten</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={(open) => { if (open) setForm({ ...EMPTY_FORM }); setIsCreateOpen(open) }}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto" data-testid="open-employee-dialog">
              <Plus className="h-4 w-4 mr-2" />
              Neuer Mitarbeiter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl w-[95vw] md:w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg md:text-xl" data-testid="dialog-title">Neuer Mitarbeiter</DialogTitle>
            </DialogHeader>
            <EmployeeFormFields form={form} setForm={setForm} />
            <Button onClick={handleCreate} className="w-full" disabled={createMutation.isPending} data-testid="submit-employee">
              {createMutation.isPending ? 'Speichert...' : 'Mitarbeiter anlegen'}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Employee list */}
        <Card className="p-3 md:p-4 lg:col-span-1">
          <h2 className="text-base md:text-lg font-semibold mb-4">Mitarbeiterliste</h2>
          <div className="space-y-2">
            {employees.map((employee) => (
              <div
                key={employee.id}
                onClick={() => handleEmployeeClick(employee)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedEmployee?.id === employee.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
                data-testid="employee-list-item"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 shrink-0" />
                    <div>
                      <p className="font-medium">{employee.first_name} {employee.last_name}</p>
                      <p className="text-sm opacity-80">{employee.employee_number}</p>
                    </div>
                  </div>
                  <Badge variant={employee.status === 'active' ? 'default' : 'secondary'} data-testid="employee-status-badge">
                    {employee.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                  </Badge>
                </div>
              </div>
            ))}
            {employees.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Keine Mitarbeiter vorhanden</p>
            )}
          </div>
        </Card>

        {/* Detail panel */}
        <Card className="p-3 md:p-6 lg:col-span-2">
          {selectedEmployee ? (
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details" className="text-xs md:text-sm">Details</TabsTrigger>
                <TabsTrigger value="absences" className="text-xs md:text-sm">Abwesenheiten</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="flex flex-col sm:flex-row justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(selectedEmployee)} data-testid="edit-employee-btn">
                    <Edit className="h-4 w-4 mr-2" />
                    Bearbeiten
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedEmployee.status === 'active' ? 'destructive' : 'default'}
                    onClick={() => handleToggleStatus(selectedEmployee)}
                    data-testid="toggle-status-btn"
                  >
                    {selectedEmployee.status === 'active' ? (
                      <><UserX className="h-4 w-4 mr-2" />Deaktivieren</>
                    ) : (
                      <><UserCheck className="h-4 w-4 mr-2" />Aktivieren</>
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Name</Label>
                    <p className="font-medium" data-testid="detail-name">{selectedEmployee.first_name} {selectedEmployee.last_name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Personalnummer</Label>
                    <p className="font-medium" data-testid="detail-employee-number">{selectedEmployee.employee_number}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <Badge variant={selectedEmployee.status === 'active' ? 'default' : 'secondary'}>
                      {selectedEmployee.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Position</Label>
                    <p className="font-medium">{selectedEmployee.position || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Beschäftigungsart</Label>
                    <p className="font-medium">{selectedEmployee.employment_type ? employmentTypeLabels[selectedEmployee.employment_type as EmploymentType] : '-'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Geburtsdatum</Label>
                    <p className="font-medium">{selectedEmployee.birth_date ? format(new Date(selectedEmployee.birth_date), 'dd.MM.yyyy') : '-'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Eintrittsdatum</Label>
                    <p className="font-medium">{selectedEmployee.entry_date ? format(new Date(selectedEmployee.entry_date), 'dd.MM.yyyy') : '-'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Urlaubstage/Jahr</Label>
                    <p className="font-medium">{selectedEmployee.vacation_days_per_year ?? '-'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Bruttogehalt/Monat</Label>
                    <p className="font-medium">{(selectedEmployee.monthly_gross_salary ?? 0).toFixed(2)} €</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Stundensatz</Label>
                    <p className="font-medium">{(selectedEmployee.hourly_rate ?? 0).toFixed(2)} €/Std</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">E-Mail</Label>
                    <p className="font-medium">{selectedEmployee.contact_email || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Telefon</Label>
                    <p className="font-medium">{selectedEmployee.contact_phone || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Mobiltelefon</Label>
                    <p className="font-medium">{selectedEmployee.mobile_phone || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Adresse</Label>
                    <p className="font-medium">{selectedEmployee.address || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Notfallkontakt</Label>
                    <p className="font-medium">{selectedEmployee.emergency_contact_name || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Notfallkontakt Tel.</Label>
                    <p className="font-medium">{selectedEmployee.emergency_contact_phone || '-'}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Bankverbindung</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Kontoinhaber</Label>
                      <p className="font-medium">{selectedEmployee.account_holder || '-'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">IBAN</Label>
                      <p className="font-medium">{selectedEmployee.iban || '-'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">BIC</Label>
                      <p className="font-medium">{selectedEmployee.bic || '-'}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="absences" className="mt-4">
                <EmployeeAbsencesTab absences={absences} onCreateAbsence={handleCreateAbsence} />
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Wählen Sie einen Mitarbeiter aus der Liste aus
            </div>
          )}
        </Card>
      </div>

      {/* Edit dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl w-[95vw] md:w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">Mitarbeiter bearbeiten</DialogTitle>
          </DialogHeader>
          <EmployeeFormFields form={form} setForm={setForm} showStatus />
          <Button onClick={handleUpdate} className="w-full" disabled={updateMutation.isPending} data-testid="submit-employee-edit">
            {updateMutation.isPending ? 'Speichert...' : 'Änderungen speichern'}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
