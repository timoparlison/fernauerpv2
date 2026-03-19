import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Building2, BarChart3, Calendar, Settings, Bell, BookOpen,
  Calculator, ShoppingCart, Package, Users, Activity, Shield,
  Brain, Wrench, Globe, Monitor, ChevronDown, ChevronRight,
  LogOut, Menu, X, LayoutDashboard, FileText, Cpu,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
}

interface NavGroup {
  label: string
  icon: React.ReactNode
  items: NavItem[]
}

const homeItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: <LayoutDashboard size={16} /> },
  { label: 'KPI Dashboard', path: '/kpi-dashboard', icon: <BarChart3 size={16} /> },
  { label: 'Kalender', path: '/calendar', icon: <Calendar size={16} /> },
  { label: 'Grundeinstellungen', path: '/settings', icon: <Settings size={16} /> },
  { label: 'Benachrichtigungen', path: '/notifications', icon: <Bell size={16} /> },
  { label: 'Glossar', path: '/glossary', icon: <BookOpen size={16} /> },
]

const mainModules: NavGroup[] = [
  {
    label: 'Buchhaltung',
    icon: <Calculator size={16} />,
    items: [
      { label: 'Dashboard', path: '/accounting', icon: <LayoutDashboard size={14} /> },
      { label: 'Ausgangsrechnungen', path: '/accounting/customer-invoices', icon: <FileText size={14} /> },
      { label: 'Eingangsrechnungen', path: '/accounting/supplier-invoices', icon: <FileText size={14} /> },
      { label: 'Kontenplan', path: '/accounting/chart-of-accounts', icon: <FileText size={14} /> },
      { label: 'Kostenstellen', path: '/accounting/cost-centers', icon: <FileText size={14} /> },
      { label: 'Kostenrechnung', path: '/accounting/cost-accounting', icon: <FileText size={14} /> },
      { label: 'Nachkalkulation', path: '/accounting/post-calculation', icon: <FileText size={14} /> },
      { label: 'Lohnbuchhaltung', path: '/accounting/payroll', icon: <FileText size={14} /> },
      { label: 'Bankkonten', path: '/accounting/bank-accounts', icon: <FileText size={14} /> },
      { label: 'Banktransaktionen', path: '/accounting/bank-transactions', icon: <FileText size={14} /> },
      { label: 'Zahlungsläufe', path: '/accounting/payment-runs', icon: <FileText size={14} /> },
      { label: 'Kontoabstimmung', path: '/accounting/bank-reconciliation', icon: <FileText size={14} /> },
      { label: 'BWA Upload', path: '/accounting/bwa-upload', icon: <FileText size={14} /> },
      { label: 'DATEV Export', path: '/accounting/datev-export', icon: <FileText size={14} /> },
      { label: 'Mahnwesen', path: '/accounting/dunning', icon: <FileText size={14} /> },
    ],
  },
  {
    label: 'Einkauf',
    icon: <ShoppingCart size={16} />,
    items: [
      { label: 'Dashboard', path: '/procurement', icon: <LayoutDashboard size={14} /> },
      { label: 'Lieferanten', path: '/procurement/suppliers', icon: <FileText size={14} /> },
      { label: 'Anfragen', path: '/procurement/inquiries', icon: <FileText size={14} /> },
      { label: 'Bestellungen', path: '/procurement/orders', icon: <FileText size={14} /> },
      { label: 'Lohnaufträge', path: '/procurement/subcontract-orders', icon: <FileText size={14} /> },
      { label: 'Auftragsbestätigungen', path: '/procurement/order-confirmations', icon: <FileText size={14} /> },
      { label: 'Lieferantenleistung', path: '/procurement/supplier-performance', icon: <FileText size={14} /> },
      { label: 'Preishistorie', path: '/procurement/price-history', icon: <FileText size={14} /> },
      { label: 'Verträge', path: '/procurement/contracts', icon: <FileText size={14} /> },
      { label: 'Cockpit', path: '/procurement/cockpit', icon: <FileText size={14} /> },
      { label: 'Rahmenaufträge', path: '/procurement/blanket-orders', icon: <FileText size={14} /> },
      { label: 'Lieferverfolgung', path: '/procurement/delivery-tracking', icon: <FileText size={14} /> },
    ],
  },
  {
    label: 'Lager & Artikel',
    icon: <Package size={16} />,
    items: [
      { label: 'Dashboard', path: '/inventory', icon: <LayoutDashboard size={14} /> },
      { label: 'Artikelstamm', path: '/inventory/article-master', icon: <FileText size={14} /> },
      { label: 'Lieferscheine', path: '/inventory/delivery-notes', icon: <FileText size={14} /> },
      { label: 'Inventur', path: '/inventory/stocktaking', icon: <FileText size={14} /> },
      { label: 'Lageranalyse', path: '/inventory/analytics', icon: <FileText size={14} /> },
      { label: 'Lageroptimierung', path: '/inventory/storage-optimization', icon: <FileText size={14} /> },
    ],
  },
  {
    label: 'Personal',
    icon: <Users size={16} />,
    items: [
      { label: 'Dashboard', path: '/hr', icon: <LayoutDashboard size={14} /> },
      { label: 'Mitarbeiter', path: '/hr/employees', icon: <FileText size={14} /> },
      { label: 'Zeiterfassung', path: '/hr/time-tracking', icon: <FileText size={14} /> },
      { label: 'Zeitverwaltung', path: '/hr/time-management', icon: <FileText size={14} /> },
      { label: 'Leistungsbeurteilung', path: '/hr/performance', icon: <FileText size={14} /> },
      { label: 'Schulungsverwaltung', path: '/hr/training-management', icon: <FileText size={14} /> },
      { label: 'Dokumentenautomatisierung', path: '/hr/document-automation', icon: <FileText size={14} /> },
      { label: '360-Grad-Feedback', path: '/hr/feedback-360', icon: <FileText size={14} /> },
    ],
  },
  {
    label: 'Produktion',
    icon: <Activity size={16} />,
    items: [
      { label: 'Dashboard', path: '/production', icon: <LayoutDashboard size={14} /> },
      { label: 'Arbeitsstationen', path: '/production/workstations', icon: <FileText size={14} /> },
      { label: 'Fertigungsaufträge', path: '/production/production-orders', icon: <FileText size={14} /> },
      { label: 'BDE Terminal', path: '/production/bde-terminal', icon: <Monitor size={14} /> },
      { label: 'Auftragsstatus', path: '/production/order-status', icon: <FileText size={14} /> },
      { label: 'Kapazitätsplanung', path: '/production/capacity-planning', icon: <FileText size={14} /> },
      { label: 'Stückliste & Arbeitsplan', path: '/production/bom-routing', icon: <FileText size={14} /> },
      { label: 'Stückkosten', path: '/production/unit-costs', icon: <FileText size={14} /> },
    ],
  },
  {
    label: 'Qualität',
    icon: <Shield size={16} />,
    items: [
      { label: 'Dashboard', path: '/quality', icon: <LayoutDashboard size={14} /> },
      { label: 'Qualitätsanalyse', path: '/quality/analytics', icon: <FileText size={14} /> },
      { label: 'Audits', path: '/quality/audits', icon: <FileText size={14} /> },
      { label: 'Reklamationen', path: '/quality/complaints', icon: <FileText size={14} /> },
      { label: 'ISO 9001', path: '/quality/iso9001', icon: <FileText size={14} /> },
      { label: 'Management Review', path: '/quality/management-review', icon: <FileText size={14} /> },
      { label: 'Qualifikation', path: '/quality/qualification', icon: <FileText size={14} /> },
      { label: 'Qualifikationsmatrix', path: '/quality/skills-matrix', icon: <FileText size={14} /> },
      { label: 'Schulungshandbuch', path: '/quality/training-manual', icon: <FileText size={14} /> },
      { label: 'Lieferantenbewertung', path: '/quality/supplier-evaluation', icon: <FileText size={14} /> },
      { label: 'Organigramm', path: '/quality/organization-chart', icon: <FileText size={14} /> },
      { label: 'FMEA', path: '/quality/fmea', icon: <FileText size={14} /> },
      { label: 'SWOT', path: '/quality/swot', icon: <FileText size={14} /> },
      { label: 'SPC', path: '/quality/spc', icon: <FileText size={14} /> },
      { label: 'Zertifizierungen', path: '/quality/certifications', icon: <FileText size={14} /> },
    ],
  },
  {
    label: 'Vertrieb',
    icon: <Building2 size={16} />,
    items: [
      { label: 'Dashboard', path: '/sales', icon: <LayoutDashboard size={14} /> },
      { label: 'Kunden', path: '/sales/customers', icon: <FileText size={14} /> },
      { label: 'Angebote', path: '/sales/quotations', icon: <FileText size={14} /> },
      { label: 'Aufträge', path: '/sales/orders', icon: <FileText size={14} /> },
      { label: 'Leads', path: '/sales/leads', icon: <FileText size={14} /> },
      { label: 'Forecast', path: '/sales/forecast', icon: <FileText size={14} /> },
      { label: 'Customer Lifetime Value', path: '/sales/clv', icon: <FileText size={14} /> },
      { label: 'Sales Intelligence', path: '/sales/intelligence', icon: <FileText size={14} /> },
    ],
  },
]

