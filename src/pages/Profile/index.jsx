import { ClipboardList, DotSquare, Eye, Grid, Heart, Info, Kanban, Loader, Megaphone, MessageCircle, MoreHorizontal, Settings, User2, UserCheck, UserPlus, Award, Package, Star, FileText, Users, Copy, Check, BadgeCheck } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWebSocket } from '../../context/websoketContext';
import api from '../../api/api';
import axios from 'axios';
import { HomeContext } from '../../context/HomeContext';
import { base_url } from '../../api/api';
import Pedidos from '../pedidos';
import toast from 'react-hot-toast';

export default function Profile() {
    const [hasProfile,setHasProfile]=useState(false);
    const [isMyProfile,setIsMyProfile]=useState(false);
    const [userProfile,setUserProfile]=useState("")
    const [tabSelected,setTabSelected]=useState('posts')
    const {user,token, activatePro}=useAuth()
    const { username } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [loading,setLoading]=useState(true)
    const { myproducts, addProducts } = useContext(HomeContext);
    const [products,setProducts]=useState([])
    const [loadingProducts,setLoadingproducts]=useState(true)
    const [isPublic,setIsPublic]=useState(false)
    const [publicacoes, setPublicacoes] = useState([])
    const [loadingPublicacoes, setLoadingPublicacoes] = useState(true)
    const [seguidores, setSeguidores] = useState([])
    const [loadingSeguidores, setLoadingSeguidores] = useState(true)
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [showTooltip, setShowTooltip] = useState(false);
    const [openAvatarMenu,setOpenAvatarMenu]=useState(false);
    const [fileImage, setFileImage] = useState(null);
    const [message, setMessage] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const [uploading,setUploading]=useState(false);
    const [followLoading, setFollowLoading] = useState(false); // Estado para controlar a animação do botão de seguir
    const [userRating, setUserRating] = useState({ media_estrelas: 0, total_avaliacoes: 0 });
    const [showSettings, setShowSettings] = useState(false);
    const [stats, setStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(false);
    const [copied, setCopied] = useState(false);
    const [proDays, setProDays] = useState(20);
    const [proLoading, setProLoading] = useState(false);
    
    // Hooks do WebSocket
    const { setChats, setSelectedUser, onlineUsers } = useWebSocket();
    
    // Função para abrir o chat com o usuário
    const handleOpenChat = (user) => {
        if (!user || !user.id) {
            toast.error('Não foi possível abrir o chat com este usuário');
            return;
        }
        
        // Criar um objeto de chat com as informações do usuário
        const chatUser = {
            id: user.id,
            nome: user.nome || user.name,
            username: user.username,
            foto: user.foto_perfil || user.perfil,
            mensagens: []
        };
        
        // Atualizar o estado do chat no contexto do WebSocket
        setSelectedUser(chatUser);
        
        // Adicionar o chat à lista de chats se ainda não existir
        setChats(prevChats => {
            // Verificar se já existe um chat com este usuário
            const existingChatIndex = prevChats.findIndex(chat => String(chat.id) === String(user.id));
            
            if (existingChatIndex !== -1) {
                // Se já existe, colocar no topo da lista
                const existingChat = prevChats[existingChatIndex];
                const updatedChats = prevChats.filter((_, i) => i !== existingChatIndex);
                return [existingChat, ...updatedChats];
            } else {
                // Se não existe, adicionar ao topo da lista
                return [chatUser, ...prevChats];
            }
        });
        
        // Navegar para a página de chat
        navigate('/chat');
        toast.success(`Abrindo chat com ${user.username}`);
    };

    const handleMouseMove = (e) => {
        setTooltipPosition({
        x: e.clientX + 10, // Offset by 10px to not overlap with cursor
        y: e.clientY + 10
        });
    };
  
    
    useEffect(()=>{
        // Scroll to top when component mounts
        window.scrollTo(0, 0);
        
        // Resetar estados ao mudar de perfil
        setLoading(true);
        setLoadingproducts(true);
        setHasProfile(false);
        setIsMyProfile(false);
        setIsPublic(false);
        setProducts([]);
        
        // Função para carregar o perfil
        const carregarPerfil = async () => {
            try {
                // Verificar se é o próprio perfil do usuário
                if (user && user.username === username) {
                    console.log('Carregando perfil próprio:', username);
                    setIsMyProfile(true);
                    setHasProfile(true);
                    setUserProfile(user);
                    
                    // Carregar produtos do usuário
                    try {
                        const response = await api.get(`/usuario/${username}/produtos`);
                        if (response.data && response.data.produtos) {
                            setProducts(response.data.produtos);
                        }
                    } catch (error) {
                        console.error('Erro ao carregar produtos:', error);
                    }
                } else {
                    // Carregar perfil de outro usuário
                    console.log('Carregando perfil de outro usuário:', username);
                    try {
                        // Usar o endpoint correto para perfil de usuário
                        const headers = token ? { Authorization: `Bearer ${token}` } : {};
                        
                        // Fazendo uma chamada direta para garantir que funcione
                        const response = await api.get(`/usuario/perfil/user/${username}`, {
                            headers: token ? { Authorization: `Bearer ${token}` } : {}
                        });
                        
                        console.log('Resposta do perfil:', response.data);
                        
                        setIsMyProfile(false);
                        setHasProfile(true);
                        setUserProfile(response.data);
                        setIsPublic(true);
                        
                        // Os produtos já vêm na resposta da API
                        if (response.data.produtos) {
                            setProducts(response.data.produtos);
                        }
                        
                        // Buscar avaliações do usuário
                        if (response.data.id) {
                            try {
                                const ratingResponse = await api.get(`/usuario/usuarios/${response.data.id}/avaliacoes/`, {
                                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                                });
                                console.log('Avaliações do usuário:', ratingResponse.data);
                                setUserRating({
                                    media_estrelas: ratingResponse.data.media_estrelas || 0,
                                    total_avaliacoes: ratingResponse.data.total_avaliacoes || 0
                                });
                                
                                // Buscar publicações do usuário
                                try {
                                    const publicacoesResponse = await api.get(`/usuario/publicacoes/?usuario_id=${response.data.id}&page=1&per_page=10`, {
                                        headers: token ? { Authorization: `Bearer ${token}` } : {}
                                    });
                                    console.log('Publicações do usuário:', publicacoesResponse.data);
                                    setPublicacoes(publicacoesResponse.data.items || []);
                                } catch (error) {
                                    console.error('Erro ao buscar publicações do usuário:', error);
                                } finally {
                                    setLoadingPublicacoes(false);
                                }
                                
                                // Buscar seguidores do usuário
                                try {
                                    const seguidoresResponse = await api.get(`/usuario/usuarios/${response.data.id}/seguindo`, {
                                        headers: token ? { Authorization: `Bearer ${token}` } : {}
                                    });
                                    console.log('Seguidores do usuário:', seguidoresResponse.data);
                                    setSeguidores(seguidoresResponse.data.seguindo || []);
                                } catch (error) {
                                    console.error('Erro ao buscar seguidores do usuário:', error);
                                } finally {
                                    setLoadingSeguidores(false);
                                }
                            } catch (error) {
                                console.error('Erro ao buscar avaliações do usuário:', error);
                            }
                        }
                    } catch (error) {
                        console.error('Erro ao carregar perfil de usuário:', error);
                        setHasProfile(false);
                    }
                }
            } catch (error) {
                console.error('Erro ao carregar perfil:', error);
                setHasProfile(false);
            } finally {
                setLoading(false);
                setLoadingproducts(false);
            }
        };
        
        if (username) {
            carregarPerfil();
        }
        
        // Definir a imagem de perfil para pré-visualização
        if (user?.perfil) {
            setPreviewImage(user.perfil);
        }
    }, [username, user, token])

    // Removido o useEffect redundante para carregar produtos, pois já está sendo feito no useEffect principal

    useEffect(()=>{
        setTabSelected(location.pathname)

    },[location])
    
    useEffect(() => {
        if (!token && myproducts) return;
        if(myproducts?.length>=1){
          setLoadingproducts(false)
        }else{
          api.get(`/produtos/produtos/?skip=0&limit=20`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            addProducts(Array.isArray(res.data.produtos) ? res.data.produtos : []);
            console.log(res.data)
          })
          .catch((err) => {
            console.error('Erro ao buscar produtos:', err);
            addProducts([]);
          })
          .finally(() => setLoadingproducts(false));
        }
    
        
    }, [token]);


    const AvatarMenu=()=>{
        return (
        <div className="flex justify-center items-center w-full h-[100vh] z-[99999999999] bg-black/40 fixed top-0 left-0">
            <div className="w-[450px] bg-white rounded-xl flex flex-col">
                <div className="flex flex-col items-center gap-1 border-b py-4 flex-1">
                    <img 
                        src={previewImage} 
                        className='w-[60px] h-[60px] rounded-full border'
                        />
                    <span>{userProfile.name}</span>
                    <span className='text-gray-400 text-xs'>usuario da skyvenda mz</span>
                </div>
                <div className="flex items-center justify-center p-4 font-bold text-indigo-400 border-b cursor-pointer">
                    <label className="cursor-pointer">
                        Carregar foto
                        <input type="file" accept="image/*" className="hidden" 
                        onChange={(e) => {
                            const file = e.target.files[0]; // Pegando o arquivo diretamente
                            setFileImage(file);
                            setPreviewImage(URL.createObjectURL(file));
                            setOpenAvatarMenu(false);
                            setUploading(true);
                        
                            const formData = new FormData();
                            const token = localStorage.getItem('auth_token');
                            formData.append('file', file); // Usando o arquivo diretamente
                        
                            api.put('/info_usuario/perfil', formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                    'Authorization': `Bearer ${token}`,
                                    'accept': 'application/json',
                                },
                            })
                            .then(res => {
                                setMessage('Imagem atualizada com sucesso!');
                                setFileImage(null);
                            })
                            .catch(err => {
                                setMessage('Erro ao atualizar a imagem. Tente novamente.');
                                console.error(err);
                            })
                            .finally(() => {
                                setUploading(false);
                            });
                        }}
                        />
                    </label>
                </div>
                <div className="flex items-center justify-center p-4  text-gray-600 relative border-b">
                    Adicionar uma mensagem
                </div>
                <div className="flex items-center justify-center p-4 font-bold text-red-400 border-b">
                    Remover a foto atual
                </div>
                <div className="flex items-center justify-center p-4 text-gray-600 " onClick={()=>setOpenAvatarMenu(false)}>
                    Cancer
                </div>

            </div>
        </div>
    )}


    const openSettings = async () => {
        if (!token) {
            toast.error('Faça login para ver suas estatísticas');
            return;
        }
        setShowSettings(true);
        setCopied(false);
        setLoadingStats(true);
        try {
            const res = await api.get('/usuario/me/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(res.data);
        } catch (err) {
            console.error('Erro ao buscar estatísticas básicas:', err);
            if (err?.response?.status === 401) {
                toast.error('Sessão expirada. Faça login novamente.');
            } else {
                toast.error('Não foi possível carregar as estatísticas');
            }
        } finally {
            setLoadingStats(false);
        }
    };

    const SettingsModal = () => (
        <div className="flex justify-center items-center w-full h-[100vh] z-[99999999999] bg-black/40 fixed top-0 left-0">
            <div className="w-[480px] max-w-[95vw] bg-white rounded-xl shadow-lg">
                <div className="px-5 py-4 border-b flex items-center justify-between">
                    <h3 className="font-semibold">Definições</h3>
                    <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>
                <div className="p-5 space-y-6">
                    <div>
                        <label className="text-sm text-gray-600">Seu link de referência</label>
                        <div className="mt-1 flex items-center gap-2">
                            <input
                                className="flex-1 border rounded-md px-3 py-2 text-sm"
                                readOnly
                                value={stats?.referral_link || ''}
                            />
                            <button
                                onClick={async () => {
                                    try {
                                        await navigator.clipboard.writeText(stats?.referral_link || '');
                                        setCopied(true);
                                        toast.success('Link copiado');
                                    } catch (e) {
                                        toast.error('Falha ao copiar');
                                    }
                                }}
                                className="inline-flex items-center gap-1 bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-md text-sm"
                            >
                                {copied ? <Check className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}
                                {copied ? 'Copiado' : 'Copiar'}
                            </button>
                        </div>
                        {stats?.referral_code && (
                            <p className="text-xs text-gray-500 mt-1">Código: {stats.referral_code}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                        <div className="border rounded-md p-3 text-center">
                            <p className="text-xs text-gray-500">Seguidores</p>
                            <p className="text-xl font-semibold">{stats?.total_seguidores ?? userProfile?.total_seguidores ?? 0}</p>
                        </div>
                        <div className="border rounded-md p-3 text-center">
                            <p className="text-xs text-gray-500">A seguir</p>
                            <p className="text-xl font-semibold">{stats?.total_seguindo ?? userProfile?.total_seguindo ?? 0}</p>
                        </div>
                        <div className="border rounded-md p-3 text-center">
                            <p className="text-xs text-gray-500">Produtos</p>
                            <p className="text-xl font-semibold">{stats?.total_produtos ?? userProfile?.total_produtos ?? 0}</p>
                        </div>
                        <div className="border rounded-md p-3 text-center">
                            <p className="text-xs text-gray-500">Referências</p>
                            <p className="text-xl font-semibold">{stats?.total_referencias ?? 0}</p>
                        </div>
                    </div>

                    {/* Ativação da Conta PRO */}
                    <div className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold flex items-center gap-2">Conta PRO { (userProfile?.pro || userProfile?.is_pro || userProfile?.conta_pro) && <BadgeCheck className="w-5 h-5 text-sky-500"/> }</h4>
                            {(userProfile?.pro || userProfile?.is_pro || userProfile?.conta_pro) ? (
                                <span className="text-sm text-green-600 font-medium">Ativa</span>
                            ) : (
                                <span className="text-sm text-gray-500">Inativa</span>
                            )}
                        </div>
                        {!(userProfile?.pro || userProfile?.is_pro || userProfile?.conta_pro) && isMyProfile && (
                            <div className="mt-3 space-y-3">
                                <p className="text-sm text-gray-600">Valor por dia: <span className="font-semibold">80 MT</span>. Mínimo de dias: <span className="font-semibold">20</span>.</p>
                                <div className="flex items-center gap-3">
                                    <label className="text-sm text-gray-600">Dias</label>
                                    <input type="number" min={20} value={proDays}
                                        onChange={e=>setProDays(Math.max(20, parseInt(e.target.value||0)))}
                                        className="w-24 border rounded-md px-3 py-2 text-sm"/>
                                    <span className="text-sm">Total: <span className="font-bold">{(Number(proDays)||20)*80} MT</span></span>
                                </div>
                                <button
                                    disabled={proLoading}
                                    onClick={async ()=>{
                                        const dias = Number(proDays)||20;
                                        if (dias < 20) { toast.error('Mínimo 20 dias'); return; }
                                        try{
                                            setProLoading(true);
                                            await api.put(`/usuario/${user?.id}/ativar_pro/`, { dias }, { headers:{ Authorization:`Bearer ${token}` }});
                                            toast.success('Conta PRO ativada com sucesso');
                                            setUserProfile(prev=>({...prev, pro:true}));
                                        }catch(err){
                                            const msg = err?.response?.data?.detail || 'Falha ao ativar PRO';
                                            toast.error(String(msg));
                                        }finally{
                                            setProLoading(false);
                                        }
                                    }}
                                    className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md"
                                >
                                    {proLoading ? 'Ativando...' : 'Ativar Conta PRO'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                    {loadingStats && (
                        <div className="text-sm text-gray-500">Carregando...</div>
                    )}
                <div className="px-5 py-3 border-t flex justify-end">
                    <button onClick={() => setShowSettings(false)} className="px-4 py-2 rounded-md bg-indigo-500 text-white hover:bg-indigo-600 text-sm">Fechar</button>
                </div>
            </div>
        </div>
    );


  return (
    <div className='w-full min-h-screen p-4 md:p-10'>
        
        <div className="container mx-auto">
            {!hasProfile && !loading ? (
            <div className="flex items-center justify-center min-h-screen flex-col gap-2">
                <div className="flex justify-center items-center p-5 bg-gray-200 rounded-full">
                    <Info className="text-gray-900" />
                </div>
                <h1 className="text-2xl font-semibold">Perfil não está disponível</h1>
                <p>A ligação pode não estar a funcionar ou o perfil pode ter sido removido.</p>
                <Link 
                    to="/" 
                    className="py-3 px-4 bg-indigo-400 rounded-md hover:bg-indigo-600 text-white font-semibold"
                >
                    Ver mais na SkyVenda MZ
                </Link>
            </div>
                ) : !loading && hasProfile ? (
                    <>
                        {isMyProfile ?(
                            <div className="container min-h-screen  lg:px-[140px] pb-[100px]">
                            <div className="w-full">
                                <div className="flex flex-col md:flex-row gap-4 flex-1">
                                    {/* area do avatar */}
                                    <div 
                                        className="flex flex-col w-full items-center justify-center relative py-4 md:py-0 md:w-[282px] md:h-[182px]"
                                        
                                    >
                                        <div className="absolute -z-10 w-[120px] h-[120px] md:w-[155px] md:h-[155px] rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-yellow-400" />
                                        {uploading && (
                                            <div className="absolute z-10 w-[120px] h-[120px] md:w-[155px] md:h-[155px] rounded-full bg-black/20 flex items-center justify-center">
                                            <Loader className='animate-spin text-white'/>
                                             </div>
                                        )}
                                        
                                        <img 
                                            src={previewImage}
                                            className="rounded-full border w-[115px] h-[115px] md:w-[150px] md:h-[150px]"
                                            alt="Profile"
                                            onMouseMove={handleMouseMove}
                                            onMouseEnter={() => setShowTooltip(true)}
                                            onMouseLeave={() => setShowTooltip(false)}
                                            onClick={()=>setOpenAvatarMenu(true)}
                                            />

                                        {showTooltip && (
                                        <div
                                            className="fixed z-50 bg-black text-white px-3 py-1 rounded-md  pointer-events-none text-xs"
                                            style={{
                                            left: `${tooltipPosition.x}px`,
                                            top: `${tooltipPosition.y}px`,
                                            }}
                                        >
                                            Mudar a foto do perfil
                                        </div>
                                        )}
                                    </div>

                                    {/* area das opcoes e informacoes */}
                                    <div className="w-full space-y-2 ">
                                        <div className="flex py-2 md:h-[40px] gap-4 items-center flex-1 ">
                                            <span className='text-2xl flex items-center gap-2'>
                                                {userProfile.username}
                                                {(userProfile?.pro || userProfile?.is_pro || userProfile?.conta_pro) && (
                                                    <BadgeCheck className="w-5 h-5 text-sky-500" title="Conta PRO"/>
                                                )}
                                            </span>
                                            <Link to={'/accounts/edit'} className='bg-gray-200 py-2 px-4 rounded-md hover:bg-gray-300'>Editar Perfil</Link>
                                            {/* A ativação da conta PRO foi movida para o modal de Definições */}
                                            <Link className='bg-gray-200 py-2 px-4 rounded-md hover:bg-gray-300'>Ver Publicaoes</Link>
                                            <button onClick={openSettings} className='p-2 rounded-md hover:bg-gray-100'>
                                                <Settings className='hover:animate-spin'/>
                                            </button>
                                        </div>

                                        <div className="flex py-2 md:h-[40px] gap-4 items-center flex-1 ">
                                            <span><span className='font-bold'>{userProfile.total_produtos}</span> publicacoes</span>
                                            <span><span className='font-bold'>{userProfile.total_seguidores}</span> segudores</span>
                                            <span><span className='font-bold'>{userProfile.total_seguindo || 0}</span> A seguir</span>
                                        </div>
                                        <div className="">
                                            <p className='font-bold text-2xl'>{userProfile.name}</p>
                                            <p>{userProfile.email}</p>
                                        </div>
                                    </div>

                                </div>
                                <div className="flex h-[1px] bg-gray-300 mt-10 "></div>
                                {/* tabs */}
                                <div className="flex-1 gap-4">
                                    <div className="flex flex-wrap gap-2 sm:gap-8 justify-center items-center overflow-x-auto">
                                    <Link  to={`/${username}`} className={`uppercase transition-all duration-300 gap-1 sm:gap-2 py-2 sm:py-3 flex text-xs sm:text-sm text-gray-500 ${tabSelected==`/${username}` && "font-bold text-gray-900 border-t-2  border-t-gray-900 "}`}><Grid className="w-4 h-4 sm:w-5 sm:h-5"/>Produtos</Link>
                                    <Link to={`/${username}/orders`} className={`uppercase transition-all duration-100 gap-1 sm:gap-2 py-2 sm:py-3 flex text-xs sm:text-sm text-gray-500 ${tabSelected==`/${username}/orders` && "font-bold text-gray-900 border-t-2  border-t-gray-900"}`}><ClipboardList className="w-4 h-4 sm:w-5 sm:h-5"/>Pedidos</Link>
                                    <Link  to={`/${username}/publicacoes`}className={`uppercase transition-all duration-100 gap-1 sm:gap-2 py-2 sm:py-3 flex text-xs sm:text-sm text-gray-500 ${tabSelected==`/${username}/publicacoes` && "font-bold text-gray-900 border-t-2  border-t-gray-900"}`}><FileText className="w-4 h-4 sm:w-5 sm:h-5"/>Publicações</Link>
                                    <Link to={`/${username}/seguidores`} className={`uppercase transition-all duration-100 gap-1 sm:gap-2 py-2 sm:py-3 flex text-xs sm:text-sm text-gray-500 ${tabSelected==`/${username}/seguidores` && "font-bold text-gray-900 border-t-2  border-t-gray-900"}`}><Users className="w-4 h-4 sm:w-5 sm:h-5"/>Seguidores</Link>
                                    </div>
                                    {/* tabs content body */}
                                    <div className="flex-1">
                                        {tabSelected==`/${username}` &&(
                                            <div className="grid grid-cols-3 gap-4">
                                                {loadingProducts ?(
                                                <>
                                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                                        <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
                                                        <div className="aspect-square bg-gray-200"></div>
                                                        <div className="p-4 space-y-3">
                                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                                        </div>
                                                        </div>
                                                    ))}
                                                </>
                                            ):(
                                               <>
                                                {myproducts.length>=1 ?(
                                                    <>
                                                        {myproducts.map((product, i) => (
                                                    <div
                                                        key={i}
                                                        className="bg-white border flex items-center justify-center aspect-square rounded-md relative group overflow-hidden shadow-xm hover:shadow-lg transition-shadow"
                                                    >
                                                        <img
                                                        src={`${base_url}/produto/${product.thumb}`}
                                                        onError={(e) => (e.target.src = `${base_url}/default.png`)}
                                                        className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <div className="flex font-bold text-white gap-4 text-sm md:text-base">
                                                            <div className="flex items-center gap-1">
                                                            <Heart /> {product?.likes || 0}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                            <Eye /> {product?.views || 0}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                            <MessageCircle /> {product?.comments?.length || 0}
                                                            </div>
                                                        </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                    </>
                                                ):(
                                                    <div className="g">
                                                        ainda nao tem produtos
                                                    </div>
                                                )}

                                               </> 
                                            )}
                                            </div> 
                                        )}
                                        {tabSelected==`/${username}/orders`&&(
                                            <Pedidos/>
                                        )}
                                    </div>
                                </div>

                            </div>

                        </div> 

                        ):(
                            <>
                            {/* perfil publico */}
                           <div className="container min-h-screen  lg:px-[140px] pb-[100px]">
                                <div className="w-full">
                                    <div className="flex flex-col md:flex-row gap-4 flex-1">
                                        {/* area do avatar */}
                                        <div className="flex flex-col w-full items-center justify-center relative py-4 md:py-0 md:w-[282px] md:h-[182px]">
                                        <div className="absolute -z-10 w-[120px] h-[120px] md:w-[155px] md:h-[155px] rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-yellow-400" />

                                            <img 
                                            src={`${userProfile?.perfil}`}
                                            className='rounded-full border w-[115px] h-[115px] md:w-[150px] md:h-[150px]'/>
                                        </div>

                                        {/* area das opcoes e informacoes */}
                                        <div className="w-full space-y-2 ">
                                            <div className="flex flex-col sm:flex-row py-1 md:h-[40px] gap-2 sm:gap-4 items-start sm:items-center flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className='text-xl sm:text-2xl font-semibold'>{userProfile.username}</span>
                                                    {userProfile.revisado === "sim" && (
                                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                                                            <Award className="w-3 h-3 mr-0.5" />
                                                            Verificado
                                                        </span>
                                                    )}
                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                                                        {userProfile.tipo}
                                                    </span>
                                                </div>
                                                <div className="flex gap-2 flex-wrap mt-2 sm:mt-0">
                                                    <button 
                                                        className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs sm:text-sm font-medium transition-colors ${followLoading ? 'opacity-75 cursor-not-allowed' : ''} ${userProfile.seguindo ? 'bg-gray-200 text-gray-900 hover:bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                                                        disabled={followLoading}
                                                        onClick={() => {
                                                            if (!token) {
                                                                toast.error('Você precisa estar logado para seguir este usuário');
                                                                return;
                                                            }
                                                            
                                                            // Ativar o estado de carregamento
                                                            setFollowLoading(true);
                                                            
                                                            // Implementar chamada para seguir/deixar de seguir
                                                            const novoStatus = !userProfile.seguindo;
                                                            
                                                            // Usar o ID do usuário em vez do nome de usuário
                                                            const userId = userProfile.id;
                                                            
                                                            // O endpoint "seguir" funciona como um toggle - basta chamar sempre o mesmo endpoint
                                                            // Se já está seguindo, ele vai deixar de seguir
                                                            // Se não está seguindo, ele vai seguir
                                                            
                                                            console.log(`Chamando endpoint de toggle seguir: /usuario/${userId}/seguir`);
                                                            
                                                            // Fazer a chamada direta com axios para garantir que funcione
                                                            axios({
                                                                method: 'POST',
                                                                url: `${base_url}/usuario/${userId}/seguir`,
                                                                headers: {
                                                                    'accept': 'application/json',
                                                                    'Authorization': `Bearer ${token}`
                                                                },
                                                                data: ''
                                                            })
                                                            .then(response => {
                                                                console.log('Resposta seguir/deixar de seguir:', response.data);
                                                                
                                                                // Atualizar o estado local
                                                                setUserProfile(prev => ({
                                                                    ...prev,
                                                                    seguindo: novoStatus,
                                                                    total_seguidores: novoStatus ? prev.total_seguidores + 1 : prev.total_seguidores - 1
                                                                }));
                                                                
                                                                toast.success(novoStatus ? 
                                                                    `Agora você está seguindo ${userProfile.username}` : 
                                                                    `Você deixou de seguir ${userProfile.username}`);
                                                            })
                                                            .catch(error => {
                                                                console.error('Erro ao seguir/deixar de seguir:', error);
                                                                toast.error('Não foi possível realizar esta operação');
                                                            })
                                                            .finally(() => {
                                                                // Desativar o estado de carregamento após a conclusão
                                                                setFollowLoading(false);
                                                            });
                                                        }}
                                                    >
                                                        {followLoading ? (
                                                            <>
                                                                <Loader className="w-4 h-4 mr-1 animate-spin" />
                                                                {userProfile.seguindo ? 'Processando...' : 'Processando...'}
                                                            </>
                                                        ) : userProfile.seguindo ? (
                                                            <>
                                                                <UserCheck className="w-4 h-4 mr-1" />
                                                                Seguindo
                                                            </>
                                                        ) : (
                                                            <>
                                                                <UserPlus className="w-4 h-4 mr-1" />
                                                                Seguir
                                                            </>
                                                        )}
                                                    </button>
                                                    <button 
                                                        className='bg-gray-200 py-1 px-2 sm:px-3 rounded-md hover:bg-gray-300 flex items-center gap-1 text-xs sm:text-sm'
                                                        onClick={() => handleOpenChat(userProfile)}
                                                    >
                                                        <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        Mensagem
                                                    </button>
                                                    <button>
                                                        <MoreHorizontal/>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap py-2 md:h-[40px] gap-2 sm:gap-4 items-center flex-1">
                                                <span className="text-sm sm:text-base"><span className='font-bold'>{userProfile.total_produtos || 0}</span> publicações</span>
                                                <span className="text-sm sm:text-base"><span className='font-bold'>{userProfile.total_seguidores || 0}</span> seguidores</span>
                                                <span className="text-sm sm:text-base"><span className='font-bold'>{userProfile.total_seguindo || 0}</span> a seguir</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <p className='font-bold text-xl sm:text-2xl flex items-center gap-2'>
                                                    {userProfile.name}
                                                    {(userProfile?.pro || userProfile?.is_pro || userProfile?.conta_pro) && (
                                                        <BadgeCheck className="w-5 h-5 text-sky-500" title="Conta PRO"/>
                                                    )}
                                                </p>
                                                <p className="text-sm sm:text-base">{userProfile.email}</p>
                                                {userProfile.biografia && <p className="mt-1 text-sm sm:text-base">{userProfile.biografia}</p>}
                                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                                    <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full">
                                                        <Package className="w-4 h-4 text-gray-500" />
                                                        <span className="text-xs text-gray-500">{userProfile.total_produtos || 0} produtos</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full">
                                                        <div className="flex">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star 
                                                                    key={i} 
                                                                    className={`w-3 h-3 ${i < Math.round(userRating.media_estrelas || 0) ? 'text-yellow-500' : 'text-gray-300'}`} 
                                                                    fill={i < Math.round(userRating.media_estrelas || 0) ? 'currentColor' : 'none'}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-xs text-gray-500 ml-1">{userRating.media_estrelas || '0'} ({userRating.total_avaliacoes || 0})</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="flex h-[1px] bg-gray-300 mt-10 "></div>
                                    {/* tabs */}
                                    <div className="flex-1 gap-4">
                                        <div className="flex gap-8 justify-center items-center">
                                        <Link  to={`/${username}`} className={`uppercase transition-all duration-300 gap-2 py-3 flex text-gray-500 ${tabSelected==`/${username}` && "font-bold text-gray-900 border-t-2  border-t-gray-900 "}`}><Grid/>Produtos</Link>
                                        <Link  to={`/${username}/publicacoes`}className={`uppercase transition-all duration-100 gap-2 py-3 flex text-gray-500 ${tabSelected==`/${username}/publicacoes` && "font-bold text-gray-900 border-t-2  border-t-gray-900"}`}><FileText/>Publicações</Link>
                                        <Link to={`/${username}/seguidores`} className={`uppercase transition-all duration-100  gap-2 py-3 flex text-gray-500 ${tabSelected==`/${username}/seguidores` && "font-bold text-gray-900 border-t-2  border-t-gray-900"}`}><Users/>Seguidores</Link>
                                        </div>
                                        {/* tabs content body */}
                                        <div className="flex-1">
                                            {tabSelected==`/${username}` &&(
                                                <div className="grid grid-cols-3 gap-4">
                                                    {loadingProducts ?(
                                                    <>
                                                        {[1, 2, 3, 4, 5, 6].map((i) => (
                                                            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
                                                            <div className="aspect-square bg-gray-200"></div>
                                                            <div className="p-4 space-y-3">
                                                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                                            </div>
                                                            </div>
                                                        ))}
                                                    </>
                                                ):(
                                                   <>
                                                    {products.length>=1 ?(
                                                        <>
                                                        {products.map((product, i) => (
                                                            <div
                                                                key={i}
                                                                className="bg-white border flex items-center justify-center aspect-square rounded-md relative group overflow-hidden shadow-xm hover:shadow-lg transition-shadow"
                                                            >
                                                                <Link to={`/post/${product.slug}`} className="w-full h-full">
                                                                    <img
                                                                    src={product.capa || `${base_url}/produto/${product.thumb}`}
                                                                    onError={(e) => (e.target.src = `${base_url}/default.png`)}
                                                                    className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                                                                    />
                                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                                    <div className="flex font-bold text-white gap-4 text-sm md:text-base">
                                                                        <div className="flex items-center gap-1">
                                                                        <Heart /> {product?.likes || 0}
                                                                        </div>
                                                                        <div className="flex items-center gap-1">
                                                                        <Eye /> {product?.views || 0}
                                                                        </div>
                                                                        <div className="flex items-center gap-1">
                                                                        <MessageCircle /> {product?.comments?.length || 0}
                                                                        </div>
                                                                    </div>
                                                                    </div>
                                                                </Link>
                                                            </div>
                                                        ))}

                                                            </>
                                                        ):(
                                                            <div className="g">

                                                                ainda nao tem produtos

                                                            </div>
                                                        )}

                                                   </> 
                                                )}
                                                </div> 
                                            )}
                                            
                                            {tabSelected==`/${username}/publicacoes` &&(
                                                <div className="flex flex-col gap-4">
                                                    {loadingPublicacoes ? (
                                                        <div className="p-6 text-center text-gray-500">
                                                            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                                            Carregando publicações...
                                                        </div>
                                                    ) : publicacoes.length === 0 ? (
                                                        <div className="p-6 text-center text-gray-500">
                                                            Nenhuma publicação encontrada
                                                        </div>
                                                    ) : (
                                                        publicacoes.map((publicacao) => (
                                                            <div key={publicacao.id} className="bg-white rounded-lg shadow-md p-4">
                                                                <div className="flex items-center gap-3 mb-3">
                                                                    <img 
                                                                        src={publicacao.publicador.foto_perfil || 'https://via.placeholder.com/40'} 
                                                                        alt={publicacao.publicador.nome}
                                                                        className="w-10 h-10 rounded-full object-cover"
                                                                    />
                                                                    <div>
                                                                        <h3 className="font-semibold">{publicacao.publicador.nome}</h3>
                                                                        <p className="text-xs text-gray-500">{new Date(publicacao.data_criacao || new Date()).toLocaleString('pt-BR')}</p>
                                                                    </div>
                                                                </div>
                                                                
                                                                <p className="text-gray-800 mb-3">{publicacao.conteudo}</p>
                                                                
                                                                <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-3">
                                                                    <div className="flex items-center gap-2">
                                                                        <Heart className={`w-5 h-5 ${publicacao.deu_like ? 'text-red-500 fill-red-500' : ''}`} />
                                                                        <span>{publicacao.total_likes || 0} curtidas</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <MessageCircle className="w-5 h-5" />
                                                                        <span>{publicacao.total_comentarios || 0} comentários</span>
                                                                    </div>
                                                                </div>
                                                                
                                                                {publicacao.comentarios && publicacao.comentarios.length > 0 && (
                                                                    <div className="mt-3 border-t pt-3">
                                                                        <h4 className="text-sm font-semibold mb-2">Comentários</h4>
                                                                        {publicacao.comentarios.map((comentario) => (
                                                                            <div key={comentario.id} className="flex gap-2 mb-2">
                                                                                <img 
                                                                                    src={comentario.usuario.foto_perfil || 'https://via.placeholder.com/30'} 
                                                                                    alt={comentario.usuario.nome}
                                                                                    className="w-7 h-7 rounded-full object-cover"
                                                                                />
                                                                                <div className="bg-gray-100 rounded-lg p-2 flex-1">
                                                                                    <div className="flex justify-between">
                                                                                        <h5 className="text-xs font-semibold">{comentario.usuario.nome}</h5>
                                                                                        <span className="text-xs text-gray-500">{new Date(comentario.data_criacao).toLocaleString('pt-BR', {day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>
                                                                                    </div>
                                                                                    <p className="text-sm">{comentario.conteudo}</p>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            )}
                                            
                                            {tabSelected==`/${username}/seguidores` &&(
                                                <div className="flex flex-col gap-4">
                                                    {loadingSeguidores ? (
                                                        <div className="p-6 text-center text-gray-500">
                                                            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                                            Carregando seguidores...
                                                        </div>
                                                    ) : seguidores.length === 0 ? (
                                                        <div className="p-6 text-center text-gray-500">
                                                            Nenhum seguidor encontrado
                                                        </div>
                                                    ) : (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            {seguidores.map((seguidor) => (
                                                                <div key={seguidor.id} className="bg-white rounded-lg shadow-md p-4 flex items-center gap-3">
                                                                    <img 
                                                                        src={seguidor.foto_perfil || 'https://via.placeholder.com/50'} 
                                                                        alt={seguidor.nome}
                                                                        className="w-12 h-12 rounded-full object-cover"
                                                                    />
                                                                    <div className="flex-1">
                                                                        <h3 className="font-semibold">{seguidor.nome}</h3>
                                                                        <p className="text-sm text-gray-500">@{seguidor.username}</p>
                                                                    </div>
                                                                    <div className="flex gap-2">
                                                                        <button 
                                                                            className="bg-indigo-100 text-indigo-600 p-2 rounded-full hover:bg-indigo-200"
                                                                            onClick={() => handleOpenChat(seguidor)}
                                                                        >
                                                                            <MessageCircle className="w-4 h-4" />
                                                                        </button>
                                                                        <button className="bg-gray-100 text-gray-600 p-2 rounded-full hover:bg-gray-200">
                                                                            <UserPlus className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                </div>

                            </div>
                            {/* perfil publico */}
                            </>
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-center min-h-screen">
                        <p className="text-lg text-gray-500">🔄 Carregando...</p>
                    </div>
                )}

        </div>
        {openAvatarMenu && <AvatarMenu/>}
        {showSettings && <SettingsModal/>}

    </div>
  )
}