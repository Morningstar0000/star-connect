// src/components/DashboardHeader.jsx
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { LogOut, Settings, LayoutDashboard, User2, LayoutDashboardIcon, Globe } from 'lucide-react'

export default function DashboardHeader() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <img
                src="/starconnect-logo.png"
                alt="starconnect"
                className="w-10 h-10 object-contain"
              />
             
            </div>
            
            {/* Dashboard Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-foreground/70 hover:text-foreground transition"
              >
                Dashboard
              </button>
              {/* <button
                onClick={() => navigate('/dashboard/bookings')}
                className="text-foreground/70 hover:text-foreground transition"
              >
                My Bookings
              </button> */}
              <button
                onClick={() => navigate('/browse')}
                className="text-foreground/70 hover:text-foreground transition"
              >
                Browse Celebrities
              </button>
            </nav>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-primary">
                    {user?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm hidden sm:inline">
                    {user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User'}
                  </span>
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-56 bg-card border border-border rounded-lg shadow-lg p-2 z-50"
                  align="end"
                  sideOffset={5}
                >
                     <DropdownMenu.Item
                    onClick={() => navigate('/dashboard')}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-muted rounded transition outline-none flex items-center gap-2"
                  >
                    <LayoutDashboardIcon className="w-4 h-4" />
                    Dashboard
                  </DropdownMenu.Item>

                  <DropdownMenu.Item
                    onClick={() => navigate('/dashboard/profile')}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-muted rounded transition outline-none flex items-center gap-2"
                  >
                    <User2 className="w-4 h-4" />
                    Profile
                  </DropdownMenu.Item>

                   <DropdownMenu.Item
                    onClick={() => navigate('/browse')}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-muted rounded transition outline-none flex items-center gap-2"
                  >
                    <Globe className="w-4 h-4" />
                    Browse celebrities
                  </DropdownMenu.Item>

                  <DropdownMenu.Item
                    onClick={() => navigate('/dashboard/settings')}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-muted rounded transition outline-none flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </DropdownMenu.Item>

                  <DropdownMenu.Separator className="my-1 h-px bg-border" />
                  <DropdownMenu.Item
                    onClick={handleLogout}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-destructive hover:text-destructive-foreground rounded transition outline-none flex items-center gap-2 text-destructive"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>
      </div>
    </header>
  )
}