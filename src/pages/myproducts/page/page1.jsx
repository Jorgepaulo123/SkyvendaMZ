import React, { useState } from 'react';
import { ProductCardSkeleton2 } from '@/components/skeleton/productcardskeleton2';
import ProductCard from './ui/productcard';

export default function Page1({ loading, myproducts = [], handleEdit, handleTurbo, onProductUpdate }) {
  // Estado para armazenar o termo de busca
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos'); // todos | activos | desativados | autorenovacao

  // Função para filtrar produtos com base no termo de busca
  const filteredProducts = myproducts
    .filter(Boolean)
    .filter((product) => {
      const title = product?.title?.toLowerCase() || '';
      const matchesSearch = title.includes(searchTerm.toLowerCase());
      const isActive = Boolean(product?.ativo ?? product?.active ?? false);
      const isAutoRenew = Boolean(product?.autorenovacao ?? product?.auto_renovacao ?? product?.autoRenew ?? false);
      const matchesStatus =
        statusFilter === 'todos' ||
        (statusFilter === 'activos' && isActive) ||
        (statusFilter === 'desativados' && !isActive) ||
        (statusFilter === 'autorenovacao' && isAutoRenew);
      return matchesSearch && matchesStatus;
    });

  // Contadores para tabs
  const counts = (myproducts || []).reduce(
    (acc, p) => {
      const isActive = Boolean(p?.ativo ?? p?.active ?? false);
      const isAutoRenew = Boolean(p?.autorenovacao ?? p?.auto_renovacao ?? p?.autoRenew ?? false);
      acc.todos += 1;
      if (isActive) acc.activos += 1;
      else acc.desativados += 1;
      if (isAutoRenew) acc.autorenovacao += 1;
      return acc;
    },
    { todos: 0, activos: 0, desativados: 0, autorenovacao: 0 }
  );

  return (
    <div className="bg-white rounded-lg shadow h-[calc(100vh-100px)] overflow-y-hidden">
      {/* Cabeçalho */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Meus Produtos</h2>
          {/* Campo de busca */}
          <input
            type="text"
            placeholder="Pesquisar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-lg px-4 py-2 text-sm w-64 focus:ring focus:ring-blue-300"
          />
        </div>
        {/* Filtros por status */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {[
            { key: 'todos', label: `Todos (${counts.todos})` },
            { key: 'activos', label: `Activos (${counts.activos})` },
            { key: 'desativados', label: `Desativados (${counts.desativados})` },
            { key: 'autorenovacao', label: `Auto-renovação (${counts.autorenovacao})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                statusFilter === tab.key
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-4 max-h-[calc(100vh-180px)] overflow-y-scroll">
        {/* Exibe skeletons durante o carregamento */}
        {loading ? (
          [...Array(12)].map((_, index) => (
            <ProductCardSkeleton2 key={index} />
          ))
        ) : (
          <>
            {/* Exibe mensagem quando não há produtos */}
            {filteredProducts.length === 0 ? (
              <div className="flex justify-center items-center col-span-full">
                <p className="text-gray-500">Nenhum produto encontrado</p>
              </div>
            ) : (
              /* Renderiza os produtos filtrados */
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEdit}
                  onTurbo={handleTurbo}
                  onDelete={() => handleDelete(product.slug, product.title)}
                  onProductUpdate={onProductUpdate}
                />
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
