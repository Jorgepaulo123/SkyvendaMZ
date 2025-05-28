import { Bell, Home, Menu, MessageCircle, PlusIcon, Search, ShoppingCart } from 'lucide-react'
import React, { useRef, useState, useContext,useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { FaPlus, FaShopify } from 'react-icons/fa'
import { FiSearch, FiShoppingCart, FiUser } from 'react-icons/fi'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext, useAuth } from '../../context/AuthContext'
import PublishProductCard from '../PublishProduct'
import { HomeContext } from '../../context/HomeContext'
import { useWebSocket } from '../../context/websoketContext'
export default function Header() {
    const [cat, setCat] = useState('')
    const [search, setSearch] = useState('')
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [showPostDialog,setShowPostDialog]= useState(false);
    const {newMessage,setNewMessage,newNotification,setNewNotification}=useWebSocket()
    const {isAuthenticated}=useAuth()
    const navigate = useNavigate();
    const location = useLocation();
    const isActiveRoute = (path) => location.pathname === path;
    return (
        <>
            {/* header desktop */}
            <div className="w-full py-3  top-0 bg-white hidden md:block max_z_index_xl shadow-sm ">
                <div className="container mx-auto flex justify-between">
                    <Link to={'/'} className="flex items-center gap-2 lg:min-w-[300px] ">
                        <FaShopify className='text-[#7a4fed]' size={40} />
                        <h1 className='text-gray-600 font-bold text-lg'>SkyVenda MZ</h1>
                    </Link>
                    {/* O input e select */}
                    <div className="flex items-center space-x-2 border rounded-full px-4 lg:w-[600px] md:w-[00px] py-1">
                        <Select value={cat} onValueChange={(value) => setCat(value)}
                         onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                setIsSearchOpen(false)
                                navigate(`/search?q=${search}`)
                            }
                            }} >
                            <SelectTrigger className="border-none shadow-none focus:ring-0 focus:outline-none max-w-[200px]">
                                <SelectValue placeholder="Todas categorias" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="eletronicas">Eletrônicas</SelectItem>
                                <SelectItem value="veiculos">Veículos</SelectItem>
                                <SelectItem value="imoveis">Imóveis</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="w-[1px] h-[26px] bg-gray-300" />

                        <input
                            value={search}
                            className="border-none shadow-none focus:ring-0 focus:outline-none outline-none focus:border-transparent flex-1"
                            onChange={(e) => setSearch(e.target.value)}
                            type="text"
                            placeholder="Casas à venda"
                        />
                        <div className="h-[27px]">
                            <Search className='text-gray-600 hover:text-indigo-500' onClick={()=>{
                                navigate(`/search?q=${search}`)
                            }} />
                        </div>


                    </div>
                    {/* O input e select */}

                    {/* outros */}
                    <div className="flex lg:min-w-[300px] items-center gap-5">
                        <div className="flex gap-2 bg-[#7a4fed] rounded-full px-3 py-2 text-white font-bold hover:bg-indigo-600 " 
                        onClick={()=>{
                            if(isAuthenticated){
                                setShowPostDialog(true)
                            }else{
                                navigate('/login')
                            }
                        }}>
                            <PlusIcon />
                            <span>postar</span>
                        </div>

                        <div className="flex justify-between flex-1">
                            <Link  to='/chat' className="relative  h-[30px] flex items-center justify-center">
                                <MessageCircle size={30} className='text-gray-700  hover:text-indigo-600' />
                                <div className="bg-red-500 text-white text-xs rounded-full absolute justify-center -top-0 -right-1 w-[15px] h-[15px] flex items-center">
                                    {newMessage != 0 && (<span>{newMessage}</span>)}
                                </div>
                            </Link>

                            <div className="relative  h-[30px] flex items-center justify-center">
                                <Bell size={30} className='text-gray-700  hover:text-indigo-600' />
                                <div className="bg-red-500 text-white text-xs rounded-full absolute justify-center -top-0 -right-1 w-[15px] h-[15px] flex items-center">
                                    {newNotification != 0 && (<span>{newNotification}</span>)}
                                </div>
                            </div>

                            <div className="relative  h-[30px] flex items-center justify-center">
                                <ShoppingCart size={30} className='text-gray-700  hover:text-indigo-600' />
                                <div className="bg-red-500 text-white text-xs rounded-full absolute justify-center -top-0 -right-1 w-[15px] h-[15px] flex items-center">
                                    <span>1</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* fim outros  */}
                </div>
            </div>

            {/* Mobile Header */}
            <div className="md:hidden max_z_index px-4 border-b  border-gray-300 shadow-sm top-0 z-50 bg-gradient-to-r backdrop:blur-md from-pink-50 to-red-50">
                {/* Top Row */}
                <div className="flex justify-between items-center py-4">
                    <Link
                        to={'/'}
                        className="text-xl font-bold text-[#7a4fed] font-sans flex gap-1 items-center"
                    >
                        <FaShopify size={30}/>
                        <span>SkyVenda MZ</span>
                    </Link>
                    <div className="flex items-center">
                        <button onClick={() => setShowPostDialog(true)} className="text-gray-600 mr-4 bg-gradient-to-r from-pink-100 to-red-100 p-2 rounded-full">
                            <FaPlus size={24} />
                        </button>
                        <button onClick={() => navigate('/m/search')} className="text-gray-600 mr-4 bg-gradient-to-r from-pink-100 to-red-100 p-2 rounded-full">
                            <FiSearch size={24} />
                        </button>
                        <button
                            onClick={() => navigate('/menu')}
                            className="text-gray-600 relative  bg-gradient-to-r from-pink-100 to-red-100 p-2 rounded-full"
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>

                {/* Search Bar (conditionally rendered) */}
                {isSearchOpen == true && (
                    <div className="py-2">
                        <input
                            type="text"
                            placeholder="Pesquisar produtos..."
                            className="w-full py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                                setShowSuggestions(true)

                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    setIsSearchOpen(false)
                                    navigate(`/search?q=${searchTerm}`)
                                }
                            }}
                        />
                    </div>
                )}

                {/* Bottom Row */}
                <div className="flex justify-between items-center py-2 pb-4">
                    <button
                        onClick={() => navigate('/')}
                        className={`text-gray-600 ${isActiveRoute('/') ? 'text-indigo-600' : ''
                            }`}
                    >
                        <Home
                            size={30}
                            fill={isActiveRoute('/') ? 'currentColor' : 'none'}
                        />
                    </button>

                    <button
                        onClick={() => navigate('/chat')}
                        className={`text-gray-600 relative ${isActiveRoute('/chat') ? 'text-indigo-600' : ''
                            }`}
                    >
                        <Link to={'/chat'} className="relative ">
                            <MessageCircle
                                size={30}
                                fill={isActiveRoute('/chat') ? 'currentColor' : 'none'}
                            />
                            <span className="absolute -top-1 -right-2 bg-red-500
                 text-white text-xs rounded-full min-w-[18px] max-w-[20px] h-[18px] flex items-center justify-center">
                                +9
                            </span>
                        </Link>
                    </button>

                    <button
                        onClick={() => navigate('/friends')}
                        className={`text-gray-600 ${isActiveRoute('/friends') ? 'text-indigo-600' : ''
                            }`}
                    >
                        <FiUser
                            size={30}
                        />
                    </button>

                    <button
                        onClick={() => navigate('/notifications')}
                        className={`text-gray-600 relative ${isActiveRoute('/notifications') ? 'text-indigo-600' : ''
                            }`}
                    >
                        <div className="relative ">
                            <Bell
                                size={30}
                                fill={isActiveRoute('/notifications') ? 'currentColor' : 'none'}
                            />
                            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-[18px] h-[18px] flex items-center justify-center">
                            <span>{newNotification !=0 && newNotification}</span>
                            </span>
                        </div>
                    </button>

                    <button
                        onClick={() => navigate('/menu')}
                        className="text-gray-600 relative  mr-2"
                    >
                        <FiShoppingCart size={30} />
                        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-[16px] h-[16px] flex items-center justify-center">
                            3
                        </span>
                    </button>
                </div>
            </div>
            
            {/* end mobile header */}
            <PublishProductCard 
                isOpen={showPostDialog}
                onClose={() => setShowPostDialog(false)}
            />
        </>
    )
}
