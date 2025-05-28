import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Skeleton from "../../components/Skeleton";
import api from "../../api/api";
import { ModernCard } from "../../components/cards/ModernCard";
import ProductCard2 from "../../components/cards/ProductCard2";
import ProductCardSkeleton from "../../components/skeleton/productCard2Sqkeleton";


const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q"); // Obtém o termo de busca da URL
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(`/produtos/pesquisa/?termo=${query}&page=1&limit=10`);
        setProducts(response.data);
      } catch (err) {
        setError("Erro ao carregar os resultados. Por favor, tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return (

      <div className="bg-white h-[100vh] w-full overflow-auto py-10">
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-8 mt-8 container mx-auto">
        {[...Array(4)].map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
      ) : error ? (
        <div className="text-red-500 text-center container mx-auto">
          <p>{error}</p>
        </div>
      ) : products.length > 0 ? (
        <div className="container mx-auto">
          <h1 className="text-xl font-bold mb-4">Resultado de busca</h1>
          <p className="mb-6">Você pesquisou por: <strong>{query}</strong></p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 ">
        {products?.map(product => (
          <ProductCard2 key={product.id} product={product} />
        ))}
      </div>
        </div>
      ) : (
        <div className="text-gray-600 text-center">
          <p>Nenhum resultado encontrado para: <strong>{query}</strong></p>
        </div>
      )}
    </div>
  );
};

export default Search;