const additionalModules: NavGroup[] = [
  {
    label: 'Instandhaltung',
    icon: <Wrench size={16} />,
    items: [
      { label: 'Dashboard', path: '/maintenance', icon: <LayoutDashboard size={14} /> },
      { label: 'Aufgaben', path: '/maintenance/tasks', icon: <FileText size={14} /> },
    ],
  },
  {
    label: 'Kundenportal',
    icon: <Globe size={16} />,
    items: [
      { label: 'Kundenportal', path: '/customer-portal', icon: <Globe size={14} /> },
    ],
  },
  {
    label: 'NC-Daten & Programme',
    icon: <Cpu size={16} />,
    items: [
      { label: 'Dashboard', path: '/nc-management', icon: <LayoutDashboard size={14} /> },
      { label: 'NC-Programme', path: '/nc-management/programs', icon: <FileText size={14} /> },
    ],
  },
]

const aiModules: NavGroup[] = [
  {
    label: 'KI & Deep Learning',
    icon: <Brain size={16} />,
    items: [
      { label: 'KI & Automatisierung', path: '/av-automation', icon: <Brain size={14} /> },
      { label: 'AI Deep Learning', path: '/av-automation/ai-deep-learning', icon: <FileText size={14} /> },
      { label: 'AI Control Center', path: '/av-automation/ai-control-center', icon: <FileText size={14} /> },
      { label: 'AI Operations Center', path: '/av-automation/ai-operations-center', icon: <FileText size={14} /> },
      { label: 'Deep Learning Monitoring', path: '/av-automation/deep-learning-monitoring', icon: <FileText size={14} /> },
      { label: 'Ethical AI Monitoring', path: '/av-automation/ethical-ai-monitoring', icon: <FileText size={14} /> },
      { label: 'Workflow Designer', path: '/av-automation/workflow-designer', icon: <FileText size={14} /> },
    ],
  },
]

