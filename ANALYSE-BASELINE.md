# ANALYSE-BASELINE: Fernau-ERP v2

**Erstellt am:** 2026-03-19
**Quelle:** Analyse des alten Projekts unter `/Users/timo/IdeaProjects/pcc/erp/fernau-erp/`

---

## ⚠️ WICHTIG: Abweichungsverbot

**Diese Baseline ist verbindlich für alle Implementierungsschritte.**
Jede Abweichung vom ermittelten Stack erfordert **explizite Rückfrage** beim Benutzer.

---

## 1. TECHNOLOGIE-STACK (VERBINDLICH)

### Build & Framework
- **Build Tool:** Vite 5.4.19
- **Frontend-Framework:** React 18.3.1
- **Routing:** React Router DOM 6.30.2
- **Sprache:** TypeScript 5.8.3

### State Management & Data Fetching
- **Query Client:** @tanstack/react-query 5.83.0
- **Form Handling:** react-hook-form 7.61.1
- **Validation:** zod 3.25.76

### Backend & Auth
- **Supabase Client:** @supabase/supabase-js 2.75.0
- **Auth Storage:** localStorage
- **Session:** Persistent mit Auto-Refresh

### Styling & UI
- **CSS Framework:** Tailwind CSS 3.4.17
- **UI-Bibliothek:** shadcn/ui (vollständig)
- **Icon-Bibliothek:** lucide-react 0.462.0
- **Variants:** class-variance-authority 0.7.1
- **Utility:** tailwind-merge 2.6.0
- **Animation:** tailwindcss-animate 1.0.7

### Core UI-Komponenten (Radix UI)
- @radix-ui/react-dialog
- @radix-ui/react-dropdown-menu
- @radix-ui/react-select
- @radix-ui/react-tabs
- @radix-ui/react-toast
- @radix-ui/react-tooltip
- @radix-ui/react-collapsible
- @radix-ui/react-scroll-area
- @radix-ui/react-separator
- @radix-ui/react-label
- @radix-ui/react-slot
- (und weitere shadcn/ui Komponenten)

### Toast/Notifications
- **sonner** 1.7.4

### Date Handling
- **date-fns** 3.6.0

---

## 2. AUTHENTIFIZIERUNGS-KONZEPT (VERBINDLICH)

### A) Standard Web-Auth (Route: `/auth`)
```typescript
// Login
supabase.auth.signInWithPassword({ email, password })

// Registrierung
supabase.auth.signUp({ email, password })

// Protected Routes
<ProtectedRoute> Wrapper für alle geschützten Seiten
```

### B) BDE-Terminal Login (Komponente: `BDELogin`)
```typescript
// Workflow:
1. User ist bereits mit Supabase authentifiziert
2. System findet Mitarbeiter via user_id in employees-Tabelle
3. Mitarbeiter wählt workstation_id
4. Erstellt bde_session (employee_id, workstation_id, is_active)
5. Schließt alte Sessions automatisch
```

### Auth-Service Pattern
```typescript
// Datei: src/services/authService.ts
export async function fetchCurrentUser()
export async function checkUserAdminRole(userId: string)
```

---

## 3. ROUTING-STRUKTUR (VERBINDLICH)

### Router-Konfiguration
- **Library:** react-router-dom 6.30.2
- **Pattern:** BrowserRouter mit Routes/Route
- **Protected Routes:** Via ProtectedRoute-Wrapper
- **Future Flags:**
  - `v7_startTransition: true`
  - `v7_relativeSplatPath: true`

### Route-Hierarchie

#### 🏠 Home-Bereich (6 Routen - immer sichtbar)
- `/` - Dashboard
- `/kpi-dashboard` - KPI Dashboard
- `/calendar` - Kalender
- `/settings` - Grundeinstellungen
- `/notifications` - Benachrichtigungen
- `/glossary` - Glossar

#### 📊 Hauptmodule (7 Module)

**1. Buchhaltung** (`/accounting`) - 14 Routen
- `/accounting` - Dashboard
- `/accounting/customer-invoices`
- `/accounting/supplier-invoices`
- `/accounting/chart-of-accounts`
- `/accounting/cost-centers`
- `/accounting/cost-accounting`
- `/accounting/post-calculation`
- `/accounting/payroll`
- `/accounting/bank-accounts`
- `/accounting/bank-transactions`
- `/accounting/payment-runs`
- `/accounting/bank-reconciliation`
- `/accounting/bwa-upload`
- `/accounting/datev-export`
- `/accounting/dunning`
- `/accounting/autonomous`

