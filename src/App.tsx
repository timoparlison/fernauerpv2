import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'

// Pages
import Auth from '@/pages/Auth'
import NotFound from '@/pages/NotFound'
import Dashboard from '@/pages/Index'
import KpiDashboard from '@/pages/KpiDashboard'
import Calendar from '@/pages/Calendar'
import Settings from '@/pages/Settings'
import Notifications from '@/pages/Notifications'
import Glossary from '@/pages/Glossary'
import Profile from '@/pages/Profile'
import Messages from '@/pages/Messages'
import CustomerPortal from '@/pages/CustomerPortal'

// Accounting
import AccountingDashboard from '@/pages/accounting/AccountingDashboard'
import CustomerInvoices from '@/pages/accounting/CustomerInvoices'
import SupplierInvoices from '@/pages/accounting/SupplierInvoices'
import ChartOfAccounts from '@/pages/accounting/ChartOfAccounts'
import CostCenters from '@/pages/accounting/CostCenters'
import CostAccounting from '@/pages/accounting/CostAccounting'
import PostCalculation from '@/pages/accounting/PostCalculation'
import Payroll from '@/pages/accounting/Payroll'
import BankAccounts from '@/pages/accounting/BankAccounts'
import BankTransactions from '@/pages/accounting/BankTransactions'
import PaymentRuns from '@/pages/accounting/PaymentRuns'
import BankReconciliation from '@/pages/accounting/BankReconciliation'
import BwaUpload from '@/pages/accounting/BwaUpload'
import DatevExport from '@/pages/accounting/DatevExport'
import Dunning from '@/pages/accounting/Dunning'
import Autonomous from '@/pages/accounting/Autonomous'
import ErpIntegrations from '@/pages/settings/ErpIntegrations'

// Procurement
import ProcurementDashboard from '@/pages/procurement/ProcurementDashboard'
import Suppliers from '@/pages/procurement/Suppliers'
import Inquiries from '@/pages/procurement/Inquiries'
import ProcurementOrders from '@/pages/procurement/Orders'
import SubcontractOrders from '@/pages/procurement/SubcontractOrders'
import OrderConfirmations from '@/pages/procurement/OrderConfirmations'
import SupplierPerformance from '@/pages/procurement/SupplierPerformance'
import PriceHistory from '@/pages/procurement/PriceHistory'
import SupplierPortal from '@/pages/procurement/SupplierPortal'
import ProcurementSuggestions from '@/pages/procurement/Suggestions'
import Scorecard from '@/pages/procurement/Scorecard'
import Contracts from '@/pages/procurement/Contracts'
import ProcurementCockpit from '@/pages/procurement/Cockpit'
import BlanketOrders from '@/pages/procurement/BlanketOrders'
import DeliveryTracking from '@/pages/procurement/DeliveryTracking'
import CostBreakdown from '@/pages/procurement/CostBreakdown'

// Inventory
import InventoryDashboard from '@/pages/inventory/InventoryDashboard'
import ArticleMaster from '@/pages/inventory/ArticleMaster'
import DeliveryNotes from '@/pages/inventory/DeliveryNotes'
import Stocktaking from '@/pages/inventory/Stocktaking'
import InventoryAnalytics from '@/pages/inventory/Analytics'
import StorageOptimization from '@/pages/inventory/StorageOptimization'

// HR
import HrDashboard from '@/pages/hr/HrDashboard'
import Employees from '@/pages/hr/Employees'
import TimeTracking from '@/pages/hr/TimeTracking'
import TimeManagement from '@/pages/hr/TimeManagement'
import Performance from '@/pages/hr/Performance'
import TrainingManagement from '@/pages/hr/TrainingManagement'
import DocumentAutomation from '@/pages/hr/DocumentAutomation'
import Feedback360 from '@/pages/hr/Feedback360'

// Production
import ProductionDashboard from '@/pages/production/ProductionDashboard'
import Workstations from '@/pages/production/Workstations'
import ProductionOrders from '@/pages/production/ProductionOrders'
import BdeTerminal from '@/pages/production/BdeTerminal'
import OrderStatus from '@/pages/production/OrderStatus'
import CapacityPlanning from '@/pages/production/CapacityPlanning'
import BomRouting from '@/pages/production/BomRouting'
import UnitCosts from '@/pages/production/UnitCosts'

