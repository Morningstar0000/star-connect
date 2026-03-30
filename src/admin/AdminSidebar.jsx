import { Link, useLocation } from 'react-router-dom'
import {
    LayoutDashboard,
    Calendar,
    Users,
    Star,
    CreditCard,
    Settings,
    ChevronLeft,
    ChevronRight,
    UserPlus,
    BarChart
} from 'lucide-react'

export default function AdminSidebar({ collapsed, setCollapsed }) {
    const location = useLocation()

    const menuItems = [
        { path: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
        { path: '/admin/bookings', icon: <Calendar className="w-5 h-5" />, label: 'Bookings' },
        { path: '/admin/celebrities', icon: <Star className="w-5 h-5" />, label: 'Celebrities' },
        { path: '/admin/create-account', icon: <UserPlus className="w-5 h-5" />, label: 'Create Users' },
        { path: '/admin/payments', icon: <CreditCard className="w-5 h-5" />, label: 'Payment Methods' },

        { path: '/admin/users', icon: <Users className="w-5 h-5" />, label: 'Users' },
        { path: '/admin/analytics', icon: <BarChart className="w-5 h-5" />, label: 'Analytics' },
        { path: '/admin/settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
    ]

    return (
        <div className="h-full flex flex-col">
            {/* Logo */}
            <div className="h-16 flex items-center px-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <div className="p-2 border-t border-gray-200">
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="w-full flex items-center justify-center p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                        </button>
                    </div>
                   
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${isActive
                                    ? 'bg-secondary text-primary'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {item.icon}
                            {!collapsed && <span className="text-sm">{item.label}</span>}
                        </Link>
                    )
                })}
            </nav>

            {/* Collapse Button */}

        </div>
    )
}