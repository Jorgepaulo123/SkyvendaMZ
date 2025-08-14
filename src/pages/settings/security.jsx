import React, { useState, useEffect } from 'react';
import { Shield, Lock, Eye, EyeOff, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function Security() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pinConfig, setPinConfig] = useState({
    pin_ativo: false,
    requer_pin_transferencia: true,
    requer_pin_visualizacao: false,
    valor_minimo_pin: 0
  });
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [hasPinConfig, setHasPinConfig] = useState(false);
  const [isCreatingPin, setIsCreatingPin] = useState(false);

  // Fetch PIN configuration on load
  useEffect(() => {
    fetchPinConfiguration();
  }, []);

  const fetchPinConfiguration = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://skyvendamz-1.onrender.com/pin/configuracao`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPinConfig(response.data);
      setHasPinConfig(true);
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // PIN configuration doesn't exist yet
        setHasPinConfig(false);
      } else {
        toast.error('Erro ao carregar configurações de PIN');
      }
      setLoading(false);
    }
  };

  const handleCreatePin = async (e) => {
    e.preventDefault();
    
    if (newPin !== confirmPin) {
      toast.error('Os PINs não correspondem');
      return;
    }

    if (!/^\d{4,6}$/.test(newPin)) {
      toast.error('O PIN deve ter entre 4 e 6 dígitos numéricos');
      return;
    }

    try {
      setLoading(true);
      await axios.post(`https://skyvendamz-1.onrender.com/pin/configurar`, 
        {
          pin: newPin,
          // Ao configurar um PIN pela primeira vez, ativamos o PIN automaticamente
          pin_ativo: true,
          requer_pin_transferencia: pinConfig.requer_pin_transferencia,
          requer_pin_visualizacao: pinConfig.requer_pin_visualizacao,
          valor_minimo_pin: parseFloat(pinConfig.valor_minimo_pin)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success('PIN configurado com sucesso');
      setNewPin('');
      setConfirmPin('');
      setIsCreatingPin(false);
      fetchPinConfiguration();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao configurar PIN');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePin = async (e) => {
    e.preventDefault();
    
    if (newPin !== confirmPin) {
      toast.error('Os novos PINs não correspondem');
      return;
    }

    if (!/^\d{4,6}$/.test(newPin)) {
      toast.error('O PIN deve ter entre 4 e 6 dígitos numéricos');
      return;
    }

    try {
      setLoading(true);
      await axios.put(`https://skyvendamz-1.onrender.com/pin/atualizar`, 
        {
          pin_atual: currentPin,
          novo_pin: newPin,
          pin_ativo: pinConfig.pin_ativo,
          requer_pin_transferencia: pinConfig.requer_pin_transferencia,
          requer_pin_visualizacao: pinConfig.requer_pin_visualizacao,
          valor_minimo_pin: parseFloat(pinConfig.valor_minimo_pin)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success('PIN atualizado com sucesso');
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
      fetchPinConfiguration();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao atualizar PIN');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSetting = async (setting) => {
    try {
      const updatedConfig = { ...pinConfig };
      updatedConfig[setting] = !pinConfig[setting];
      
      setLoading(true);
      
      if (hasPinConfig) {
        // Update existing PIN config
        await axios.put(`https://skyvendamz-1.onrender.com/pin/atualizar`, 
          {
            ...updatedConfig,
            valor_minimo_pin: parseFloat(updatedConfig.valor_minimo_pin)
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      }
      
      setPinConfig(updatedConfig);
      toast.success('Configuração atualizada');
    } catch (error) {
      toast.error('Erro ao atualizar configuração');
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setPinConfig({
      ...pinConfig,
      valor_minimo_pin: value
    });
  };

  const handleSaveMinimumValue = async () => {
    try {
      setLoading(true);
      await axios.put(`https://skyvendamz-1.onrender.com/pin/atualizar`, 
        {
          ...pinConfig,
          valor_minimo_pin: parseFloat(pinConfig.valor_minimo_pin)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success('Valor mínimo atualizado');
    } catch (error) {
      toast.error('Erro ao atualizar valor mínimo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full p-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-6 h-6 text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-800">Configurações de Segurança</h1>
      </div>

      <div className="space-y-8">
        {/* PIN Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-gray-800">PIN de Segurança</h2>
                <span className={`text-xs px-2 py-1 rounded-full border ${pinConfig.pin_ativo ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                  {pinConfig.pin_ativo ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <p className="text-gray-500 mt-1">Configure o PIN para proteger sua carteira e transações</p>
            </div>
            <div className="flex items-center">
              <div className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer ${pinConfig.pin_ativo ? 'bg-indigo-600' : 'bg-gray-300'}`}
                onClick={() => !loading && handleToggleSetting('pin_ativo')}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${pinConfig.pin_ativo ? 'translate-x-5' : ''}`}></div>
              </div>
            </div>
          </div>

          {!hasPinConfig && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-amber-800">PIN não configurado</h3>
                <p className="text-amber-700 text-sm mt-1">
                  Você ainda não configurou um PIN de segurança. Configure um PIN para proteger suas transações.
                </p>
                <button 
                  className="mt-3 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
                  onClick={() => setIsCreatingPin(true)}
                >
                  Configurar PIN
                </button>
              </div>
            </div>
          )}

          {isCreatingPin && (
            <form onSubmit={handleCreatePin} className="mt-4 space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="font-semibold text-gray-700">Criar novo PIN</h3>
              
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type={showNewPin ? 'text' : 'password'}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="Novo PIN (4-6 dígitos)"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pl-10"
                    maxLength={6}
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <button
                    type="button"
                    onClick={() => setShowNewPin(!showNewPin)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showNewPin ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showConfirmPin ? 'text' : 'password'}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    placeholder="Confirmar PIN"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pl-10"
                    maxLength={6}
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPin(!showConfirmPin)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showConfirmPin ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingPin(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  disabled={loading || !newPin || !confirmPin}
                >
                  {loading ? 'Processando...' : 'Salvar PIN'}
                </button>
              </div>
            </form>
          )}

          {hasPinConfig && (
            <>
              <div className="mt-6 space-y-6">
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                  <div>
                    <h3 className="font-medium text-gray-800">PIN para transferências</h3>
                    <p className="text-sm text-gray-500">Solicitar PIN ao fazer transferências</p>
                  </div>
                  <div className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer ${pinConfig.requer_pin_transferencia ? 'bg-indigo-600' : 'bg-gray-300'}`}
                    onClick={() => !loading && handleToggleSetting('requer_pin_transferencia')}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${pinConfig.requer_pin_transferencia ? 'translate-x-5' : ''}`}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                  <div>
                    <h3 className="font-medium text-gray-800">PIN para visualização de saldo</h3>
                    <p className="text-sm text-gray-500">Solicitar PIN ao visualizar saldo</p>
                  </div>
                  <div className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer ${pinConfig.requer_pin_visualizacao ? 'bg-indigo-600' : 'bg-gray-300'}`}
                    onClick={() => !loading && handleToggleSetting('requer_pin_visualizacao')}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${pinConfig.requer_pin_visualizacao ? 'translate-x-5' : ''}`}></div>
                  </div>
                </div>

                <div className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-800">Valor mínimo para PIN</h3>
                      <p className="text-sm text-gray-500">Solicitar PIN apenas para transferências acima deste valor</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={pinConfig.valor_minimo_pin}
                      onChange={handleValueChange}
                      className="border border-gray-300 rounded-lg p-2 w-40"
                    />
                    <button
                      onClick={handleSaveMinimumValue}
                      disabled={loading}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      {loading ? "Salvando..." : "Salvar"}
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => {
                      setCurrentPin('');
                      setNewPin('');
                      setConfirmPin('');
                      setShowCurrentPin(false);
                      setShowNewPin(false);
                      setShowConfirmPin(false);
                      document.getElementById('update-pin-form').classList.toggle('hidden');
                    }}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Alterar PIN
                  </button>

                  <form id="update-pin-form" onSubmit={handleUpdatePin} className="hidden mt-4 space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="relative">
                      <input
                        type={showCurrentPin ? 'text' : 'password'}
                        value={currentPin}
                        onChange={(e) => setCurrentPin(e.target.value)}
                        placeholder="PIN atual"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pl-10"
                        maxLength={6}
                        required
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPin(!showCurrentPin)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        {showCurrentPin ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type={showNewPin ? 'text' : 'password'}
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        placeholder="Novo PIN (4-6 dígitos)"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pl-10"
                        maxLength={6}
                        required
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <button
                        type="button"
                        onClick={() => setShowNewPin(!showNewPin)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        {showNewPin ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type={showConfirmPin ? 'text' : 'password'}
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value)}
                        placeholder="Confirmar novo PIN"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pl-10"
                        maxLength={6}
                        required
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPin(!showConfirmPin)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        {showConfirmPin ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => document.getElementById('update-pin-form').classList.add('hidden')}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        disabled={loading}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        disabled={loading}
                      >
                        {loading ? 'Processando...' : 'Atualizar PIN'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start">
                <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-blue-800">Dicas de segurança</h3>
                  <ul className="text-blue-700 text-sm mt-1 list-disc list-inside space-y-1">
                    <li>Não compartilhe seu PIN com ninguém</li>
                    <li>Use um PIN que seja fácil de lembrar, mas difícil de adivinhar</li>
                    <li>Troque seu PIN regularmente para maior segurança</li>
                    <li>Em caso de suspeita de fraude, altere seu PIN imediatamente</li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 