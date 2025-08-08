import React, { useContext, useEffect, useState } from 'react';
import api from '../../api/api';
import { useSearchParams } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();
  const { myorders } = useContext(HomeContext);
  const [isSale, setIsSale] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const loadOrder = () => {
      if (myorders) {
        const currentOrder = myorders.find(order => order.id == id);
        console.log(currentOrder);
        if (currentOrder) {
          setOrder(currentOrder);
          setIsSale(currentOrder.venda === "venda");
        }
      }
      setLoading(false);
    };

    loadOrder();
      }, [id, myorders]);

  useEffect(() => {
    if (!loading && order && searchParams.get('openModal') === 'true' && user?.id_unico === order?.id_vendedor) {
      setShowModal(true);
    }
  }, [loading, order, searchParams, user]);

  const handleConfirmDelivery = async () => {
    setSubmitting(true);
    setErrorMsg("");
    try {
      const res = await api.post(`/pedidos/${order.id}/confirmar-entrega/`, null, {
        params: { codigo: codeInput },
        headers: { Authorization: `Bearer ${token}` },
      });

      const { data } = res;
      alert(data?.mensagem || "Entrega confirmada");
      window.location.reload();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setErrorMsg("");
    setCodeInput("");
  };

  const renderOrderActions = () => {
    if (order.status === "recusado") {
      return (
        <div className="mt-4 text-center text-red-600 font-semibold">
          {user?.id_unico === order?.id_vendedor 
            ? "Você recusou o pedido" 
            : `${order?.nome_vendedor} recusou o pedido`
          }
        </div>
      );
    }

    if (order.status === "cancelado") {
      return (
        <div className="mt-4 flex flex-col items-center text-red-600 font-semibold space-y-2">
          <div className='flex items-center gap-2'>
            <Info />
            Pedido Cancelado
          </div>
          <button className='rounded-md bg-red-50 px-4 py-2 border-red-300 border text-red-500'>
            Deletar o pedido
          </button>
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

      // Mostrar código ao comprador, se disponível
      if (order.codigo_entrega) {
        return (
          <div className="p-6 bg-green-50 rounded-md text-center space-y-4">
            <p className="text-gray-700">Este é o seu código de entrega. Forneça-o apenas quando receber o produto:</p>
            <p className="text-3xl font-mono tracking-widest text-green-700 select-all">{order.codigo_entrega}</p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(order.codigo_entrega);
                alert('Código copiado!');
              }}
              className="inline-flex items-center px-3 py-1.5 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-sm"
            >
              Copiar código
            </button>
          </div>
        );
      }
    } else if (isSale && order.status === "aceite") {
      // Vendedor vê o código e botão para confirmar entrega
      return (
        <div className="p-6 space-y-4 text-center">
          <p className="text-gray-700">Clique para confirmar a entrega com o código fornecido pelo cliente.</p>
          <button
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition-colors"
            onClick={() => setShowModal(true)}
          >
            Confirmar entrega
          </button>
        </div>
      );
    } else if (order.status === "aguardando") {
      return (
        <div className="mt-4 text-center text-amber-600 font-semibold">
          Aguardando o cliente confirmar o recebimento
        </div>
      );
    }

    return null;
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modal para confirmar entrega */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm space-y-4">
            <h2 className="text-lg font-semibold">Confirmar entrega</h2>
            <p className="text-sm text-gray-600">
              Digite o código de 6 dígitos fornecido ao cliente.
            </p>
            <input
              type="text"
              maxLength="6"
              value={codeInput}
              onChange={e => setCodeInput(e.target.value.replace(/[^0-9]/g, ""))}
              className="border rounded px-3 py-2 w-full text-center tracking-widest font-mono"
              placeholder="000000"
            />
            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
                onClick={handleCloseModal}
              >
                Cancelar
              </button>
              <button
                disabled={codeInput.length !== 6 || submitting}
                onClick={handleConfirmDelivery}
                className={`px-4 py-2 rounded-md text-white transition-colors ${
                  codeInput.length !== 6 || submitting 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {submitting ? "Enviando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo principal */}
      <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg">
        <div className="p-6">
          <OrderStatus currentStatus={order.status} />
          {renderOrderActions()}

          <div className="mt-8 space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalhes do Pedido</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {new Date(order.data_pedido).toLocaleDateString('pt-BR')}
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