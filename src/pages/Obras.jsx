import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Plus } from 'lucide-react'

export default function Obras() {
  const [obras, setObras] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    carregarObras()
  }, [])

  const carregarObras = async () => {
    try {
      const { data, error } = await supabase.from('obras').select('*').order('created_at', { ascending: false })
      if (error) throw error
      setObras(data || [])
    } catch (error) {
      console.error('Erro ao carregar obras:', error)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Obras</h1>
          <p className="text-gray-600 mt-2">Controle operacional e gerenciamento</p>
        </div>
        <button className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-2xl hover:opacity-90 transition">
          <Plus size={20} /> Nova Obra
        </button>
      </div>

      {carregando ? (
        <div className="text-center py-12">Carregando...</div>
      ) : obras.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-lg">Nenhuma obra cadastrada</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {obras.map((obra) => (
            <div key={obra.id} className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-2">{obra.nome}</h3>
              <p className="text-gray-600 text-sm mb-4">{obra.endereco}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-semibold">{obra.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Custo previsto:</span>
                  <span className="font-semibold">R$ {obra.custo_previsto?.toLocaleString('pt-BR')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