// Quality
import QualityDashboard from '@/pages/quality/QualityDashboard'
import QualityAnalytics from '@/pages/quality/Analytics'
import Audits from '@/pages/quality/Audits'
import Complaints from '@/pages/quality/Complaints'
import Iso9001 from '@/pages/quality/Iso9001'
import ManagementReview from '@/pages/quality/ManagementReview'
import Qualification from '@/pages/quality/Qualification'
import SkillsMatrix from '@/pages/quality/SkillsMatrix'
import QualityTrainingManual from '@/pages/quality/TrainingManual'
import SupplierEvaluation from '@/pages/quality/SupplierEvaluation'
import OrganizationChart from '@/pages/quality/OrganizationChart'
import Fmea from '@/pages/quality/Fmea'
import Swot from '@/pages/quality/Swot'
import Spc from '@/pages/quality/Spc'
import Certifications from '@/pages/quality/Certifications'

// Sales
import SalesDashboard from '@/pages/sales/SalesDashboard'
import Customers from '@/pages/sales/Customers'
import Quotations from '@/pages/sales/Quotations'
import SalesOrders from '@/pages/sales/Orders'
import Leads from '@/pages/sales/Leads'
import Forecast from '@/pages/sales/Forecast'
import Clv from '@/pages/sales/Clv'
import SalesIntelligence from '@/pages/sales/Intelligence'

// Maintenance
import MaintenanceDashboard from '@/pages/maintenance/MaintenanceDashboard'
import MaintenanceTasks from '@/pages/maintenance/Tasks'

// NC Management
import NCDashboard from '@/pages/nc-management/NCDashboard'
import NCPrograms from '@/pages/nc-management/Programs'

