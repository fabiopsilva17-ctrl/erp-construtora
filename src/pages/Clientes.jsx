import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, Trash2, Edit } from 'lucide-react'
import Modal from '../components/Modal'

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({
    tipo: 'Pessoa Física',
    nome: '',
    documento: '',
    telefone: '',
    email: '',
    endereco: ''
  })

  useEffect(() => {
    carregarClientes()
  }, [])

  const carregarClientes = async () => {
    try {
      const { data, error } = await supabase.from('clientes').select('*').order('created_at', { ascending: false })
      if (error) throw error
      setClientes(data || [])
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
    } finally {
      setCarregando(false)
    }
  }

  const salvarCliente = async (e) => {
    e.preventDefault()
    try {
      if (editando) {
        const { error } = await supabase.from('clientes').update(form).eq('id', editando.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('clientes').insert([form])
        if (error) throw error
      }
      setForm({ tipo: 'Pessoa Física', nome: '', documento: '', telefone: '', email: '', endereco: '' })
      setEditando(null)
      setShowModal(false)
      carregarClientes()
    } catch (error) {
      console.error('Erro ao salvar cliente:', error)
    }
  }

  const deletarCliente = async (id) => {
    if (confirm('Tem certeza que deseja deletar este cliente?')) {
      try {
        const { error } = await supabase.from('clientes').delete().eq('id', id)
        if (error) throw error
        carregarClientes()
      } catch (error) {
        console.error('Erro ao deletar cliente:', error)
      }
    }
  }

  const abrirModal = (cliente = null) => {
    if (cliente) {
      setEditando(cliente)
      setForm(cliente)
    } else {
      setEditando(null)
      setForm({ tipo: 'Pessoa Física', nome: '', documento: '', telefone: '', email: '', endereco: '' })
    }
    setShowModal(true)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Clientes</h1>
          <p className="text-gray-600 mt-2">Gestão de clientes e contratos</p>
        </div>
        <button
          onClick={() => abrirModal()}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-2xl hover:opacity-90 transition"
        >
          <Plus size={20} /> Novo Cliente
        </button>
      </div>

      {carregando ? (
        <div className="text-center py-12">Carregando...</div>
      ) : clientes.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-lg">Nenhum cliente cadastrado</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Nome</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Tipo</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Documento</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Telefone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {clientes.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium">{cliente.nome}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{cliente.tipo}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{cliente.documento}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{cliente.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{cliente.telefone}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => abrirModal(cliente)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => deletarCliente(cliente.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <Modal title={editando ? 'Editar Cliente' : 'Novo Cliente'} onClose={() => setShowModal(false)}>
          <form onSubmit={salvarCliente} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tipo</label>
                <select
                  value={form.tipo}
                  onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                >
                  <option>Pessoa Física</option>
                  <option>Pessoa Jurídica</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Documento</label>
                <input
                  type="text"
                  value={form.documento}
                  onChange={(e) => setForm({ ...form, documento: e.target.value })}
                  placeholder="CPF/CNPJ"
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <input
                type="text"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Nome completo"
                required
                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Telefone</label>
                <input
                  type="tel"
                  value={form.telefone}
                  onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                  placeholder="(11) 99999-9999"
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Endereço</label>
              <textarea
                value={form.endereco}
                onChange={(e) => setForm({ ...form, endereco: e.target.value })}
                placeholder="Rua, número, cidade"
                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black h-24 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:opacity-90 transition"
              >
                {editando ? 'Atualizar' : 'Criar'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
