import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function AdminSettingsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  if (!user || user.role !== 'admin') {
    navigate('/')
    return null
  }

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Admin Settings</h1>
        <div className="bg-card border border-border rounded-xl p-8">
          <p className="text-foreground/60">Settings coming soon...</p>
        </div>
      </div>
    </main>
  )
}
