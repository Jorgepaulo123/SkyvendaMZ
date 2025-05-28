import React, { useState } from 'react';
import { ProductCardSkeleton2 } from '@/components/skeleton/productcardskeleton2';
import ProductCard from './ui/productcard';

export default function Page1({ loading, myproducts, handleEdit, handleTurbo }) {
  // Estado para armazenar o termo de busca
  const [searchTerm, setSearchTerm] = useState('');

  // Função para filtrar produtos com base no termo de busca
  const filteredProducts = myproducts.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow h-[calc(100vh-100px)] overflow-y-hidden">
      {/* Cabeçalho */}
      <div className="p-4 border-b flex items-center justify-between">
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
                />
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