**2. Einkauf** (`/procurement`) - 14 Routen
- `/procurement` - Dashboard
- `/procurement/suppliers`
- `/procurement/inquiries`
- `/procurement/orders`
- `/procurement/subcontract-orders`
- `/procurement/order-confirmations`
- `/procurement/supplier-performance`
- `/procurement/price-history`
- `/procurement/supplier-portal`
- `/procurement/suggestions`
- `/procurement/scorecard`
- `/procurement/contracts`
- `/procurement/cockpit`
- `/procurement/blanket-orders`
- `/procurement/delivery-tracking`
- `/procurement/cost-breakdown`

**3. Lager & Artikel** (`/inventory`) - 5 Routen
- `/inventory` - Dashboard
- `/inventory/article-master`
- `/inventory/delivery-notes`
- `/inventory/stocktaking`
- `/inventory/analytics`
- `/inventory/storage-optimization`

**4. Personalwesen** (`/hr`) - 11 Routen
- `/hr` - Dashboard
- `/hr/employees`
- `/hr/time-tracking`
- `/hr/time-management`
- `/hr/performance`
- `/hr/training-management`
- `/hr/document-automation`
- `/hr/feedback-360`
- `/quality/skills-matrix` (shared)
- `/quality/certifications` (shared)
- `/accounting/payroll` (shared)

**5. Produktion** (`/production`) - 8 Routen
- `/production` - Dashboard
- `/production/workstations`
- `/production/production-orders`
- `/production/bde-terminal`
- `/production/order-status`
- `/production/capacity-planning`
- `/production/bom-routing`
- `/production/unit-costs`

**6. Qualitätswesen** (`/quality`) - 13 Routen
- `/quality` - Dashboard (QualityDashboard)
- `/quality/analytics`
- `/quality/audits`
- `/quality/complaints`
- `/quality/iso9001`
- `/quality/management-review`
- `/quality/qualification`
- `/quality/skills-matrix`
- `/quality/training-manual`
- `/quality/supplier-evaluation`
- `/quality/organization-chart`
- `/quality/fmea`
- `/quality/swot`
- `/quality/spc`
- `/quality/certifications`

**7. Vertrieb** (`/sales`) - 10 Routen
- `/sales` - Dashboard
- `/sales/customers`
- `/sales/quotations`
- `/sales/orders`
- `/sales/leads`
- `/sales/forecast`
- `/sales/clv`
- `/sales/intelligence`
- `/av-automation` (Link zu AV)
- `/inventory/delivery-notes` (shared)

#### 🔧 Zusatzmodule (3 Module)

**8. Instandhaltung** (`/maintenance`) - 2 Routen
- `/maintenance` - Dashboard (MaintenanceDashboard)
- `/maintenance/tasks`

**9. Kundenportal** (`/customer-portal`) - 1 Route
- `/customer-portal`

**10. NC-Daten & Programme** (`/nc-management`) - 2 Routen
- `/nc-management` - Dashboard (NCDashboard)
- `/nc-management/programs`

#### 🤖 KI Module (1 Modul)

**11. KI & Deep Learning** (`/av-automation`) - 6 Routen
- `/av-automation` - AVAutomation
- `/av-automation/ai-deep-learning`
- `/av-automation/ai-control-center`
- `/av-automation/ai-operations-center`
- `/av-automation/deep-learning-monitoring`
- `/av-automation/ethical-ai-monitoring`
- `/av-automation/workflow-designer`

#### 🚪 Sonstige Routen
- `/auth` - Login/Registrierung (NICHT geschützt)
- `/profile` - Benutzerprofil
- `/messages` - Chat
- `/settings/erp-integrations` - ERP-Integrationen
- `*` - 404 NotFound

---

## 4. SIDEBAR-STRUKTUR (VERBINDLICH)

### Komponente: `src/components/layout/AppSidebar.tsx`

#### Architektur
- Basis: shadcn/ui Sidebar-Komponenten
- Collapsible Groups mit ChevronDown-Icons
- ScrollArea für lange Listen
- Collapsed/Expanded States via useSidebar()
- Tooltips bei collapsed State
- Mobile: Sheet-Overlay

