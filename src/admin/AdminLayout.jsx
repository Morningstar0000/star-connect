import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

export default function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="flex">
        {/* Sidebar */}
        <aside 
          className={`bg-white border-r border-gray-200 transition-all duration-300 ${
            sidebarCollapsed ? 'w-16' : 'w-64'
          }`}
        >
          <AdminSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        </aside>
        
        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 p-6`}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}