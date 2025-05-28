import React from 'react';
import { FaPaypal, FaCcVisa, FaCcMastercard } from 'react-icons/fa';
import { SiMoneygram } from 'react-icons/si';
import { BsBank } from 'react-icons/bs';

export default function PaymentMethods() {
  const paymentMethods = [
    {
      id: 'mpesa',
      name: 'M-Pesa',
      description: 'Depósito e saque instantâneo via celular',
      icon: <img 
        src="https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/35/b8/06/35b80684-5547-d7a5-0a0d-919fa3d073d1/AppIcon-mz-0-0-1x_U007emarketing-0-5-0-0-85-220.png/434x0w.webp" 
        alt="M-Pesa" 
        className="w-6 h-6 object-contain"
      />,
      color: 'bg-white',
      limits: 'Limite de até 25.000 MTn por dia',
      timeframe: 'Processamento instantâneo',
      fees: '2% de taxa para depósitos e saques'
    },
    {
      id: 'emola',
      name: 'E-mola',
      description: 'Transferência de dinheiro via celular',
      icon: <img 
        src="https://play-lh.googleusercontent.com/iqKeCVTHvdTVoAg-YGmC5cxA83JmjkwaTJ0r6_sls1wANm_v1SVId3zaNe4xA_qfi9B2" 
        alt="E-mola" 
        className="w-6 h-6 object-contain"
      />,
      color: 'bg-white',
      limits: 'Limite de até 20.000 MTn por dia',
      timeframe: 'Processamento em poucos minutos',
      fees: '2.5% de taxa para depósitos e saques'
    },
    {
      id: 'visa',
      name: 'Visa',
      description: 'Pagamento com cartão de crédito/débito',
      icon: <FaCcVisa size={24} />,
      color: 'bg-blue-700',
      limits: 'Limite definido pelo seu banco',
      timeframe: 'Depósitos processados em até 24h',
      fees: '2.9% + 10 MTn para depósitos'
    },
    {
      id: 'mastercard',
      name: 'Mastercard',
      description: 'Pagamento com cartão de crédito/débito',
      icon: <FaCcMastercard size={24} />,
      color: 'bg-red-500',
      limits: 'Limite definido pelo seu banco',
      timeframe: 'Depósitos processados em até 24h',
      fees: '2.9% + 10 MTn para depósitos'
    },
    {
      id: 'bank',
      name: 'Transferência Bancária',
      description: 'Transferência direta para sua conta',
      icon: <BsBank size={24} />,
      color: 'bg-blue-600',
      limits: 'Sem limites para transferências',
      timeframe: 'Saques processados em 1-3 dias úteis',
      fees: '1% para saques (mín. 50 MTn)'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pagamento online internacional',
      icon: <FaPaypal size={24} />,
      color: 'bg-blue-600',
      limits: 'Limite definido pela sua conta PayPal',
      timeframe: 'Processamento em até 48h',
      fees: '3.5% + taxa de conversão para depósitos'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-6">Métodos de Pagamento Aceitos</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paymentMethods.map((method) => (
            <div key={method.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className={`${method.color} text-white p-4 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  {method.icon}
                  <span className={`font-semibold ${method.id === 'mpesa' || method.id === 'emola' ? 'text-gray-800' : ''}`}>{method.name}</span>
                </div>
                {method.id === 'mpesa' && (
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-medium">Popular</span>
                )}
              </div>
              <div className="p-4 space-y-3">
                <p className="text-gray-600">{method.description}</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Limites:</span>
                    <span className="text-gray-700">{method.limits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tempo:</span>
                    <span className="text-gray-700">{method.timeframe}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Taxas:</span>
                    <span className="text-gray-700">{method.fees}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">Informações Importantes</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
            <li>As taxas podem variar de acordo com promoções e estado da conta.</li>
            <li>Os limites de transação estão sujeitos às políticas dos provedores de pagamento.</li>
            <li>Para transferências bancárias superiores a 50.000 MTn, entre em contato com o suporte.</li>
            <li>Certifique-se de que o nome do titular da conta corresponda ao seu nome registrado na SkyVenda.</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 