#### Menu-Gruppen (4 Hauptgruppen)
1. **Home** (SidebarGroup - immer sichtbar)
2. **Hauptmodule** (Collapsible mit 7 Sub-Collapsibles)
3. **Zusatzmodule** (Collapsible mit 3 Sub-Collapsibles)
4. **KI Module** (Collapsible mit 1 Sub-Collapsible)
5. **Logout** (SidebarGroup - immer sichtbar)

#### Icon-Mapping (Beispiele)
- Building2 → Dashboard
- ShoppingCart → Einkauf
- Package → Lager
- Users → Personal/Kunden
- Calculator → Buchhaltung
- Activity → Produktion
- Shield → Qualität
- Brain → KI
- Wrench → Wartung

---

## 5. PROJEKT-STRUKTUR (VERBINDLICH)

```
src/
├── App.tsx                    # Haupt-App mit Router
├── main.tsx                   # Entry Point
├── index.css                  # Global Styles
├── components/
│   ├── ui/                    # shadcn/ui Komponenten
│   │   ├── sidebar.tsx
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── ... (alle shadcn)
│   ├── layout/
│   │   ├── AppSidebar.tsx    # Hauptnavigation
│   ├── ErrorBoundary.tsx
│   └── ... (Feature-Komponenten)
├── pages/
│   ├── Auth.tsx
│   ├── Index.tsx              # Dashboard
│   ├── accounting/
│   ├── procurement/
│   ├── inventory/
│   ├── hr/
│   ├── production/
│   ├── quality/
│   ├── sales/
│   ├── maintenance/
│   ├── nc-management/
│   ├── av-automation/
│   └── ... (weitere)
├── services/
│   ├── authService.ts         # Auth-Queries
│   └── ... (weitere Services)
├── integrations/
│   └── supabase/
│       ├── client.ts          # Supabase-Client
│       └── types.ts           # Datenbank-Types
├── hooks/
│   └── ... (Custom Hooks)
├── lib/
│   ├── utils.ts               # cn() Funktion etc.
│   └── ... (Utilities)
├── types/
│   └── ... (TypeScript Types)
└── contexts/
    └── ... (React Contexts)
```

---

## 6. SUPABASE-KONFIGURATION (VERBINDLICH)

### Client Setup
```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
```

### Tabellen (relevant für Auth)
- `user_roles` - Rollen-Management (role: 'admin', etc.)
- `employees` - Mitarbeiter (user_id FK)
- `bde_sessions` - BDE-Terminal Sessions
- `workstations` - Arbeitsplätze

---

## 7. QUERY CLIENT KONFIGURATION (VERBINDLICH)

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,      // 5 Minuten
      gcTime: 1000 * 60 * 30,         // 30 Minuten (ehemals cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

---

## 8. TAILWIND-KONFIGURATION (VERBINDLICH)

### Wichtige Custom-Werte
```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      sidebar: { ... },         // Sidebar-Farben
      success: { ... },         // ERP-Status-Farben
      warning: { ... },
      info: { ... },
    },
    backgroundImage: {
      'gradient-primary': 'var(--gradient-primary)',
    },
    boxShadow: {
      'corporate': 'var(--shadow-corporate)',
      'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    },
  },
}
```

---

## 9. TESTING & QUALITÄT

- **Unit Tests:** vitest 4.0.18
- **E2E Tests:** @playwright/test 1.58.2
- **Allure Reports:** allure-playwright 3.6.0

---

## 10. PACKAGE.JSON SCRIPTS (REFERENZ)

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "test": "vitest run",
  "test:e2e": "playwright test"
}
```

---

## ✅ CHECKLISTE FÜR JEDEN IMPLEMENTIERUNGSSCHRITT

**Vor dem Schreiben von Code:**

- [ ] ANALYSE-BASELINE explizit referenziert
- [ ] Verwendete Packages mit dieser Baseline abgeglichen
- [ ] Verwendete Versionen mit dieser Baseline abgeglichen
- [ ] Routing-Pattern mit dieser Baseline abgeglichen
- [ ] Component-Struktur mit dieser Baseline abgeglichen
- [ ] Auth-Pattern mit dieser Baseline abgeglichen

**Bei Abweichungsbedarf:**

- [ ] Explizite Rückfrage beim Benutzer gestellt
- [ ] Begründung für Abweichung dokumentiert
- [ ] Genehmigung erhalten

---

**Ende der ANALYSE-BASELINE**
