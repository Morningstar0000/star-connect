// src/components/DashboardLayout.jsx
import { SessionCheck } from '../components/SessionCheck'
import DashboardHeader from './DashboardHeader'


export default function DashboardLayout({ children }) {
  return (
    <SessionCheck>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main>{children}</main>
      </div>
    </SessionCheck>
  )
}