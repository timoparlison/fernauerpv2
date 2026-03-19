export type EmploymentType = 'fulltime' | 'parttime' | 'minijob'

export interface Employee {
  id: string
  employee_number: string
  first_name: string
  last_name: string
  position: string | null
  employment_type: EmploymentType | null
  birth_date: string | null
  entry_date: string | null
  vacation_days_per_year: number | null
  contact_phone: string | null
  mobile_phone: string | null
  contact_email: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  address: string | null
  iban: string | null
  bic: string | null
  account_holder: string | null
  monthly_gross_salary: number | null
  hourly_rate: number | null
  status: string
  time_tracking_enabled: boolean | null
  flextime_enabled: boolean | null
  bde_terminal_enabled: boolean | null
  weekly_hours: Record<string, number> | null
  time_account_hours: number | null
  remaining_vacation_days: number | null
  user_id: string | null
  created_at: string
  updated_at: string
}

export interface EmployeeAbsence {
  id: string
  employee_id: string
  absence_type: string
  start_date: string
  end_date: string
  days_count: number | null
  notes: string | null
  created_at: string
}

export const employmentTypeLabels: Record<EmploymentType, string> = {
  fulltime: 'Vollzeit',
  parttime: 'Teilzeit',
  minijob: 'Minijob',
}

export const absenceTypeLabels: Record<string, string> = {
  urlaub: 'Urlaub',
  krank: 'Krank',
  kind_krank: 'Kind Krank',
  gleitzeit: 'Gleitzeit',
  elternzeit: 'Elternzeit',
  sonderurlaub: 'Sonderurlaub',
  berufsschule: 'Berufsschule',
  weiterbildung: 'Weiterbildung',
  unbezahlter_urlaub: 'Unbezahlter Urlaub',
  ungeplante_abwesenheit: 'Ungeplante Abwesenheit',
}

export const DEFAULT_WEEKLY_HOURS: Record<string, number> = {
  monday: 8,
  tuesday: 8,
  wednesday: 8,
  thursday: 8,
  friday: 8,
  saturday: 0,
  sunday: 0,
}

export const DAY_LABELS: Record<string, string> = {
  monday: 'Mo',
  tuesday: 'Di',
  wednesday: 'Mi',
  thursday: 'Do',
  friday: 'Fr',
  saturday: 'Sa',
  sunday: 'So',
}