// AV Automation / KI
import AVAutomation from '@/pages/av-automation/AVAutomation'
import AiDeepLearning from '@/pages/av-automation/AiDeepLearning'
import AiControlCenter from '@/pages/av-automation/AiControlCenter'
import AiOperationsCenter from '@/pages/av-automation/AiOperationsCenter'
import DeepLearningMonitoring from '@/pages/av-automation/DeepLearningMonitoring'
import EthicalAiMonitoring from '@/pages/av-automation/EthicalAiMonitoring'
import WorkflowDesigner from '@/pages/av-automation/WorkflowDesigner'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            {/* Public */}
            <Route path="/auth" element={<Auth />} />

            {/* Protected - AppLayout renders Outlet */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              {/* Home */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/kpi-dashboard" element={<KpiDashboard />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/glossary" element={<Glossary />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/customer-portal" element={<CustomerPortal />} />
              <Route path="/settings/erp-integrations" element={<ErpIntegrations />} />

              {/* Accounting */}
              <Route path="/accounting" element={<AccountingDashboard />} />
              <Route path="/accounting/customer-invoices" element={<CustomerInvoices />} />
              <Route path="/accounting/supplier-invoices" element={<SupplierInvoices />} />
              <Route path="/accounting/chart-of-accounts" element={<ChartOfAccounts />} />
              <Route path="/accounting/cost-centers" element={<CostCenters />} />
              <Route path="/accounting/cost-accounting" element={<CostAccounting />} />
              <Route path="/accounting/post-calculation" element={<PostCalculation />} />
              <Route path="/accounting/payroll" element={<Payroll />} />
              <Route path="/accounting/bank-accounts" element={<BankAccounts />} />
              <Route path="/accounting/bank-transactions" element={<BankTransactions />} />
              <Route path="/accounting/payment-runs" element={<PaymentRuns />} />
              <Route path="/accounting/bank-reconciliation" element={<BankReconciliation />} />
              <Route path="/accounting/bwa-upload" element={<BwaUpload />} />
              <Route path="/accounting/datev-export" element={<DatevExport />} />
              <Route path="/accounting/dunning" element={<Dunning />} />
              <Route path="/accounting/autonomous" element={<Autonomous />} />

              {/* Procurement */}
              <Route path="/procurement" element={<ProcurementDashboard />} />
              <Route path="/procurement/suppliers" element={<Suppliers />} />
              <Route path="/procurement/inquiries" element={<Inquiries />} />
              <Route path="/procurement/orders" element={<ProcurementOrders />} />
              <Route path="/procurement/subcontract-orders" element={<SubcontractOrders />} />
              <Route path="/procurement/order-confirmations" element={<OrderConfirmations />} />
              <Route path="/procurement/supplier-performance" element={<SupplierPerformance />} />
              <Route path="/procurement/price-history" element={<PriceHistory />} />
              <Route path="/procurement/supplier-portal" element={<SupplierPortal />} />
              <Route path="/procurement/suggestions" element={<ProcurementSuggestions />} />
              <Route path="/procurement/scorecard" element={<Scorecard />} />
              <Route path="/procurement/contracts" element={<Contracts />} />
              <Route path="/procurement/cockpit" element={<ProcurementCockpit />} />
              <Route path="/procurement/blanket-orders" element={<BlanketOrders />} />
              <Route path="/procurement/delivery-tracking" element={<DeliveryTracking />} />
              <Route path="/procurement/cost-breakdown" element={<CostBreakdown />} />

              {/* Inventory */}
              <Route path="/inventory" element={<InventoryDashboard />} />
              <Route path="/inventory/article-master" element={<ArticleMaster />} />
              <Route path="/inventory/delivery-notes" element={<DeliveryNotes />} />
              <Route path="/inventory/stocktaking" element={<Stocktaking />} />
              <Route path="/inventory/analytics" element={<InventoryAnalytics />} />
              <Route path="/inventory/storage-optimization" element={<StorageOptimization />} />

              {/* HR */}
              <Route path="/hr" element={<HrDashboard />} />
              <Route path="/hr/employees" element={<Employees />} />
              <Route path="/hr/time-tracking" element={<TimeTracking />} />
              <Route path="/hr/time-management" element={<TimeManagement />} />
              <Route path="/hr/performance" element={<Performance />} />
              <Route path="/hr/training-management" element={<TrainingManagement />} />
              <Route path="/hr/document-automation" element={<DocumentAutomation />} />
              <Route path="/hr/feedback-360" element={<Feedback360 />} />

              {/* Production */}
              <Route path="/production" element={<ProductionDashboard />} />
              <Route path="/production/workstations" element={<Workstations />} />
              <Route path="/production/production-orders" element={<ProductionOrders />} />
              <Route path="/production/bde-terminal" element={<BdeTerminal />} />
              <Route path="/production/order-status" element={<OrderStatus />} />
              <Route path="/production/capacity-planning" element={<CapacityPlanning />} />
              <Route path="/production/bom-routing" element={<BomRouting />} />
              <Route path="/production/unit-costs" element={<UnitCosts />} />

              {/* Quality */}
              <Route path="/quality" element={<QualityDashboard />} />
              <Route path="/quality/analytics" element={<QualityAnalytics />} />
              <Route path="/quality/audits" element={<Audits />} />
              <Route path="/quality/complaints" element={<Complaints />} />
              <Route path="/quality/iso9001" element={<Iso9001 />} />
              <Route path="/quality/management-review" element={<ManagementReview />} />
              <Route path="/quality/qualification" element={<Qualification />} />
              <Route path="/quality/skills-matrix" element={<SkillsMatrix />} />
              <Route path="/quality/training-manual" element={<QualityTrainingManual />} />
              <Route path="/quality/supplier-evaluation" element={<SupplierEvaluation />} />
              <Route path="/quality/organization-chart" element={<OrganizationChart />} />
              <Route path="/quality/fmea" element={<Fmea />} />
              <Route path="/quality/swot" element={<Swot />} />
              <Route path="/quality/spc" element={<Spc />} />
              <Route path="/quality/certifications" element={<Certifications />} />

              {/* Sales */}
              <Route path="/sales" element={<SalesDashboard />} />
              <Route path="/sales/customers" element={<Customers />} />
              <Route path="/sales/quotations" element={<Quotations />} />
              <Route path="/sales/orders" element={<SalesOrders />} />
              <Route path="/sales/leads" element={<Leads />} />
              <Route path="/sales/forecast" element={<Forecast />} />
              <Route path="/sales/clv" element={<Clv />} />
              <Route path="/sales/intelligence" element={<SalesIntelligence />} />

              {/* Maintenance */}
              <Route path="/maintenance" element={<MaintenanceDashboard />} />
              <Route path="/maintenance/tasks" element={<MaintenanceTasks />} />

              {/* NC Management */}
              <Route path="/nc-management" element={<NCDashboard />} />
              <Route path="/nc-management/programs" element={<NCPrograms />} />

              {/* AV Automation / KI */}
              <Route path="/av-automation" element={<AVAutomation />} />
              <Route path="/av-automation/ai-deep-learning" element={<AiDeepLearning />} />
              <Route path="/av-automation/ai-control-center" element={<AiControlCenter />} />
              <Route path="/av-automation/ai-operations-center" element={<AiOperationsCenter />} />
              <Route path="/av-automation/deep-learning-monitoring" element={<DeepLearningMonitoring />} />
              <Route path="/av-automation/ethical-ai-monitoring" element={<EthicalAiMonitoring />} />
              <Route path="/av-automation/workflow-designer" element={<WorkflowDesigner />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
