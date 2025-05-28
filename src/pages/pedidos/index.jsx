import React, { useState, useEffect, useContext } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import api from "../../api/api";
import { useAuth } from '../../context/AuthContext';
import { OrdersTable } from './ui/OrdersTable';
import { OrdersTableSkeleton } from './ui/Ordertabbleskeleton';
import { HomeContext } from '../../context/HomeContext';
import { useToast } from '../../hooks/use-toast';

export default function Pedidos() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('todos');
  const { token } = useAuth();
  const { myorders, addOrders } = useContext(HomeContext);
  const [loading, setLoading] = useState(true);
  const [cancelLoading,setCancelLoading] =useState(false)
  const [accepting,setAccepting]=useState(false)
const {toast}=useToast()

  useEffect(() => {
    if (!token && orders) return;
    if (myorders?.length >= 1) {
      setOrders(myorders);
      setLoading(false);
      console.log(myorders)
    } else {
      setLoading(true);
      api
        .get('/pedidos/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setOrders(res.data);
          console.log(myorders)
          addOrders(res.data);
        })
        .catch((err) => {
          console.error(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [token]);

  const handleAcceptOrder =(orderId) => {
    setAccepting(true)
    api.post(`pedidos/${orderId}/confirmar/`,{},{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res)=>{
      const updatedOrders = orders.map((order) =>
        order.id === orderId ? { ...order, aceito_pelo_vendedor: true,status: "Concluido" } : order
      );
      setOrders(updatedOrders)
    }).catch(err=>{
      console.log(err)
    }).finally(()=>{
      setTimeout(() => {
        setAccepting(false)
      }, 1000);
    })
    
  };

  const handleRejectOrder = async (orderId) => {

    api.put(`/pedidos/${orderId}/recusar`,{},{
      headers:{
        Authorization:`Bearer ${token}`
      }
    }).then(res=>{
      const updatedOrders = orders.map((order) =>
        order.id === orderId ? { ...order, status: 'recusado',aceito_pelo_vendedor:false } : order
      );
      setOrders(updatedOrders);
    }).catch(err=>{
      console.log(err)
    })
  };
  const handleCancel=(orderId)=>{
    setCancelLoading(true)
    api.put(`/pedidos/${orderId}/cancelar`,{},{
      headers:{
        Authorization:`Bearer ${token}`
      }
    }).then(res=>{
      const updatedOrders = orders.map((order) =>
        order.id === orderId ? { ...order, status: 'cancelado' } : order
      );
      setOrders(updatedOrders);
      toast({
        title:"Pedido Cancelado",
        description:"O pedido foi cancelado com exito"
      })
    }).catch(err=>{
      toast({
        title:"Desculpe",
        description:"nao foi possivel cancelar o pedido"
      }).finally(()=>setCancelLoading(false))
    })
  }

  const handleConfirmEntrega = async (orderId) => {
    try {
      await api.put(`/pedidos/${orderId}/entrega`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedOrders = orders.map((order) =>
        order.id === orderId ? { ...order, status: 'aguardando_confirmacao' } : order
      );
      setOrders(updatedOrders);
      toast({ title: 'Entrega confirmada com sucesso!' });
    } catch (err) {
      toast({ title: 'Erro ao confirmar entrega', description: err.message });
    }
  };

  const handleConfirmRecebimento = async (orderId) => {
    try {
      await api.put(`/pedidos/${orderId}/confirmar-recebimento`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedOrders = orders.map((order) =>
        order.id === orderId ? { ...order, status: 'concluido' } : order
      );
      setOrders(updatedOrders);
      toast({ title: 'Recebimento confirmado e saldos liberados com sucesso.' });
    } catch (err) {
      toast({ title: 'Erro ao confirmar recebimento', description: err.message });
    }
  };

  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      order.id.toString().includes(searchLower) ||
      order.nome_vendedor.toLowerCase().includes(searchLower) ||
      order.nome_comprador.toLowerCase().includes(searchLower);

    if (!matchesSearch) return false;

    switch (activeTab) {
      case 'vendas':
        return order.venda === 'venda';
      case 'compras':
        return order.compra === 'compra';
      case 'pendentes':
        return order.status === 'Pendente';
      default:
        return true;
    }
  });

  return (
    <div className="p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow h-[calc(100vh-80px)] overflow-y-auto">
        {/* Header with search - responsive */}
        <div className="p-3 sm:p-4 border-b sticky top-0 bg-white z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Meus Pedidos</h1>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Buscar pedidos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Tabs and content - responsive */}
        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          <Tabs defaultValue="todos" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 text-xs sm:text-sm">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="vendas">Vendas</TabsTrigger>
              <TabsTrigger value="compras">Compras</TabsTrigger>
              <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
            </TabsList>

            {['todos', 'vendas', 'compras', 'pendentes'].map((tab) => (
              <TabsContent value={tab} key={tab} className="mt-4 sm:mt-6">
                {loading ? (
                  <OrdersTableSkeleton />
                ) : (
                  <OrdersTable
                    orders={filteredOrders}
                    onAcceptOrder={handleAcceptOrder}
                    onRejectOrder={handleRejectOrder}
                    loadingAccept={accepting}
                    loadingCancel={cancelLoading}
                    onCancel={handleCancel}
                    onConfirmEntrega={handleConfirmEntrega}
                    onConfirmRecebimento={handleConfirmRecebimento}
                  />
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
