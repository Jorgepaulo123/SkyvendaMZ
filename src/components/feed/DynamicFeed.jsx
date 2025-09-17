import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import api from '../../api/api';
import ProductCard2 from '../cards/ProductCard2';
import PublicacoesCarousel from '../PublicacoesCarousel';
import NhonguistasCarousel from '../NhonguistasCarousel';
import AdsMore from '../ads/ads';
import { HomeContext } from '../../context/HomeContext';

const DEBUG = true;
const MAX_ITEMS = 80; // Limite máximo de itens para performance
const MIN_PAGINATION_INTERVAL = 1000; // Intervalo mínimo entre paginações
const PREFETCH_THRESHOLD = 200; // Distância do fim para começar prefetch (em pixels)

const FEED_TYPES = {
  PRODUCT: 'product',
  POST: 'post', 
  AD: 'ad',
  FRIEND_SUGGESTION: 'friend_suggestion'
};

export default function DynamicFeed() {
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState('1');
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  // Context do Home para gerenciar produtos
  const { produtos, setProdutos } = React.useContext(HomeContext);
  
  // Refs para controle de paginação
  const isFirstLoad = useRef(true);
  const lastPaginateAt = useRef(0);
  const paginationInProgress = useRef(false);
  const requestController = useRef(null);
  
  // Intersection Observer para detectar fim da lista
  const { ref: loadMoreRef, inView } = useInView({ 
    threshold: 0,
    rootMargin: `${PREFETCH_THRESHOLD}px`
  });

  // Função para normalizar itens do feed
  const normalizeItem = useCallback((item) => {
    if (item.type === FEED_TYPES.PRODUCT) {
      const data = item.data || {};
      let images = [];
      
      if (Array.isArray(data.images)) {
        images = data.images;
      } else if (typeof data.images === 'string' && data.images.trim().length > 0) {
        try {
          const parsed = JSON.parse(data.images);
          if (Array.isArray(parsed)) images = parsed;
        } catch {
          // Ignore parsing errors
        }
      }
      
      return {
        ...item,
        id: item.id || data.id || `${item.type}-${Date.now()}-${Math.random()}`,
        data: {
          ...data,
          images,
        },
      };
    }
    
    return {
      ...item,
      id: item.id || item.data?.id || `${item.type}-${Date.now()}-${Math.random()}`,
    };
  }, []);

  // Função de deduplicação
  const deduplicateItems = useCallback((newItems, existingItems = []) => {
    const existingIds = new Set(existingItems.map(item => item.id));
    return newItems.filter(item => !existingIds.has(item.id));
  }, []);

  // Função principal para buscar dados do feed
  const fetchFeed = useCallback(async (isRefresh = false, customCursor = null) => {
    if (paginationInProgress.current) return;
    
    try {
      paginationInProgress.current = true;
      
      if (isRefresh) {
        setRefreshing(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }
      
      // Cancelar requisição anterior se existir
      if (requestController.current) {
        requestController.current.abort();
      }
      
      requestController.current = new AbortController();
      
      const currentCursor = customCursor || cursor;
      const limit = 12; // Número de itens por página
      const offset = isRefresh ? 0 : (parseInt(currentCursor) - 1) * limit;
      
      if (DEBUG) {
        console.log('[DynamicFeed] Fetching feed:', { 
          isRefresh, 
          currentCursor, 
          offset, 
          itemsCount: items.length 
        });
      }
      
      // Buscar produtos
      const response = await api.get(`/produtos/?user_id=0&limit=${limit}&offset=${offset}`, {
        signal: requestController.current.signal
      });
      
      const newProducts = response.data || [];
      
      // Converter produtos para itens do feed
      const feedItems = newProducts.map(product => ({
        type: FEED_TYPES.PRODUCT,
        id: `product-${product.id}`,
        timestamp: product.created_at || new Date().toISOString(),
        data: product
      }));
      
      // Adicionar itens especiais a cada 4 produtos
      const enrichedItems = [];
      feedItems.forEach((item, index) => {
        enrichedItems.push(normalizeItem(item));
        
        // A cada 4 produtos, adicionar carousel ou ad
        if ((index + 1) % 4 === 0) {
          const specialType = Math.random() < 0.3 ? FEED_TYPES.AD : 
                             Math.random() < 0.5 ? 'publications' : 'nhonguistas';
          
          enrichedItems.push({
            type: specialType,
            id: `${specialType}-${Date.now()}-${index}`,
            timestamp: new Date().toISOString(),
            data: { specialType }
          });
        }
      });
      
      if (isRefresh) {
        setItems(enrichedItems);
        setCursor('2');
        setHasMore(newProducts.length >= limit);
      } else {
        const dedupedItems = deduplicateItems(enrichedItems, items);
        setItems(prev => [...prev, ...dedupedItems]);
        setCursor(prev => String(parseInt(prev) + 1));
        setHasMore(newProducts.length >= limit && items.length < MAX_ITEMS);
      }
      
      lastPaginateAt.current = Date.now();
      
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('[DynamicFeed] Erro ao buscar feed:', error);
        setError('Erro ao carregar o feed');
        setHasMore(false);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
      paginationInProgress.current = false;
      requestController.current = null;
    }
  }, [cursor, items, normalizeItem, deduplicateItems]);

  // Carregar dados iniciais
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      setLoading(true);
      fetchFeed(true, '1');
    }
  }, []);

  // Função de refresh
  const onRefresh = useCallback(() => {
    if (loading || refreshing) return;
    
    if (DEBUG) console.log('[DynamicFeed] Refreshing feed');
    
    setCursor('1');
    setHasMore(true);
    setError(null);
    fetchFeed(true, '1');
  }, [loading, refreshing, fetchFeed]);

  // Paginação quando chegar ao fim
  const onEndReached = useCallback(() => {
    if (loading || loadingMore || paginationInProgress.current || !hasMore) return;
    
    const now = Date.now();
    if (now - lastPaginateAt.current < MIN_PAGINATION_INTERVAL) return;
    
    if (DEBUG) console.log('[DynamicFeed] End reached, loading more');
    
    fetchFeed(false);
  }, [loading, loadingMore, hasMore, fetchFeed]);

  // Detectar quando o usuário está próximo do fim
  useEffect(() => {
    if (inView && hasMore) {
      onEndReached();
    }
  }, [inView, hasMore, onEndReached]);

  // Renderizar item do feed
  const renderFeedItem = useCallback((item) => {
    switch (item.type) {
      case FEED_TYPES.PRODUCT:
        return <ProductCard2 key={item.id} product={item.data} />;
      
      case FEED_TYPES.AD:
        return (
          <div key={item.id} className="col-span-full my-4">
            <AdsMore />
          </div>
        );
      
      case 'publications':
        return (
          <div key={item.id} className="col-span-full my-6">
            <PublicacoesCarousel embedded />
          </div>
        );
      
      case 'nhonguistas':
        return (
          <div key={item.id} className="col-span-full my-6">
            <NhonguistasCarousel embedded />
          </div>
        );
      
      default:
        return null;
    }
  }, []);

  // Memoizar elementos do feed
  const feedElements = useMemo(() => {
    return items.map(renderFeedItem).filter(Boolean);
  }, [items, renderFeedItem]);

  // Componente de loading
  const LoadingComponent = () => (
    <div className="col-span-full flex justify-center py-8">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
        <span className="text-gray-600">Carregando...</span>
      </div>
    </div>
  );

  // Componente de erro
  const ErrorComponent = () => (
    <div className="col-span-full text-center py-8">
      <p className="text-red-500 mb-4">{error}</p>
      <button 
        onClick={onRefresh}
        className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
      >
        Tentar novamente
      </button>
    </div>
  );

  // Componente vazio
  const EmptyComponent = () => (
    <div className="col-span-full text-center py-12">
      <p className="text-gray-500">Nenhum produto encontrado</p>
      <button 
        onClick={onRefresh}
        className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
      >
        Recarregar
      </button>
    </div>
  );

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (requestController.current) {
        requestController.current.abort();
      }
    };
  }, []);

  return (
    <div className="container mx-auto mb-12 bg-white min-h-screen">
      {/* Header com botão de refresh */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-indigo-500">Para você</h2>
        <button 
          onClick={onRefresh}
          disabled={refreshing || loading}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50"
        >
          {refreshing ? 'Atualizando...' : 'Atualizar'}
        </button>
      </div>

      {/* Conteúdo do feed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {loading && items.length === 0 ? (
          <LoadingComponent />
        ) : error && items.length === 0 ? (
          <ErrorComponent />
        ) : items.length === 0 ? (
          <EmptyComponent />
        ) : (
          <>
            {feedElements}
            
            {/* Trigger para infinite scroll */}
            {hasMore && (
              <div ref={loadMoreRef} className="col-span-full h-1" />
            )}
            
            {/* Loading indicator para mais itens */}
            {loadingMore && <LoadingComponent />}
            
            {/* Mensagem de fim */}
            {!hasMore && items.length > 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                Você chegou ao fim! 🎉
                <button 
                  onClick={() => {
                    setCursor('1');
                    setHasMore(true);
                    fetchFeed(true, '1');
                  }}
                  className="ml-4 px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 transition-colors"
                >
                  Recomeçar
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
