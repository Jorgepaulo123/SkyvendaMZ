import React, { useState, useCallback, useContext } from 'react';
import { useInView } from 'react-intersection-observer';
import { HomeContext } from '../context/HomeContext';
import { AuthContext } from '../context/AuthContext';
import ProductCardSkeleton from './skeleton/productCard2Sqkeleton';
import ProductCard2 from './cards/ProductCard2';
import api from '../api/api';

function FeaturedProducts() {
  const { loading, produtos, setProdutos } = useContext(HomeContext);
  const { user, isAuthenticated } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const ITEMS_PER_PAGE = 10;

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    rootMargin: '100px',
  });

  const loadMoreProducts = useCallback(async () => {
    if (!hasMore || isLoadingMore) return;

    try {
      setIsLoadingMore(true);
      setError(null);

      const response = await api.get(
        `/produtos/?user_id=${isAuthenticated ? user.id : 0}&limit=${ITEMS_PER_PAGE}&offset=${(page - 1) * ITEMS_PER_PAGE}`
      );

      const newProducts = response.data;

      // If no new products received, we've reached the end
      if (!newProducts?.length) {
        setHasMore(false);
        return;
      }

      setProdutos(prevProdutos => {
        if (!prevProdutos) return newProducts;
        
        // Filter out any duplicate products
        const existingIds = new Set(prevProdutos.map(produto => produto.id));
        const uniqueProducts = newProducts.filter(
          produto => !existingIds.has(produto.id)
        );

        // If we received fewer unique products than requested, we've reached the end
        if (uniqueProducts.length < ITEMS_PER_PAGE) {
          setHasMore(false);
        }

        // If no unique products were found, don't update the list
        if (!uniqueProducts.length) {
          setHasMore(false);
          return prevProdutos;
        }

        return [...prevProdutos, ...uniqueProducts];
      });

      setPage(prev => prev + 1);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Erro ao carregar mais produtos. Tente novamente.');
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, setProdutos, hasMore, isAuthenticated, user?.id]);

  React.useEffect(() => {
    if (inView && hasMore && !isLoadingMore) {
      loadMoreProducts();
    }
  }, [inView, hasMore, loadMoreProducts, isLoadingMore]);

  const renderMessage = () => {
    if (!hasMore && (!produtos?.length)) {
      return <p className="text-lg text-gray-600 text-center py-8">Nenhum produto encontrado</p>;
    }

    if (!hasMore && produtos?.length > 0) {
      return <p className="text-gray-600 text-center mt-8 pb-6">Não há mais produtos para carregar</p>;
    }

    return null;
  };

  return (
    <div className="container mx-auto mb-12 bg-white">
      <h2 className="text-3xl font-bold mb-6 text-indigo-500">
        Produtos em Destaque
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {produtos?.map(product => (
          <ProductCard2 key={product.id} product={product} />
        ))}
      </div>
      
      {isLoadingMore && (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
          {[...Array(4)].map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      )}
      
      {error && (
        <div className="text-center mt-4 text-red-600">
          {error}
        </div>
      )}
      
      <div ref={loadMoreRef}>
        {renderMessage()}
      </div>
    </div>
  );
}

export default FeaturedProducts;