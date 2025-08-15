import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import PinModal from '../modals/PinModal';

export default function DepositForm() {
  const { token, user } = useAuth();
  const [depositAmount, setDepositAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('mpesa');
  const [step, setStep] = useState(1);
  const [pinOpen, setPinOpen] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  const resetForm = () => {
    setDepositAmount('');
    setPhoneNumber('');
    setStep(1);
    setSelectedPaymentMethod('mpesa');
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      setErrorMessage('Por favor, insira um valor válido');
      return;
    }

    if (selectedPaymentMethod === 'mpesa') {
      if (!phoneNumber || !/^[0-9]{9}$/.test(phoneNumber)) {
        setErrorMessage('Por favor, insira um número de telefone válido (9 dígitos)');
        return;
      }
    }

    // Restringe métodos: apenas M-Pesa disponível; E-mola indisponível
    setErrorMessage('');
    if (selectedPaymentMethod === 'emola') {
      toast.error('E-mola está temporariamente indisponível para depósitos.');
      return;
    }
    if (selectedPaymentMethod !== 'mpesa') {
      setErrorMessage('Método de pagamento não suportado. Use M-Pesa.');
      return;
    }
    setIsProcessing(true);

    try {
      if (selectedPaymentMethod === 'mpesa') {
        if (!user?.id) {
          throw new Error('ID do usuário não encontrado');
        }
        // Guardar dados e abrir modal do PIN
        setPendingData({
          msisdn: `258${phoneNumber}`,
          valor: parseInt(depositAmount, 10)
        });
        setPinOpen(true);
      }
      
    } catch (error) {
      console.error('Erro ao processar depósito:', error);
      if (error.message === 'ID do usuário não encontrado') {
        setErrorMessage('Erro de autenticação. Por favor, faça login novamente.');
      } else {
        setErrorMessage(error.response?.data?.detail || 'Ocorreu um erro ao processar seu depósito. Por favor, tente novamente.');
      }
    } finally {
      setPinLoading(false);
      setIsProcessing(false);
    }
  };

  const handlePinSubmit = async (pin) => {
    try {
      setPinLoading(true);
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      };
      const params = new URLSearchParams();
      params.set('msisdn', pendingData.msisdn);
      params.set('valor', String(pendingData.valor));
      params.set('pin', pin);
      await api.post(`/usuario/${user.id}/pagamento/`, params, { headers });
      toast.success(`Depósito de ${pendingData.valor} MTn iniciado com sucesso!`);
      setSuccessMessage(`Depósito de ${pendingData.valor} MTn iniciado com sucesso! Aguarde a confirmação.`);
      setPinOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao confirmar PIN/depósito:', error);
      const msg = error?.userMessage || error?.response?.data?.detail || error?.message || 'Não foi possível iniciar o depósito.';
      setErrorMessage(String(msg));
    } finally {
      setPinLoading(false);
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <PinModal
        open={pinOpen}
        mode="confirm"
        onClose={() => { setPinOpen(false); setIsProcessing(false); }}
        onSubmit={handlePinSubmit}
        loading={pinLoading}
      />
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 flex items-start">
          <div className="flex-shrink-0 mr-3">
            <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p>{successMessage}</p>
        </div>
      )}
      
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Depositar Fundos</h3>
        
        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
            <div className="space-y-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Valor a depositar (MTn)
                </label>
                <input
                  type="number"
                  id="amount"
                  min="10"
                  step="1"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ex: 100"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                disabled={!depositAmount || parseFloat(depositAmount) <= 0}
              >
                Continuar
              </button>
            </div>
          </form>
        )}
        
        {step === 2 && (
          <form onSubmit={handleDeposit}>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Escolha o método de pagamento</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div
                    className={`border p-4 rounded-lg cursor-pointer transition-all ${
                      selectedPaymentMethod === 'mpesa' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'
                    }`}
                    onClick={() => setSelectedPaymentMethod('mpesa')}
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="bg-white p-2 rounded-full mb-2 flex items-center justify-center" style={{width: '40px', height: '40px'}}>
                        <img 
                          src="https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/35/b8/06/35b80684-5547-d7a5-0a0d-919fa3d073d1/AppIcon-mz-0-0-1x_U007emarketing-0-5-0-0-85-220.png/434x0w.webp" 
                          alt="M-Pesa" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-sm font-medium">M-Pesa</span>
                    </div>
                  </div>
                  
                  <div
                    className="border p-4 rounded-lg relative opacity-60 cursor-not-allowed"
                    onClick={() => toast.error('E-mola está temporariamente indisponível para depósitos.')}
                    title="Indisponível no momento"
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="bg-white p-2 rounded-full mb-2 flex items-center justify-center" style={{width: '40px', height: '40px'}}>
                        <img 
                          src="https://play-lh.googleusercontent.com/iqKeCVTHvdTVoAg-YGmC5cxA83JmjkwaTJ0r6_sls1wANm_v1SVId3zaNe4xA_qfi9B2" 
                          alt="E-mola" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-sm font-medium">E-mola</span>
                      <span className="mt-2 text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">Indisponível</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedPaymentMethod === 'mpesa' && (
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Telefone M-Pesa
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      +258
                    </span>
                    <input
                      type="tel"
                      id="phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').substring(0, 9))}
                      className="flex-1 p-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ex: 84XXXXXXX"
                      maxLength={9}
                      required
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Você receberá uma solicitação de pagamento no seu M-Pesa.
                  </p>
                </div>
              )}
              
              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  onClick={() => {
                    setStep(1);
                    setErrorMessage('');
                  }}
                >
                  Voltar
                </button>
                
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors flex items-center justify-center"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processando...
                    </>
                  ) : (
                    'Continuar'
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}