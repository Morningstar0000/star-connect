// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import BrowsePage from './pages/BrowsePage'
import CelebrityDetailPage from './pages/CelebrityDetailPage'
import LoginPage from './pages/LoginPage'
import HowItWorksPage from './pages/HowitworkPage'
import BookingPage from './pages/BookingPage'
import PaymentProcessingPage from './components/PaymentProcessingPage'
import BookingReceivedPage from './pages/BookingReceivedPage'
import NotFoundPage from './pages/NotFoundPage'
import AboutPage from './pages/AboutPage'

// Dashboard imports
import DashboardLayout from './user/DashboardLayout'
import DashboardPage from './user/DashboardPage'
import DashboardProfilePage from './user/DashboardProfilePage'
import DashboardSettingsPage from './user/DashboardSettingsPage'
import DashboardBookingsPage from './user/DashboardBookingsPage'
import BookingDetailPage from './pages/BookingDetailPage'
import VideoCallPage from './pages/VideoCallPage'

// Admin imports
import AdminWrapper from './admin/AdminWrapper'
import AdminPage from './admin/AdminPage'
import AdminBookingsPage from './admin/AdminBookingsPage'
import AdminCelebritiesPage from './admin/AdminCelebritiesPage'
import AdminPaymentsPage from './admin/AdminPaymentsPage'
import AdminUsersPage from './admin/AdminUsersPage'
import AdminAnalyticsPage from './admin/AdminAnalyticsPage'
import AdminSettingsPage from './admin/AdminSettingsPage'
import CreateUserAccount from './admin/CreateUserAccount'
import AdminLoginPage from './admin/AdminLoginPage'

import MainLayout from './components/MainLayout'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { AuthProvider } from './context/AuthContext'

export default function App() {
  return (
    <Routes>
      {/* Public Routes with MainLayout */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/browse" element={<BrowsePage />} />
      <Route path="/celebrity/:id" element={<CelebrityDetailPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/book/:id" element={<BookingPage />} />
      <Route path="/payment-processing" element={<PaymentProcessingPage />} />
      <Route path="/booking-received" element={<BookingReceivedPage />} />

      {/* Dashboard Routes - Separate Layout */}
      <Route path="/dashboard" element={<DashboardLayout><DashboardPage /></DashboardLayout>} />
      <Route path="/dashboard/profile" element={<DashboardLayout><DashboardProfilePage /></DashboardLayout>} />
      <Route path="/dashboard/settings" element={<DashboardLayout><DashboardSettingsPage /></DashboardLayout>} />
      <Route path="/dashboard/bookings" element={<DashboardLayout><DashboardBookingsPage /></DashboardLayout>} />
      <Route path="/booking/:bookingId" element={<DashboardLayout><BookingDetailPage /></DashboardLayout>} />
      <Route path="/video-call/:callId" element={<DashboardLayout><VideoCallPage /></DashboardLayout>} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AuthProvider>
            <AdminWrapper />
          </AuthProvider>
        }
      >
        <Route index element={<AdminPage />} />
        <Route path="bookings" element={<AdminBookingsPage />} />
        <Route path="celebrities" element={<AdminCelebritiesPage />} />
        <Route path="payments" element={<AdminPaymentsPage />} />
        <Route path="create-account" element={<CreateUserAccount />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      <Route
        path="/admin-login"
        element={
          <AuthProvider>
            <AdminLoginPage />
          </AuthProvider>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />
    </Routes>
  )
}