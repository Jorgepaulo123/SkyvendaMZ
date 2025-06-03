import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { HomeContext } from '../../context/HomeContext'
import { AuthContext } from '../../context/AuthContext'
import { useContext, useEffect, useState } from 'react'
import api from '../../api/api'
import { CardSkeleton } from '@/components/ui/CardSkeleton'

export default function MobileMenu() {
  const { user,logout,isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()
  const {myproducts,myorders,addOrders,addProducts} = useContext(HomeContext)
  const [isProfileExpanded, setIsProfileExpanded] = useState(false)
  const { token } = useContext(AuthContext)
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [orderCount, setOrderCount] = useState(0)
  const [productCount, setProductCount] = useState(0)
  const [nhonguistas, setNhonguistas] = useState([])
  const [loadingNhonguistas, setLoadingNhonguistas] = useState(false)

  useEffect(() => {
    if (!myorders?.length && token) {
      setLoadingOrders(true);
      api.get('/pedidos/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        addOrders(res.data);
        setOrderCount(res.data.length);
      })
      .catch((err) => {
        console.error(err.message);
      })
      .finally(() => {
        setLoadingOrders(false);
      });
    } else {
      setOrderCount(myorders?.length || 0);
    }

    if (!myproducts?.length && token) {
      setLoadingProducts(true);
      api.get(`produtos/produtos/?skip=0&limit=20`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const produtos = Array.isArray(res.data.produtos) ? res.data.produtos : [];
        addProducts(produtos);
        setProductCount(produtos.length);
      })
      .catch((err) => {
        console.error('Erro ao buscar produtos:', err);
      })
      .finally(() => {
        setLoadingProducts(false);
      });
    } else {
      setProductCount(myproducts?.length || 0);
    }
    
    // Buscar nhonguistas e lojas
    setLoadingNhonguistas(true);
    if (user?.id_unico) {
      api.get(`usuario/usuarios/lojas?skip=0&limit=5&identificador_unico=${user?.id_unico}`)
        .then(res => {
          setNhonguistas(res.data.usuarios || []);
        })
        .catch(err => {
          console.error('Erro ao buscar nhonguistas:', err.message);
        })
        .finally(() => {
          setLoadingNhonguistas(false);
        });
    } else {
      setLoadingNhonguistas(false);
    }
  }, [token, user?.id_unico]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-100 via-white to-red-50 max_z_index_2xl">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-red-50 shadow-sm">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-2 text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-700">Menu</h1>
        </div>
        <button className="p-2 text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      {/* Scrollable Content Container */}
      <div className="h-full pt-[72px] overflow-y-auto">
        <div className="p-4 space-y-4">
          {isAuthenticated ? (
            <>
              {/* Profile Section */}
              <div className="bg-white rounded-lg p-4 border border-gray-200 ">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={user?.perfil || 'https://via.placeholder.com/40'} 
                      alt="Foto de perfil" 
                      className="w-10 h-10 rounded-full object-cover border border-gray-200" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/40';
                      }}
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold">{user?.username}</span>
                      <span className="text-sm text-gray-500">{user?.email}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsProfileExpanded(!isProfileExpanded)}
                    className="p-2 rounded-full bg-gray-100 transition-transform duration-200"
                    style={{ transform: isProfileExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Expandable Menu */}
                {isProfileExpanded && (
                  <div className="mt-4 border-t pt-4 space-y-3">
                    <Link to="/profile" className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Ver meu perfil</span>
                    </Link>
                    <button 
                      onClick={() => logout()} 
                      className="flex items-center gap-3 p-2 w-full text-left hover:bg-gray-50 rounded-lg text-red-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Terminar sessão</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Nhonguistas e Lojas Section */}
              <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-700">Nhonguistas e Lojas</h2>
                  <Link to="/nhonguistas" className="text-sm text-indigo-600 hover:text-indigo-800">
                    Ver todos
                  </Link>
                </div>
                
                {loadingNhonguistas ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((_, index) => (
                      <div key={index} className="flex items-center gap-3 animate-pulse">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : nhonguistas.length > 0 ? (
                  <div className="space-y-4">
                    {nhonguistas.map((nhonguista) => (
                      <Link 
                        key={nhonguista.id} 
                        to={`/${nhonguista.username}`}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <img 
                          src={nhonguista.foto_perfil || 'https://via.placeholder.com/40'} 
                          alt={nhonguista.name} 
                          className="w-12 h-12 rounded-full object-cover border border-gray-200"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/40';
                          }}
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">{nhonguista.name}</h3>
                          <p className="text-sm text-gray-500">@{nhonguista.username}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center text-amber-500">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                            <span className="text-sm ml-1">{nhonguista.avaliacao_media || '0.0'}</span>
                          </div>
                          <span className="text-xs text-gray-500">{nhonguista.seguidores || 0} seguidores</span>
                        </div>
                      </Link>
                    ))}
                    <Link 
                      to="/nhonguistas" 
                      className="block w-full text-center py-2 text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Ver mais nhonguistas
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-gray-500">Nenhum nhonguista encontrado</p>
                    <Link to="/nhonguistas" className="mt-2 inline-block text-indigo-600 hover:text-indigo-800 font-medium">
                      Explorar nhonguistas
                    </Link>
                  </div>
                )}
              </div>

              {/* Menu Items Grid */}
              <div className="grid grid-cols-2 gap-4">
                {loadingProducts ? (
                  <CardSkeleton />
                ) : (
                  <Link 
                    to="/produtos" 
                    className="bg-indigo-50 rounded-lg p-4 border border-indigo-200  flex-col text-center transition-all active:scale-95 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <h1 className="text-2xl font-bold text-blue-600">{productCount}</h1>
                    <span className="text-sm text-gray-600">Produtos</span>
                  </Link>
                )}
                
                {loadingOrders ? (
                  <CardSkeleton />
                ) : (
                  <Link 
                    to="/pedidos" 
                    className="bg-pink-50 rounded-lg p-4 border border-pink-200  flex-col justify-center items-center text-center transition-all active:scale-95 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <h1 className="text-2xl font-bold text-pink-600">{orderCount}</h1>
                    <span className="text-sm text-gray-600">Pedidos</span>
                  </Link>
                )}

                <Link 
                  to="/mensagens" 
                  className="bg-green-50 rounded-lg p-4 border border-green-200  flex-col justify-center items-center text-center transition-all active:scale-95 hover:-translate-y-1 hover:shadow-xl"
                >
                  <h1 className="text-2xl font-bold text-green-600">0</h1>
                  <span className="text-sm text-gray-600">Mensagens</span>
                </Link>

                <Link 
                  to="/amigos" 
                  className="bg-purple-50 rounded-lg p-4 border border-purple-200  flex-col justify-center items-center text-center transition-all active:scale-95 hover:-translate-y-1 hover:shadow-xl"
                >
                  <h1 className="text-2xl font-bold text-purple-600">0</h1>
                  <span className="text-sm text-gray-600">Amigos</span>
                </Link>
              </div>

              {/* Navigation Section */}
              <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-3">
                <h2 className="font-semibold text-gray-700">Navegação</h2>
                <div className="space-y-2">
                  <Link 
                    to="/" 
                    className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border-gray-200 border flex items-center justify-between w-full transition-all hover:bg-white/90"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span className="text-gray-700">Página Inicial</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>

                  <Link 
                    to="/produtos" 
                    className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border-gray-200 border flex items-center justify-between w-full transition-all hover:bg-white/90"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <span className="text-gray-700">Meus Produtos</span>
                    </div>
                    <div className="flex items-center">
                      {loadingProducts ? (
                        <div className="w-5 h-5 border-2 border-gray-300 border-t-indigo-500 rounded-full animate-spin"></div>
                      ) : (
                        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {productCount}
                        </span>
                      )}
                      <svg className="w-5 h-5 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>

                  <Link 
                    to="/pedidos" 
                    className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border-gray-200 border flex items-center justify-between w-full transition-all hover:bg-white/90"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      <span className="text-gray-700">Meus Pedidos</span>
                    </div>
                    <div className="flex items-center">
                      {loadingOrders ? (
                        <div className="w-5 h-5 border-2 border-gray-300 border-t-indigo-500 rounded-full animate-spin"></div>
                      ) : (
                        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {orderCount}
                        </span>
                      )}
                      <svg className="w-5 h-5 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>

                  <Link 
                    to="/ads" 
                    className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border-gray-200 border flex items-center justify-between w-full transition-all hover:bg-white/90"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                      </svg>
                      <span className="text-gray-700">Meus Anúncios</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>

                  <Link 
                    to="/posts" 
                    className="bg-blue-50 backdrop-blur-sm rounded-lg p-4 border-blue-200 border flex items-center justify-between w-full transition-all hover:bg-blue-100"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                      <span className="text-blue-700 font-medium">Publicações</span>
                    </div>
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>

                  <Link 
                    to="/nhonguistas" 
                    className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border-gray-200 border flex items-center justify-between w-full transition-all hover:bg-white/90"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span className="text-gray-700">Nhonguistas</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>

                  <Link 
                    to="/wallet" 
                    className="bg-blue-50 backdrop-blur-sm rounded-lg p-4 border-blue-200 border flex items-center justify-between w-full transition-all hover:bg-blue-100"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <span className="text-blue-700 font-medium">SkyWallet</span>
                    </div>
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>

                  <Link 
                    to="/skai" 
                    className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border-gray-200 border flex items-center justify-between w-full transition-all hover:bg-white/90"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-700">Assistente SkAI</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>

                  <Link 
                    to="/overview" 
                    className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border-gray-200 border flex items-center justify-between w-full transition-all hover:bg-white/90"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span className="text-gray-700">Visão Geral</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Settings Section */}
              <div className="space-y-4">
                <h3 className="text-gray-700 font-medium px-1">Configurações</h3>
                <div className="space-y-2">
                  <Link 
                    to="/settings" 
                    className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border-gray-200 border flex items-center justify-between w-full transition-all hover:bg-white/90"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-700">Configurações</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>

                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border-gray-200 border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                      <span className="text-gray-700">Modo Escuro</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <Link 
                    to="/languages" 
                    className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border-gray-200 border flex items-center justify-between w-full transition-all hover:bg-white/90"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                      </svg>
                      <span className="text-gray-700">Idiomas</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>

                  <Link 
                    to="/notifications" 
                    className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border-gray-200 border flex items-center justify-between w-full transition-all hover:bg-white/90"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      <span className="text-gray-700">Notificações</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>

                  <Link 
                    to="/help" 
                    className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border-gray-200 border flex items-center justify-between w-full transition-all hover:bg-white/90"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-700">Ajuda</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-4">
              <Link
                to="/login"
                className="bg-indigo-500 text-white rounded-lg p-4 flex items-center justify-center font-medium transition-all active:scale-95 hover:opacity-90"
              >
                Fazer Login
              </Link>
              <Link
                to="/signup"
                className="bg-white/80 backdrop-blur-sm text-indigo-600 border border-indigo-600 rounded-lg p-4 flex items-center justify-center font-medium transition-all active:scale-95 hover:bg-white/90"
              >
                Criar Conta
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
