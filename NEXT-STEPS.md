# Next Steps: Fernau-ERP v2

**Stand:** 2026-03-19 nach IntelliJ Neustart

---

## ✅ Bereits erledigt

1. ✅ Altes Projekt analysiert (`/Users/timo/IdeaProjects/pcc/erp/fernau-erp/`)
2. ✅ `ANALYSE-BASELINE.md` erstellt (verbindliche Referenz)
3. ✅ `.gitignore` erstellt
4. ✅ Initial Commit + Push nach GitHub
5. ✅ `CLAUDE.md` erstellt (Projekt-Anweisungen)

---

## 🔜 Nächste Schritte (in dieser Reihenfolge)

### Schritt 2: Projekt initialisieren

**Gemäß ANALYSE-BASELINE (Abschnitt 1: Technologie-Stack)**

```bash
# Vite + React + TypeScript Projekt erstellen
npm create vite@5.4.19 . -- --template react-ts

# Dependencies installieren (exakte Versionen aus Baseline!)
npm install react@18.3.1 react-dom@18.3.1
npm install react-router-dom@6.30.2
npm install @supabase/supabase-js@2.75.0
npm install @tanstack/react-query@5.83.0
npm install tailwindcss@3.4.17 autoprefixer postcss
npm install lucide-react@0.462.0
npm install sonner@1.7.4
npm install react-hook-form@7.61.1
npm install zod@3.25.76
npm install date-fns@3.6.0
npm install class-variance-authority@0.7.1
npm install tailwind-merge@2.6.0
npm install tailwindcss-animate@1.0.7

# shadcn/ui initialisieren
npx shadcn-ui@latest init
```

---

### Schritt 3: Basis-Konfiguration

**Gemäß ANALYSE-BASELINE (Abschnitt 6, 7, 8)**

1. `tailwind.config.ts` konfigurieren (Custom-Farben, Sidebar, etc.)
2. `vite.config.ts` anpassen
3. `tsconfig.json` Path-Aliases (@/*) einrichten
4. `.env.example` für Supabase-Credentials erstellen

---

### Schritt 4: Supabase Setup

**Gemäß ANALYSE-BASELINE (Abschnitt 6: Supabase-Konfiguration)**

1. `src/integrations/supabase/client.ts` erstellen
2. Environment Variables konfigurieren
3. Auth-Storage: localStorage + persistSession

---

### Schritt 5: shadcn/ui Komponenten

**Gemäß ANALYSE-BASELINE (Abschnitt 1: Core UI-Komponenten)**

```bash
# Basis-Komponenten
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add select
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add sidebar
npx shadcn-ui@latest add collapsible
npx shadcn-ui@latest add scroll-area
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add label
# ... weitere nach Bedarf
```

---

### Schritt 6: Auth-System

**Gemäß ANALYSE-BASELINE (Abschnitt 2: Authentifizierungs-Konzept)**

1. `src/services/authService.ts` erstellen
2. `src/pages/Auth.tsx` erstellen (Login/Registrierung)
3. `ProtectedRoute` Wrapper erstellen
4. BDE-Login später (erst nach Employee-Tabellen)

---

### Schritt 7: Routing-Grundstruktur

**Gemäß ANALYSE-BASELINE (Abschnitt 3: Routing-Struktur)**

1. `src/App.tsx` mit BrowserRouter + Routes
2. QueryClient konfigurieren (staleTime: 5min, gcTime: 30min)
3. ErrorBoundary einrichten
4. `/auth` Route (nicht geschützt)
5. `/` Dashboard Route (geschützt)
6. `*` NotFound Route

---

### Schritt 8: Sidebar & Layout

**Gemäß ANALYSE-BASELINE (Abschnitt 4: Sidebar-Struktur)**

1. `src/components/layout/AppSidebar.tsx` erstellen
2. 4 Hauptgruppen implementieren:
   - Home (6 Items)
   - Hauptmodule (7 Collapsibles)
   - Zusatzmodule (3 Collapsibles)
   - KI Module (1 Collapsible)
3. Logout-Button

---

### Schritt 9: Seiten-Stubs

**Gemäß ANALYSE-BASELINE (Abschnitt 3: Route-Hierarchie)**

Für alle 95+ Routen Stub-Seiten erstellen:
- `src/pages/Index.tsx` (Dashboard)
- `src/pages/accounting/*`
- `src/pages/procurement/*`
- `src/pages/inventory/*`
- `src/pages/hr/*`
- `src/pages/production/*`
- `src/pages/quality/*`
- `src/pages/sales/*`
- etc.

---

### Schritt 10: Erste Tests

1. Dev-Server starten: `npm run dev`
2. Login/Logout testen
3. Navigation testen
4. Responsive-Design prüfen

---

## 📌 Wichtige Notizen

- **IMMER** `ANALYSE-BASELINE.md` referenzieren vor Code!
- **KEINE** Abweichungen von Versionen ohne Rückfrage!
- **shadcn/ui** vollständig nutzen (kein custom UI)
- **Commits** immer mit Co-Authored-By

---

## 🔄 Nach IntelliJ Neustart

1. Terminal neu öffnen
2. `cd /Users/timo/IdeaProjects/pcc/erp/fernauerpv2`
3. Diese Datei lesen
4. Mit Schritt 2 fortfahren

---

**Bereit zum Loslegen! 🚀**
