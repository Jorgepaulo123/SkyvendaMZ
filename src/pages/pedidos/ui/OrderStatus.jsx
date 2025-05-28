import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, Truck, XCircle,Check } from 'lucide-react';
import { useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

export const OrderStatus = ({ order }) => {
  const {user}=useAuth()
  useEffect(()=>{
    console.log(order.status)
  },[order])
  if (order.status=="concluido") {
    return (
      <Badge className="bg-green-100 text-green-700 hover:bg-white">
        <Check className="w-4 h-4 mr-1" />
        Concluido
      </Badge>
    );
  }
  if (order.recebido_pelo_cliente) {
    return (
      <Badge className="bg-green-100 text-green-800">
        <CheckCircle2 className="w-4 h-4 mr-1" />
        Entregue
      </Badge>
    );
  }



  if (order.status === "pendente") {
    return (
      <Badge variant="secondary">
        <Clock className="w-4 h-4 mr-1" />
        Pendente
      </Badge>
    );
  }
  if (order.status === "recusado") {
    return (
      <Badge variant="destructive">
        <XCircle className="w-4 h-4 mr-1" />
        {user?.id_unico===order?.id_vendedor? "Você recusou o pedido" : `${order?.nome_vendedor} recusou o pedido`}
      </Badge>
    );
  }
  if (order.status === "cancelado") {
    return (
      <Badge variant="destructive">
      <XCircle className="w-4 h-4 mr-1" />
      Cancelado
    </Badge>
    );
  }
  
  

  return null
};