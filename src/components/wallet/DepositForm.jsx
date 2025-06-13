import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { FaPaypal, FaCcVisa, FaCcMastercard } from 'react-icons/fa';
import { SiMoneygram } from 'react-icons/si';
import { toast } from 'react-hot-toast';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';

export default function DepositForm() {
  const { token, user } = useAuth();
  const [depositAmount, setDepositAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('mpesa');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [step, setStep] = useState(1);
  
  const resetForm = () => {
    setDepositAmount('');
    setPhoneNumber('');
    setCardNumber('');
    setCardHolder('');
    setExpiryDate('');
    setCvv('');
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

    if (selectedPaymentMethod === 'mpesa' || selectedPaymentMethod === 'emola') {
      if (!phoneNumber || !/^[0-9]{9}$/.test(phoneNumber)) {
        setErrorMessage('Por favor, insira um número de telefone válido (9 dígitos)');
        return;
      }
    }

    if (selectedPaymentMethod === 'visa' || selectedPaymentMethod === 'mastercard') {
      if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
        setErrorMessage('Por favor, preencha todos os campos do cartão');
        return;
      }
      
      // Validações simples do cartão
      if (!/^[0-9]{16}$/.test(cardNumber.replace(/\s/g, ''))) {
        setErrorMessage('Número de cartão inválido');
        return;
      }
      
      if (!/^[0-9]{3,4}$/.test(cvv)) {
        setErrorMessage('CVV inválido');
        return;
      }
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      if (selectedPaymentMethod === 'mpesa') {
        if (!user?.id) {
          throw new Error('ID do usuário não encontrado');
        }
        const url = `/usuario/${user.id}/adicionar_saldo/?msisdn=258${phoneNumber}&valor=${depositAmount}`;
        const response = await api.post(url, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        toast.success(`Depósito de ${depositAmount} MTn iniciado com sucesso!`);
        setSuccessMessage(`Depósito de ${depositAmount} MTn iniciado com sucesso! Aguarde a confirmação.`);
        resetForm();
      } else {
        // Simulação de processamento para outros métodos
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast.success(`Depósito de ${depositAmount} MTn iniciado com sucesso!`);
        setSuccessMessage(`Depósito de ${depositAmount} MTn iniciado com sucesso! Aguarde a confirmação.`);
        resetForm();
      }
      
    } catch (error) {
      console.error('Erro ao processar depósito:', error);
      if (error.message === 'ID do usuário não encontrado') {
        setErrorMessage('Erro de autenticação. Por favor, faça login novamente.');
      } else {
        setErrorMessage(error.response?.data?.detail || 'Ocorreu um erro ao processar seu depósito. Por favor, tente novamente.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    setExpiryDate(value);
  };

  return (
    <div className="space-y-6">
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
                    className={`border p-4 rounded-lg cursor-pointer transition-all ${
                      selectedPaymentMethod === 'emola' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'
                    }`}
                    onClick={() => setSelectedPaymentMethod('emola')}
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
                    </div>
                  </div>
                  
                  <div
                    className={`border p-4 rounded-lg cursor-pointer transition-all ${
                      selectedPaymentMethod === 'visa' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'
                    }`}
                    onClick={() => setSelectedPaymentMethod('visa')}
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="bg-blue-700 text-white p-2 rounded-full mb-2">
                        <FaCcVisa size={20} />
                      </div>
                      <span className="text-sm font-medium">Visa</span>
                    </div>
                  </div>
                  
                  <div
                    className={`border p-4 rounded-lg cursor-pointer transition-all ${
                      selectedPaymentMethod === 'mastercard' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'
                    }`}
                    onClick={() => setSelectedPaymentMethod('mastercard')}
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="bg-red-500 text-white p-2 rounded-full mb-2">
                        <FaCcMastercard size={20} />
                      </div>
                      <span className="text-sm font-medium">Mastercard</span>
                    </div>
                  </div>
                  
                  <div
                    className={`border p-4 rounded-lg cursor-pointer transition-all ${
                      selectedPaymentMethod === 'paypal' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'
                    }`}
                    onClick={() => setSelectedPaymentMethod('paypal')}
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="bg-blue-600 text-white p-2 rounded-full mb-2">
                        <FaPaypal size={20} />
                      </div>
                      <span className="text-sm font-medium">PayPal</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {(selectedPaymentMethod === 'mpesa' || selectedPaymentMethod === 'emola') && (
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Telefone {selectedPaymentMethod === 'mpesa' ? 'M-Pesa' : 'E-mola'}
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
                    {selectedPaymentMethod === 'mpesa' 
                      ? 'Você receberá uma solicitação de pagamento no seu M-Pesa.' 
                      : 'Você receberá uma solicitação de pagamento no seu E-mola.'}
                  </p>
                </div>
              )}
              
              {(selectedPaymentMethod === 'visa' || selectedPaymentMethod === 'mastercard') && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Número do Cartão
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome no Cartão
                    </label>
                    <input
                      type="text"
                      id="cardHolder"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="NOME COMO ESTÁ NO CARTÃO"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Data de Validade
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        value={expiryDate}
                        onChange={handleExpiryDateChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="MM/AA"
                        maxLength={5}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="123"
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {selectedPaymentMethod === 'paypal' && (
                <div className="p-4 text-center">
                  <FaPaypal size={40} className="mx-auto mb-4 text-blue-600" />
                  <p className="text-gray-700">
                    Ao clicar em "Continuar", você será redirecionado para o PayPal para completar o pagamento.
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