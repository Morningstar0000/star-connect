// src/admin/AdminHeader.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Bell } from 'lucide-react';
import { useState } from 'react';

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [logoutError, setLogoutError] = useState('');

  const handleLogout = async () => {
    try {
      setLogoutError('');
      console.log('Logging out from admin header...');
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      setLogoutError('Failed to logout');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-6">
        <div className="flex justify-between items-center h-16">
          <Link to="/admin" className="flex items-center gap-2">
            <img
              src="/starconnect-logo.png"
              alt="StarConnect Admin"
              className="w-8 h-8 object-contain"
            />
            <span className="font-bold text-lg text-gray-900">Admin Portal</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/admin" className="text-gray-600 hover:text-secondary transition text-sm font-medium">
              Dashboard
            </Link>
            <Link to="/admin/bookings" className="text-gray-600 hover:text-secondary transition text-sm font-medium">
              Bookings
            </Link>
            <Link to="/admin/celebrities" className="text-gray-600 hover:text-secondary transition text-sm font-medium">
              Celebrities
            </Link>
            <Link to="/admin/users" className="text-gray-600 hover:text-secondary transition text-sm font-medium">
              Users
            </Link>
            <Link to="/admin/analytics" className="text-gray-600 hover:text-secondary transition text-sm font-medium">
              Analytics
            </Link>
            <Link to="/admin/settings" className="text-gray-600 hover:text-secondary transition text-sm font-medium">
              Settings
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {logoutError && (
              <div className="text-xs text-red-500">{logoutError}</div>
            )}
            
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary font-bold">
                {user?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-700">
                  {user?.full_name || 'Admin'}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}