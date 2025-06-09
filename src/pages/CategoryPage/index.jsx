import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Layout from '../../layout/layout';

function CategoryPage() {
  const { categoria, subcategoria } = useParams();
  const location = useLocation();
  const searchResults = location.state?.searchResults || [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Cabeçalho de Resultados */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">Resultado de busca</h1>
          <p className="text-gray-600">
            Você pesquisou por: {categoria} {subcategoria && `> ${subcategoria}`}
          </p>
        </div>

        {/* Resultados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {searchResults.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden relative">
              {/* Badge de Estado */}
              {product.state && (
                <div className="absolute top-2 left-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {product.state}
                  </span>
                </div>
              )}
              
              {/* Botão de Favorito */}
              <button className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100">
                <Heart className={`w-5 h-5 ${product.liked ? 'fill-current text-red-500' : 'text-gray-400'}`} />
              </button>

              {/* Imagem do Produto */}
              <div className="aspect-w-1 aspect-h-1">
                <img
                  src={product.thumb}
                  alt={product.title}
                  className="w-full h-64 object-cover"
                />
              </div>

              {/* Informações do Produto */}
              <div className="p-4">
                {/* Usuário */}
                <div className="flex items-center mb-2">
                  <img
                    src={product.user.avatar}
                    alt={product.user.name}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  <span className="text-sm text-gray-600">{product.user.name}</span>
                </div>

                {/* Título e Preço */}
                <h3 className="text-lg font-medium mb-1">{product.title}</h3>
                <p className="text-xl font-bold text-purple-600">{product.price.toLocaleString('pt-MZ')} MT</p>

                {/* Localização */}
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {product.province}, {product.district}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensagem quando não há resultados */}
        {searchResults.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Nenhum produto encontrado para esta categoria.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default CategoryPage;
