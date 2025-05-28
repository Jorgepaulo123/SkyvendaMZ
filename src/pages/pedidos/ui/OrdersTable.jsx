import React from 'react';
import { AlertCircle, Eye } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { OrderStatus } from './OrderStatus';
import { formatCurrency } from '../../../lib/utils';
import { Link } from 'react-router-dom';
import { base_url } from '../../../api/api';
import { useAuth } from '../../../context/AuthContext';

export const OrdersTable = ({ orders, onAcceptOrder, onRejectOrder, loadingAccept, onCancel, loadingCancel, onConfirmEntrega, onConfirmRecebimento }) => {
  const { user } = useAuth();

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhum pedido encontrado</h3>
        <p className="mt-1 text-sm text-gray-500">
          Não existem pedidos que correspondam aos critérios de busca.
        </p>
      </div>
    );
  }

  // Action buttons component to avoid code duplication
  const ActionButtons = ({ order }) => (
    <>
      {order.status === "pendente" && !order.aceito_pelo_vendedor && (
        <div className="flex flex-wrap gap-2">
          {order?.compra ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel(order.id)}
              className="bg-red-50 text-red-700 hover:bg-red-100 text-xs"
            >
              {!loadingCancel ? <>Cancelar</> : <>Processando...</>}
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAcceptOrder(order.id)}
                className="bg-green-50 text-green-700 hover:bg-green-100 text-xs"
              >
                {!loadingAccept ? <>Aceitar</> : <>Processando...</>}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRejectOrder(order.id)}
                className="bg-orange-50 text-orange-700 hover:bg-orange-100 text-xs"
              >
                Rejeitar
              </Button>
            </>
          )}
        </div>
      )}
      {order.status === "aceite" && order.aceito_pelo_vendedor && (
        <div className="flex flex-wrap gap-2">
          {user?.id_unico === order.id_vendedor && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onConfirmEntrega(order.id)}
              className="bg-green-50 text-green-700 hover:bg-green-100 text-xs"
            >
              Confirmar Entrega
            </Button>
          )}
          {user?.id_unico === order.id_comprador && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel(order.id)}
              className="bg-red-50 text-red-700 hover:bg-red-100 text-xs"
            >
              Cancelar
            </Button>
          )}
        </div>
      )}
      {order.status === "aguardando_confirmacao" && user?.id_unico === order.id_comprador && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onConfirmRecebimento(order.id)}
          className="bg-green-50 text-green-700 hover:bg-green-100 text-xs"
        >
          Confirmar Recebimento
        </Button>
      )}
      {order.status === "cancelado" && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDeleteOrder(order.id)}
          className="bg-red-50 text-red-700 hover:bg-red-100 text-xs"
        >
          Deletar
        </Button>
      )}
    </>
  );

  // Mobile view - Card layout
  const MobileOrderCards = () => (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex items-center p-3 border-b border-gray-100">
            <img
              src={order.foto_capa} // Usando diretamente a URL completa
              alt="Produto"
              onError={(e) => e.target.src = `${base_url}/default.png`}
              className="w-16 h-16 rounded-md object-cover mr-3"
            />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">{order.nome_vendedor}</p>
                  <p className="text-xs text-gray-500">Para: {order.nome_comprador}</p>
                </div>
                <OrderStatus order={order} />
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm font-bold">{formatCurrency(order.preco_total)}</p>
                <p className="text-xs text-gray-500">
                  {new Date(order.data_pedido).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-3 flex justify-between items-center bg-gray-50">
            <div className="flex-1">
              <ActionButtons order={order} />
            </div>
            <Link to={`/pedido/${order.id}`} className="ml-2 p-2 bg-blue-50 rounded-full">
              <Eye className="h-4 w-4 text-blue-600" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );

  // Desktop view - Table layout
  const DesktopOrderTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Produto</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Vendedor</TableHead>
          <TableHead>Comprador</TableHead>
          <TableHead>Quantidade</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ações</TableHead>
          <TableHead>Detalhes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>
              <img
                src={order.foto_capa} // Usando diretamente a URL completa
                alt="Produto"
                onError={(e) => e.target.src = `${base_url}/default.png`}
                className="w-12 h-12 rounded-md object-cover"
              />
            </TableCell>
            <TableCell>
              {new Date(order.data_pedido).toLocaleDateString('pt-BR')}
            </TableCell>
            <TableCell>{order.nome_vendedor}</TableCell>
            <TableCell>{order.nome_comprador}</TableCell>
            <TableCell>{order.quantidade}</TableCell>
            <TableCell>{formatCurrency(order.preco_total)}</TableCell>
            <TableCell>
              <OrderStatus order={order} />
            </TableCell>
            <TableCell>
              <ActionButtons order={order} />
            </TableCell>
            <TableCell>
              <Link to={`/pedido/${order.id}`}>
                <Eye className="h-5 w-5" />
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <>
      {/* Mobile view */}
      <div className="md:hidden">
        <MobileOrderCards />
      </div>
      
      {/* Desktop view */}
      <div className="hidden md:block">
        <DesktopOrderTable />
      </div>
    </>
  );
};