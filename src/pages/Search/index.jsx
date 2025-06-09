import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Skeleton from "../../components/Skeleton";
import api from "../../api/api";
import { ModernCard } from "../../components/cards/ModernCard";
import ProductCard2 from "../../components/cards/ProductCard2";
import ProductCardSkeleton from "../../components/skeleton/productCard2Sqkeleton";
import { Search as SearchIcon, TrendingUp, Clock, Tag } from 'lucide-react';
import AdsMore from '../../components/ads/ads';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q"); // Obtém o termo de busca da URL
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [suggestedSearches, setSuggestedSearches] = useState([
    'Celulares', 'Laptops', 'Carros', 'Casas', 'Roupas', 'Móveis', 'Eletrodomésticos'
  ]);

  // Carregar histórico de pesquisa do localStorage
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(history.slice(0, 5)); // Limitar a 5 itens

    // Salvar pesquisa atual no histórico
    if (query && query.trim() !== '') {
      const newHistory = [query, ...history.filter(item => item !== query)].slice(0, 10);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }
  }, [query]);

  useEffect(() => {
    if (!query) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Limpar e sanitizar a query para evitar problemas
        const cleanQuery = query.trim().replace(/[^\w\s\-áàâãéèêíìîóòôõúùûçÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ]/g, '');
        if (!cleanQuery) {
          // Se a query ficou vazia após limpeza, buscar apenas produtos populares
          const popularResponse = await api.get('/produtos/populares?limit=12');
          setPopularProducts(popularResponse.data || []);
          setProducts([]);
          setLoading(false);
          return;
        }

        // Buscar produtos com o termo exato - usando encodeURIComponent para tratar caracteres especiais
        const encodedQuery = encodeURIComponent(cleanQuery);
        let response;
        try {
          response = await api.get(`/produtos/pesquisa/?termo=${encodedQuery}&page=1&limit=10`);
        } catch (searchError) {
          console.error('Erro na busca principal:', searchError);
          // Tratar o erro mas continuar a execução
          response = { data: [] };
        }
        
        setProducts(response.data || []);

        // Buscar produtos populares em paralelo (sempre mostra, mesmo com resultados)
        let popularProducts = [];
        try {
          const popularResponse = await api.get('/produtos/populares?limit=8');
          popularProducts = popularResponse.data || [];
          setPopularProducts(popularProducts);
        } catch (popularError) {
          console.error('Erro ao buscar produtos populares:', popularError);
        }

        // Se não encontrou produtos, buscar produtos sugeridos
        if (!response.data || response.data.length === 0) {
          // Buscar produtos com termos relacionados
          // Dividir a query em palavras e buscar por cada uma
          const words = cleanQuery.split(' ').filter(word => word.length > 3);
          if (words.length > 0) {
            try {
              const encodedWord = encodeURIComponent(words[0].trim());
              const suggestedResponse = await api.get(`/produtos/pesquisa/?termo=${encodedWord}&page=1&limit=8`);
              setSuggestedProducts(suggestedResponse.data || []);
            } catch (suggestedError) {
              console.error('Erro ao buscar produtos sugeridos:', suggestedError);
              setSuggestedProducts([]);
            }
          }
        }
      } catch (err) {
        console.error('Erro geral na pesquisa:', err);
        setError("Erro ao carregar os resultados. Por favor, tente novamente.");
        // Tentar carregar produtos populares mesmo em caso de erro
        try {
          const fallbackResponse = await api.get('/produtos/populares?limit=8');
          setPopularProducts(fallbackResponse.data || []);
        } catch (fallbackError) {
          console.error('Erro no fallback:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return (
    <div className="bg-white min-h-screen w-full overflow-auto py-10">
      <div className="container mx-auto px-4">
        {/* Seção de Ofertas e Boladas */}
        <div className="mb-8">
          <AdsMore />
        </div>

        {/* Cabeçalho da pesquisa */}
        <div className="mb-6">
          <h1 className="text-xl font-bold mb-2">Resultado de busca</h1>
          <p className="text-gray-600">Você pesquisou por: <strong>{query}</strong></p>
        </div>

        {/* Estado de carregamento */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="space-y-8">
            <div className="bg-red-50 rounded-lg p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 p-2 rounded-full">
                  <SearchIcon size={24} className="text-red-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Erro na pesquisa</h2>
                  <p className="text-gray-600">{error}</p>
                </div>
              </div>
              
              {/* Sugestões de pesquisa */}
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Tente pesquisar por:</h3>
                <div className="flex flex-wrap gap-2">
                  {suggestedSearches.map((term, index) => (
                    <Link 
                      key={index} 
                      to={`/search?q=${encodeURIComponent(term)}`}
                      className="px-3 py-1 bg-white rounded-full text-sm border border-gray-200 hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
                    >
                      {term}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Produtos populares como fallback */}
            {popularProducts.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={18} className="text-amber-500" />
                  <h2 className="text-lg font-semibold">Produtos populares</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {popularProducts.slice(0, 8).map(product => (
                    <ProductCard2 key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : products.length > 0 ? (
          /* Resultados encontrados */
          <div className="space-y-8">
            {/* Produtos encontrados */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <SearchIcon size={18} className="text-green-500" />
                <h2 className="text-lg font-semibold">Resultados para "{query}"</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products?.map(product => (
                  <ProductCard2 key={product.id} product={product} />
                ))}
              </div>
            </div>
            
            {/* Sempre mostrar produtos populares, mesmo quando há resultados */}
            {popularProducts.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={18} className="text-amber-500" />
                  <h2 className="text-lg font-semibold">Produtos populares</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {popularProducts.slice(0, 4).map(product => (
                    <ProductCard2 key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Nenhum resultado encontrado para "{query}". Tente outra pesquisa.
            </p>
            {/* Sugestões de pesquisa */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Tente pesquisar por:</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestedSearches.map((term, index) => (
                  <Link 
                    key={index} 
                    to={`/search?q=${encodeURIComponent(term)}`}
                    className="px-3 py-1 bg-white rounded-full text-sm border border-gray-200 hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
