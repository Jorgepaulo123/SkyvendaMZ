import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import api from '../../api/api'
import { Users, Store, Star, MessageCircle, UserPlus, UserCheck } from 'lucide-react'

export default function Friends() {
  const [nhonguistas, setNhonguistas] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, token } = useContext(AuthContext)
  const [activeTab, setActiveTab] = useState('nhonguistas')

  useEffect(() => {
    fetchNhonguistas()
  }, [])

  const fetchNhonguistas = () => {
    setLoading(true)
    if (user?.id_unico) {
      api.get(`usuario/usuarios/lojas?skip=0&limit=20&identificador_unico=${user?.id_unico}`)
        .then(res => {
          setNhonguistas(res.data.usuarios || [])
        })
        .catch(err => {
          console.error('Erro ao buscar nhonguistas:', err.message)
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }

  const handleFollow = (nhonguistaId) => {
    if (!token) return

    api.post(`usuario/${nhonguistaId}/seguir`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(() => {
      // Atualiza a lista após seguir/deixar de seguir
      fetchNhonguistas()
    })
    .catch(err => {
      console.error('Erro ao seguir/deixar de seguir:', err)
    })
  }

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-800">Nhonguistas e Lojas</h1>
        <p className="text-sm text-gray-500">Encontre os melhores vendedores</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b bg-white sticky top-[73px] z-10">
        <button
          onClick={() => setActiveTab('nhonguistas')}
          className={`flex-1 py-3 text-center font-medium ${activeTab === 'nhonguistas' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
        >
          <div className="flex items-center justify-center gap-2">
            <Users size={18} />
            <span>Nhonguistas</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('lojas')}
          className={`flex-1 py-3 text-center font-medium ${activeTab === 'lojas' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
        >
          <div className="flex items-center justify-center gap-2">
            <Store size={18} />
            <span>Lojas</span>
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : nhonguistas.length > 0 ? (
          <div className="space-y-4">
            {nhonguistas
              .filter(n => activeTab === 'nhonguistas' ? !n.is_loja : n.is_loja)
              .map((nhonguista) => (
                <div key={nhonguista.id} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Link to={`/${nhonguista.username}`}>
                      <img 
                        src={nhonguista.foto_perfil || 'https://via.placeholder.com/64'} 
                        alt={nhonguista.name} 
                        className="w-16 h-16 rounded-full object-cover border border-gray-200"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/64';
                        }}
                      />
                    </Link>
                    <div className="flex-1">
                      <Link to={`/${nhonguista.username}`}>
                        <h3 className="font-medium text-gray-800 text-lg">{nhonguista.name}</h3>
                        <p className="text-sm text-gray-500">@{nhonguista.username}</p>
                      </Link>
                      <div className="flex items-center mt-1 text-amber-500">
                        <Star size={16} fill="currentColor" />
                        <span className="text-sm ml-1">{nhonguista.avaliacao_media || '0.0'}</span>
                        <span className="text-xs text-gray-500 ml-2">{nhonguista.seguidores || 0} seguidores</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link to={`/chat/${nhonguista.id}`} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                        <MessageCircle size={20} className="text-gray-600" />
                      </Link>
                      <button 
                        onClick={() => handleFollow(nhonguista.id)}
                        className={`p-2 rounded-full transition-colors ${nhonguista.segue_usuario ? 'bg-indigo-100 hover:bg-indigo-200' : 'bg-gray-100 hover:bg-gray-200'}`}
                      >
                        {nhonguista.segue_usuario ? (
                          <UserCheck size={20} className="text-indigo-600" />
                        ) : (
                          <UserPlus size={20} className="text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {activeTab === 'nhonguistas' ? (
                <Users size={32} className="text-gray-400" />
              ) : (
                <Store size={32} className="text-gray-400" />
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">
              {activeTab === 'nhonguistas' ? 'Nenhum nhonguista encontrado' : 'Nenhuma loja encontrada'}
            </h3>
            <p className="text-gray-500">Tente novamente mais tarde</p>
          </div>
        )}
      </div>
    </div>
  )
}
