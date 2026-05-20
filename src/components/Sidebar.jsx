import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { signOut } from '../lib/auth'
import { Home, Users, Building2, FileText, Truck, ShoppingCart, DollarSign, LogOut, Menu } from 'lucide-react'
import { useState } from 'react'

export default function Sidebar() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [open, setOpen] = useState(true)

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Clientes', path: '/clientes' },
    { icon: Building2, label: 'Obras', path: '/obras' },
    { icon: FileText, label: 'Orçamentos', path: '/orcamentos' },
    { icon: Truck, label: 'Fornecedores', path: '/fornecedores' },
    { icon: ShoppingCart, label: 'Compras', path: '/compras' },
    { icon: DollarSign, label: 'Financeiro', path: '/financeiro' }
  ]

  return (
    <div className={`${open ? 'w-64' : 'w-20'} bg-black text-white transition-all duration-300 flex flex-col h-screen`}>
      <div className="p-6 flex items-center justify-between border-b border-gray-700">
        {open && <h1 className="text-xl font-bold">ERP</h1>}
        <button
          onClick={() => setOpen(!open)}
          className="p-2 hover:bg-gray-800 rounded-lg transition"
        >
          <Menu size={20} />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition group"
          >
            <item.icon size={20} />
            {open && <span className="text-sm font-medium">{item.label}</span>}
            {!open && (
              <div className="absolute left-20 bg-gray-800 px-3 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
                {item.label}
              </div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700 space-y-3">
        {open && (
          <div className="text-xs text-gray-400">
            <p className="font-semibold text-white mb-1">{user?.email}</p>
            <p>Administrador</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition text-red-400 hover:text-red-300"
        >
          <LogOut size={20} />
          {open && <span className="text-sm font-medium">Sair</span>}
        </button>
      </div>
    </div>
  )
}
