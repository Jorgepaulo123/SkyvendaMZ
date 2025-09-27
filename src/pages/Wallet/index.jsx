import { useState, useEffect } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, History, CreditCard, Clock, Plus, FileText, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FaPaypal, FaCcVisa, FaCcMastercard } from 'react-icons/fa';
import { SiMoneygram } from 'react-icons/si';
import { toast } from 'react-hot-toast';
import DepositForm from '../../components/wallet/DepositForm';
import WithdrawForm from '../../components/wallet/WithdrawForm';
import PaymentMethods from '../../components/wallet/PaymentMethods';
import api from '../../api/api';

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState('wallet');
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cardData, setCardData] = useState({
    id: null,
    identificador_unico: null,
    saldo_principal: 0,
    saldo_congelado: 0,
    bonus: 0
  });
  const [userData, setUserData] = useState({
    username: ""
  });
  const [hideBalance, setHideBalance] = useState(() => {
    try {
      return localStorage.getItem('wallet_hide_balance') === '1';
    } catch (_) {
      return false;
    }
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
    // If redirected from PayPal, open the Deposit tab for auto-capture flow
    try {
      const params = new URLSearchParams(window.location.search);
      const hasPaypalParam = params.has('paypal');
      if (hasPaypalParam) {
        setActiveTab('deposit');
      }
    } catch (_) {
      // ignore
    }
  }, [navigate]);

  useEffect(() => {
    try {
      localStorage.setItem('wallet_hide_balance', hideBalance ? '1' : '0');
    } catch (_) {}
  }, [hideBalance]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        console.error('Token não encontrado');
        setError('Sessão expirada. Por favor, faça login novamente.');
        navigate('/login');
        return;
      }

      // Headers de autenticação
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      
      try {
        // Requisição para obter transações
        const transactionsResponse = await api.get('/usuario/transacoes/listar', { headers });
        setTransactions(transactionsResponse.data);
      } catch (transactionError) {
        // Se for erro 404, significa que não há transações (conta não ativada)
        if (transactionError.response?.status === 404) {
          setTransactions([]);
        } else {
          throw transactionError; // Re-throw outros erros
        }
      }
      
      try {
        // Requisição para obter dados do cartão
        const cardResponse = await api.get('/usuario/card', { headers });
        setCardData(cardResponse.data);
      } catch (cardError) {
        // Se for erro 404, significa que o cartão não existe (conta não ativada)
        if (cardError.response?.status === 404) {
          setCardData({
            id: null,
            identificador_unico: null,
            saldo_principal: 0,
            saldo_congelado: 0,
            bonus: 0
          });
        } else {
          throw cardError; // Re-throw outros erros
        }
      }
      
      // Requisição para obter dados do usuário
      const userResponse = await api.get('/usuario/user', { headers });
      setUserData(userResponse.data);
      
      console.log('Dados carregados com sucesso!');
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      
      if (error.response?.status === 401) {
        console.error('Erro 401: Token inválido ou expirado');
        setError('Sessão expirada. Por favor, faça login novamente.');
        localStorage.removeItem('auth_token');
        navigate('/login');
      } else {
        setError(error.response?.data?.detail || 'Erro ao carregar dados. Tente novamente mais tarde.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-PT', {
      day: '2-digit',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatValue = (value) => {
    return Number(value).toLocaleString('pt-PT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Filtrar transações por tipo
  const depositos = transactions.filter(t => t.tipo === 'entrada');
  const saques = transactions.filter(t => t.tipo === 'saida');

  const tabs = [
    {
      id: 'wallet',
      label: 'Carteira',
      icon: Wallet
    },
    {
      id: 'history',
      label: 'Histórico',
      icon: History
    },
    {
      id: 'deposit',
      label: 'Depositar',
      icon: ArrowDownLeft
    },
    {
      id: 'sacar',
      label: 'Sacar',
      icon: ArrowUpRight
    },
    {
      id: 'payment-methods',
      label: 'Métodos',
      icon: CreditCard
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-3 sm:p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
          <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500" />
          SkyWallet
        </h1>
        
        {/* Cards responsivos */}
        <div className="space-y-4 sm:space-y-6 mb-4 sm:mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {/* Card Principal - Saldo Principal */}
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl" style={{
              background: 'linear-gradient(135deg, rgba(64, 112, 244, 0.9) 0%, rgba(33, 55, 123, 0.8) 100%)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)'
            }}>
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white -mt-16 -mr-16"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white -mb-10 -ml-10"></div>
              </div>
              <div className="relative p-4 sm:p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span className="text-base sm:text-lg font-medium">SkyWallet</span>
                  </div>
                  <div className="text-xs sm:text-sm font-light opacity-90">
                    {userData.username || "Utilizador"}
                  </div>
                </div>
                <div className="mt-3 sm:mt-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs sm:text-sm opacity-80">Saldo principal</div>
                    <button
                      type="button"
                      className="p-1 rounded hover:bg-white/10 transition"
                      aria-label={hideBalance ? 'Mostrar saldo' : 'Esconder saldo'}
                      onClick={() => setHideBalance(v => !v)}
                    >
                      {hideBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="text-xl sm:text-3xl font-bold">
                    {hideBalance ? '••••••' : `${formatValue(cardData.saldo_principal)} MZN`}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 sm:mt-4">
                  <div className="text-xs sm:text-sm opacity-90">
                    <span>ID: {cardData.identificador_unico || '****'}</span>
                  </div>
                  <div className="opacity-80">
                    <svg width="24" height="16" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="21" cy="10" r="10" fill="rgba(255,255,255,0.8)" fillOpacity="0.8" />
                      <circle cx="10" cy="10" r="10" fill="rgba(255,255,255,0.6)" fillOpacity="0.6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Card Secundário - Saldo Congelado */}
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl" style={{
              background: 'linear-gradient(135deg, rgba(103, 103, 225, 0.9) 0%, rgba(53, 53, 155, 0.8) 100%)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)'
            }}>
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white -mt-16 -mr-16"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white -mb-10 -ml-10"></div>
              </div>
              <div className="relative p-4 sm:p-6 text-white">
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span className="text-base sm:text-lg font-medium">Saldo Congelado</span>
                  </div>
                </div>
                <div className="mt-3 sm:mt-4">
                  <div className="text-xs sm:text-sm opacity-80">Valor bloqueado</div>
                  <div className="text-xl sm:text-3xl font-bold">{formatValue(cardData.saldo_congelado)} MZN</div>
                </div>
                <div className="flex items-center mt-3 sm:mt-4">
                  <div className="text-xs sm:text-sm opacity-90">
                    <span>Liberado após aprovação</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Card Terciário - Bônus */}
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl" style={{
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.9) 0%, rgba(87, 13, 248, 0.8) 100%)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)'
            }}>
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white -mt-16 -mr-16"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white -mb-10 -ml-10"></div>
              </div>
              <div className="relative p-4 sm:p-6 text-white">
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span className="text-base sm:text-lg font-medium">Bônus</span>
                  </div>
                </div>
                <div className="mt-3 sm:mt-4">
                  <div className="text-xs sm:text-sm opacity-80">Saldo de bônus</div>
                  <div className="text-xl sm:text-3xl font-bold">{formatValue(cardData.bonus)} MZN</div>
                </div>
                <div className="flex items-center mt-3 sm:mt-4">
                  <div className="text-xs sm:text-sm opacity-90">
                    <span>Ganho por indicações</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navegação por abas responsiva */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden mb-4 sm:mb-6">
          <div className="flex flex-wrap border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 sm:py-4 px-2 sm:px-4 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-violet-500 border-b-2 border-violet-500'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden xs:inline">{tab.label}</span>
              </button>
            ))}
          </div>
          
          {/* Conteúdo das abas */}
          <div className="p-3 sm:p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-500"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {error}
                </h3>
                <button
                  onClick={loadData}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700"
                >
                  Tentar novamente
                </button>
              </div>
            ) : (
              <>
                {/* Aba Carteira */}
                {activeTab === 'wallet' && (
                  <div className="space-y-4 sm:space-y-6">
                    {(!cardData.id || transactions.length === 0) ? (
                      <div className="text-center py-12 px-4">
                        <div className="mx-auto w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4">
                          <Plus className="w-8 h-8 text-violet-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Ative sua conta SkyWallet
                        </h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">
                          Para começar a usar sua carteira digital, faça seu primeiro depósito. 
                          Com a SkyWallet você pode gerenciar seus anúncios e fazer transações com segurança.
                        </p>
                        <button
                          onClick={() => setActiveTab('deposit')}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                        >
                          <Plus className="w-5 h-5 mr-2" />
                          Fazer primeiro depósito
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="bg-gray-50 p-4 sm:p-6 rounded-xl">
                          <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Informações do Cartão</h3>
                          <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                            <div className="flex justify-between">
                              <span className="text-gray-500">ID:</span>
                              <span className="font-medium">{cardData.identificador_unico || '****'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Usuário:</span>
                              <span className="font-medium">{userData.username || ''}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500">Saldo Principal:</span>
                              <span className="font-medium text-green-600">{hideBalance ? '••••••' : `${formatValue(cardData.saldo_principal)} MZN`}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Saldo Congelado:</span>
                              <span className="font-medium text-blue-600">{formatValue(cardData.saldo_congelado)} MZN</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Bônus:</span>
                              <span className="font-medium text-purple-600">{formatValue(cardData.bonus)} MZN</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-4 sm:p-6 rounded-xl">
                          <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Operações Disponíveis</h3>
                          <div className="space-y-3 sm:space-y-4">
                            <button 
                              onClick={() => setActiveTab('deposit')}
                              className="w-full flex items-center justify-between p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
                            >
                              <div className="flex items-center">
                                <ArrowDownLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                <span>Depositar</span>
                              </div>
                              <Plus className="w-4 h-4" />
                            </button>
                            
                            <button 
                              onClick={() => setActiveTab('sacar')}
                              className="w-full flex items-center justify-between p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
                            >
                              <div className="flex items-center">
                                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                <span>Sacar</span>
                              </div>
                              <Plus className="w-4 h-4" />
                            </button>
                            
                            <button 
                              onClick={() => setActiveTab('history')}
                              className="w-full flex items-center justify-between p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                            >
                              <div className="flex items-center">
                                <History className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                <span>Histórico</span>
                              </div>
                              <FileText className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Aba Histórico */}
                {activeTab === 'history' && (
                  <div className="space-y-4">
                    <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Histórico de Transações</h3>
                    {(!cardData.id || transactions.length === 0) ? (
                      <div className="text-center py-12 px-4">
                        <div className="mx-auto w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4">
                          <Plus className="w-8 h-8 text-violet-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Ative sua conta SkyWallet
                        </h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">
                          Para começar a usar sua carteira digital, faça seu primeiro depósito. 
                          Com a SkyWallet você pode gerenciar seus anúncios e fazer transações com segurança.
                        </p>
                        <button
                          onClick={() => setActiveTab('deposit')}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                        >
                          <Plus className="w-5 h-5 mr-2" />
                          Fazer primeiro depósito
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2 sm:space-y-3">
                        {transactions.map((transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className={`p-1.5 sm:p-2 rounded-lg ${transaction.tipo === 'entrada' ? 'bg-green-100' : 'bg-red-100'}`}>
                                {transaction.tipo === 'entrada' ? (
                                  <ArrowDownLeft className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                ) : (
                                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-sm sm:text-base">{transaction.referencia}</p>
                                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {formatDate(transaction.data_hora)}
                                </div>
                              </div>
                            </div>
                            <span className={`font-medium text-sm sm:text-base ${transaction.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                              {transaction.tipo === 'entrada' ? '+' : '-'}{formatValue(transaction.valor)} MZN
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Aba Depositar */}
                {activeTab === 'deposit' && (
                  <>
                    {(!cardData.id || transactions.length === 0) ? (
                      <div className="text-center py-12 px-4">
                        <div className="mx-auto w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4">
                          <Plus className="w-8 h-8 text-violet-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Ative sua conta SkyWallet
                        </h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">
                          Para começar a usar sua carteira digital, faça seu primeiro depósito. 
                          Com a SkyWallet você pode gerenciar seus anúncios e fazer transações com segurança.
                        </p>
                      </div>
                    ) : null}
                    <DepositForm />
                  </>
                )}
                
                {/* Aba Sacar */}
                {activeTab === 'sacar' && (
                  <>
                    {(!cardData.id || transactions.length === 0) ? (
                      <div className="text-center py-12 px-4">
                        <div className="mx-auto w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4">
                          <Plus className="w-8 h-8 text-violet-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Ative sua conta SkyWallet
                        </h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">
                          Para começar a usar sua carteira digital, faça seu primeiro depósito. 
                          Com a SkyWallet você pode gerenciar seus anúncios e fazer transações com segurança.
                        </p>
                        <button
                          onClick={() => setActiveTab('deposit')}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                        >
                          <Plus className="w-5 h-5 mr-2" />
                          Fazer primeiro depósito
                        </button>
                      </div>
                    ) : (
                      <WithdrawForm />
                    )}
                  </>
                )}
                
                {/* Aba Métodos de Pagamento */}
                {activeTab === 'payment-methods' && <PaymentMethods />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
