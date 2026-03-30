// src/components/Header.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useState } from 'react';
import { LogOut, Settings, LayoutDashboard, User2, Menu, X } from 'lucide-react';

export default function Header() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if we're on a dashboard route
  const isDashboardRoute = location.pathname.startsWith('/dashboard') || 
                           location.pathname.startsWith('/booking') ||
                           location.pathname.startsWith('/video-call');

  // Don't show the public header on dashboard routes
  if (isDashboardRoute) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
      // Emergency fallback
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About us' },
    { to: '/browse', label: 'Browse' },
    { to: '/how-it-works', label: 'How It Works' },
  ];

  // Don't show anything while loading to prevent flash
  if (loading) {
    return (
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/starconnect-logo.png"
                alt="starconnect"
                className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain"
              />
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
            <img
              src="/starconnect-logo.png"
              alt="starconnect"
              className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-foreground/70 hover:text-foreground transition"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-foreground/70 hover:text-foreground transition hidden sm:inline"
                >
                  Dashboard
                </Link>

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
                        <LayoutDashboard className="w-4 h-4" />
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
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition font-medium"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-3 md:hidden">
            {user && (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-primary">
                    {user?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
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
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </DropdownMenu.Item>
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
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-muted transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background py-4">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-foreground/70 hover:text-foreground hover:bg-muted rounded-lg transition"
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-foreground/70 hover:text-foreground hover:bg-muted rounded-lg transition"
                >
                  Dashboard
                </Link>
              )}
              {!user && (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition font-medium inline-block text-center"
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}