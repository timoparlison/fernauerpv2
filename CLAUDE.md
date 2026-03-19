# Claude Instructions: Fernau-ERP v2

## 🎯 Projektübersicht

**Fernau-ERP v2** ist ein sauberer Neuaufbau eines umfassenden Enterprise-ERP-Systems.

- **Altes Projekt:** `/Users/timo/IdeaProjects/pcc/erp/fernau-erp/`
- **Neues Projekt:** `/Users/timo/IdeaProjects/pcc/erp/fernauerpv2/`
- **Ziel:** Kompletter Neuaufbau basierend auf dem alten System

---

## ⚠️ WICHTIGSTE REGEL

**Lies IMMER zuerst die `ANALYSE-BASELINE.md` bevor du Code schreibst!**

Diese Datei enthält:
- Verbindlichen Technologie-Stack (Versionen!)
- Authentifizierungs-Konzept
- Routing-Struktur (95+ Routen)
- Sidebar-Struktur
- Projekt-Konventionen

**Abweichungen vom Stack sind VERBOTEN ohne explizite Rückfrage!**

---

## 📋 Vor jedem Code-Schritt

1. ✅ `ANALYSE-BASELINE.md` Abschnitt X referenzieren
2. ✅ Package-Versionen mit Baseline abgleichen
3. ✅ Routing-Pattern validieren
4. ✅ Component-Struktur prüfen
5. ✅ Auth-Pattern bestätigen

---

## 🔧 Technologie-Stack (VERBINDLICH)

```json
{
  "vite": "5.4.19",
  "react": "18.3.1",
  "react-router-dom": "6.30.2",
  "typescript": "5.8.3",
  "@supabase/supabase-js": "2.75.0",
  "@tanstack/react-query": "5.83.0",
  "tailwindcss": "3.4.17",
  "lucide-react": "0.462.0"
}
```

**UI:** shadcn/ui (vollständig)

---

## 🔐 Authentifizierung

### Zwei Auth-Methoden:

1. **Standard Web-Auth** (`/auth`)
   - Email + Passwort via Supabase Auth
   - Protected Routes via `<ProtectedRoute>` Wrapper

2. **BDE-Terminal Login** (`BDELogin` Komponente)
   - Für Produktionsmitarbeiter
   - User → Employee → Workstation → BDE Session

---

## 📁 Projekt-Struktur

```
src/
├── App.tsx                    # Router + QueryClient
├── main.tsx                   # Entry Point
├── components/
│   ├── ui/                    # shadcn/ui
│   ├── layout/
│   │   └── AppSidebar.tsx    # Hauptnavigation
├── pages/                     # 95+ Routen
├── services/
│   └── authService.ts         # Auth-Queries
├── integrations/supabase/
│   ├── client.ts
│   └── types.ts
```

---

## 🗺️ Navigation (4 Gruppen)

1. **Home** - 6 Menüpunkte (immer sichtbar)
2. **Hauptmodule** - 7 Module (collapsible)
   - Buchhaltung, Einkauf, Lager, Personal, Produktion, Qualität, Vertrieb
3. **Zusatzmodule** - 3 Module (collapsible)
   - Instandhaltung, Kundenportal, NC-Management
4. **KI Module** - 1 Modul (collapsible)
   - AI Control Center, Deep Learning, etc.

---

## 🚨 Bei Problemen

1. Prüfe `ANALYSE-BASELINE.md`
2. Prüfe `NEXT-STEPS.md`
3. Bei Abweichungswunsch → **Rückfrage beim User!**

---

## 📝 Commit-Konvention

```bash
# Immer mit Co-Authored-By:
git commit -m "$(cat <<'EOF'
Kurze Beschreibung

Details...

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

---

**Stand:** 2026-03-19 (Projekt-Start)