function NavGroupSection({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md transition-colors"
      >
        <span className="flex items-center gap-2">
          {group.icon}
          {group.label}
        </span>
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      {open && (
        <div className="ml-4 mt-1 space-y-0.5">
          {group.items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/accounting' || item.path === '/procurement' || item.path === '/inventory' || item.path === '/hr' || item.path === '/production' || item.path === '/quality' || item.path === '/sales' || item.path === '/maintenance' || item.path === '/nc-management' || item.path === '/av-automation'}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5 text-xs rounded-md transition-colors ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

function ModuleSection({ title, groups }: { title: string; groups: NavGroup[] }) {
  const [open, setOpen] = useState(true)

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider hover:text-sidebar-foreground/70 transition-colors"
      >
        {title}
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      </button>
      {open && (
        <div className="mt-1 space-y-0.5">
          {groups.map((group) => (
            <NavGroupSection key={group.label} group={group} />
          ))}
        </div>
      )}
    </div>
  )
}

export function AppSidebar({ onClose }: { onClose?: () => void }) {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth', { replace: true })
  }

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-sidebar-border">
        <div>
          <h1 className="text-lg font-bold text-sidebar-foreground">Fernau ERP</h1>
          <p className="text-xs text-sidebar-foreground/50">v2.0</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-sidebar-foreground/50 hover:text-sidebar-foreground">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Scrollable Nav */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {/* Home */}
        <div>
          <p className="px-3 py-1.5 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
            Home
          </p>
          <div className="mt-1 space-y-0.5">
            {homeItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
                      : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Hauptmodule */}
        <ModuleSection title="Hauptmodule" groups={mainModules} />

        {/* Zusatzmodule */}
        <ModuleSection title="Zusatzmodule" groups={additionalModules} />

        {/* KI Module */}
      </div>

      {/* Footer / Logout */}
      <div className="px-3 py-4 border-t border-sidebar-border">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md transition-colors"
        >
          <LogOut size={16} />
          Abmelden
        </button>
      </div>
    </div>
  )
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 bg-sidebar text-sidebar-foreground rounded-md shadow-lg md:hidden"
      >
        <Menu size={20} />
      </button>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72">
            <AppSidebar onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
