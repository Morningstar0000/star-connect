// src/admin/AdminWrapper.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from './AdminLayout';

export default function AdminWrapper() {
  const { user, isAdmin, loading } = useAuth();

  console.log('AdminWrapper - user:', user?.email, 'isAdmin:', isAdmin, 'loading:', loading)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    console.log('Not admin, redirecting to admin-login')
    return <Navigate to="/admin-login" replace />;
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}