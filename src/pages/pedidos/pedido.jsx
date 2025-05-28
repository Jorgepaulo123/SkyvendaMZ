import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, Clock, Info, Package, Send, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { HomeContext } from '../../context/HomeContext';

const OrderStatus = ({ currentStatus }) => {
  const statuses = [
    { key: 'pendente', label: 'Pendente', icon: ShoppingCart },
    { key: 'aceite', label: 'Aceite', icon: Clock },
    { key: 'aguardando', label: 'Aguardando Confirmação', icon: Package },
    { key: 'entregue', label: 'Entregue', icon: Send },
    { key: 'concluido', label: 'Concluído', icon: CheckCircle2 },
  ];

  const getCurrentStep = () => {
    const statusIndex = statuses.findIndex(s => s.key === currentStatus);
    return statusIndex === -1 ? 0 : statusIndex;
  };

  const step = getCurrentStep();

  return (
    <div className="w-full py-6">
      <div className="flex items-center">
        {statuses.map((status, index) => {
          const Icon = status.icon;
          const isActive = index <= step;
          const isLast = index === statuses.length - 1;

          return (
            <React.Fragment key={status.key}>
              <div className="relative flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isActive ? 'bg-indigo-600' : 'bg-gray-200'
                  } transition-colors duration-300`}
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                </div>
                <div className="mt-2 text-center">
                  <span className={`text-sm font-medium ${isActive ? 'text-indigo-600' : 'text-gray-500'}`}>
                    {status.label}
                  </span>
                </div>
              </div>
              {!isLast && (
                <div
                  className={`h-1 flex-1 ${
                    index < step ? 'bg-indigo-600' : 'bg-gray-200'
                  } transition-colors duration-300`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default function Pedido() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token,user } = useAuth();
  const { myorders } = useContext(HomeContext);
  const [isSale, setIsSale] = useState(false);

  useEffect(() => {
    const loadOrder = () => {
      if (myorders) {
        const currentOrder = myorders.find(order => order.id == id);
        console.log(currentOrder)
        if (currentOrder) {
          setOrder(currentOrder);
          setIsSale(currentOrder.venda === "venda");
        }
      }
      setLoading(false);
    };

    loadOrder();
  }, [id, myorders]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Pedido não encontrado</p>
      </div>
    );
  }

  const renderOrderActions = () => {
    if (order.status === "recusado") {
      return (
        <div className="mt-4 text-center text-red-600 font-semibold">
        {user?.id_unico===order?.id_vendedor? "Você recusou o pedido" : `${order?.nome_vendedor} recusou o pedido`}
        </div>
      );
    }
    if (order.status === "cancelado") {
      return (
        <div className="mt-4 flex flex-col items-center text-red-600 font-semibold space-y-2">
        <div className='flex items-center gap-2'><Info/>Pedido Cancelado</div>
        <button className='rounded-md bg-red-50  px-4 py-2 border-red-300 border text-red-500'>deletar o pedido</button>
        </div>
      );
    }
    if (!isSale) {
      if (order.status === "pendente") {
        return (
          <div className="p-6">
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors">
              Cancelar o pedido
            </button>
          </div>
        );
      }
      
      if (order.status === "aguardando") {
        return (
          <div className="p-6">
            <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition-colors">
              Confirmar o recebimento
            </button>
          </div>
        );
      }

      
    } else if (order.status === "aguardando") {
      return (
        <div className="mt-4 text-center text-amber-600 font-semibold">
          Aguardando o cliente confirmar o recebimento
        </div>
      );
    }

    return null;
  };

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow h-[calc(100vh-100px)] overflow-y-auto">
        <div className="p-4 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between gap-2">
            <button 
              className="text-gray-900 hover:text-indigo-600 transition-colors" 
              onClick={() => window.history.back()}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900">Pedido</h1>
            <div className="w-6" />
          </div>
        </div>

        <div className="p-6">
          <OrderStatus currentStatus={order.status} />
          {renderOrderActions()}

          <div className="mt-8 space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalhes do Pedido</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Produto</p>
                  <p className="font-medium">{order.nome}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Preço Total</p>
                  <p className="font-medium">
                    {order.preco_total.toLocaleString('pt-BR', { 
                      style: 'currency', 
                      currency: 'MZN' 
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vendedor</p>
                  <p className="font-medium">{order.nome_vendedor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data do Pedido</p>
                  <p className="font-medium">
                    {new Date(order.data_pedido).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}