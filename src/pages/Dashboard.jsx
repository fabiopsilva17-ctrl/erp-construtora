import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [stats, setStats] = useState({
    obrasAtivas: 0,
    clientesAtivos: 0,
    faturamentoMes: 0,
    margemOperacional: 0
  })
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      const [obrasRes, clientesRes] = await Promise.all([
        supabase.from('obras').select('id', { count: 'exact' }).eq('status', 'Em andamento'),
        supabase.from('clientes').select('id', { count: 'exact' })
      ])

      setStats({
        obrasAtivas: obrasRes.count || 0,
        clientesAtivos: clientesRes.count || 0,
        faturamentoMes: 487000,
        margemOperacional: 25.7
      })
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setCarregando(false)
    }
  }

  if (carregando) {
    return <div className="p-6 text-center">Carregando...</div>
  }

  const cards = [
    {
      title: 'Clientes',
      icon: '👥',
      count: stats.clientesAtivos,
      items: ['Pessoa Física/Jurídica', 'Contratos', 'Histórico']
    },
    {
      title: 'Obras',
      icon: '🏗️',
      count: stats.obrasAtivas,
      items: ['Cronograma', 'Status', 'Responsáveis']
    },
    {
      title: 'Orçamentos',
      icon: '📊',
      count: 0,
      items: ['BDI', 'Materiais', 'Margem']
    },
    {
      title: 'Fornecedores',
      icon: '🚚',
      count: 0,
      items: ['Contatos', 'Histórico', 'Avaliação']
    },
    {
      title: 'Compras',
      icon: '💳',
      count: 0,
      items: ['Pedidos', 'Cotações', 'Recebimento']
    },
    {
      title: 'Financeiro',
      icon: '💰',
      count: 0,
      items: ['A pagar', 'A receber', 'Fluxo de caixa']
    }
  ]

  return (
    <div className="p-6 space-y-8">
      <header className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="text-gray-600 mt-2 text-lg">Bem-vindo ao ERP Construtora</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border rounded-2xl p-4">
              <div className="text-sm text-blue-600 font-semibold">Obras Ativas</div>
              <div className="text-3xl font-bold text-blue-900 mt-1">{stats.obrasAtivas}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 border rounded-2xl p-4">
              <div className="text-sm text-green-600 font-semibold">Faturamento</div>
              <div className="text-2xl font-bold text-green-900 mt-1">R$ 487K</div>
            </div>
          </div>
        </div>
      </header>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Módulos do Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-md border border-gray-200 p-6 hover:shadow-xl transition cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{card.icon}</div>
                <div className="bg-gray-100 group-hover:bg-black group-hover:text-white text-gray-600 px-3 py-1 rounded-full text-sm font-semibold transition">
                  {card.count}
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">{card.title}</h3>
              <div className="space-y-2">
                {card.items.map((item, idx) => (
                  <div key={idx} className="text-sm text-gray-600 flex items-center">
                    <span className="mr-2">•</span> {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8">
        <h2 className="text-2xl font-bold mb-6">Indicadores Estratégicos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-black to-gray-800 text-white rounded-2xl p-6">
            <div className="text-sm opacity-70">Margem Operacional Média</div>
            <div className="text-4xl font-bold mt-2">{stats.margemOperacional}%</div>
            <div className="text-sm opacity-70 mt-2">Das obras em andamento</div>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-6">
            <div className="text-sm opacity-70">Total de Clientes</div>
            <div className="text-4xl font-bold mt-2">{stats.clientesAtivos}</div>
            <div className="text-sm opacity-70 mt-2">Cadastrados no sistema</div>
          </div>
        </div>
      </section>
    </div>
  )
}
