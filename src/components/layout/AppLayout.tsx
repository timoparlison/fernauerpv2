import { Outlet } from 'react-router-dom'
import { AppSidebar, MobileSidebar } from './AppSidebar'

export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 flex-shrink-0">
        <AppSidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="md:p-6 p-4 pt-16 md:pt-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
