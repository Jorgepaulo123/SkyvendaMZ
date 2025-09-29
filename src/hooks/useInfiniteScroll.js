import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook personalizado para infinite scroll otimizado
 * Baseado na lógica do Android DynamicFeed
 */
export function useInfiniteScroll({
  fetchData,
  initialCursor = '1',
  minPaginationInterval = 1000,
  maxItems = 80,
  debug = false
}) {
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(initialCursor);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Refs para controle
  const isFirstLoad = useRef(true);
  const lastPaginateAt = useRef(0);
  const paginationInProgress = useRef(false);
  const requestController = useRef(null);

  // Função de deduplicação
  const deduplicateItems = useCallback((newItems, existingItems = []) => {
    const existingIds = new Set(existingItems.map(item => item.id));
    return newItems.filter(item => !existingIds.has(item.id));
  }, []);

  // Função principal de fetch
  const fetch = useCallback(async (isRefresh = false, customCursor = null) => {
    if (paginationInProgress.current) return;

    try {
      paginationInProgress.current = true;

      if (isRefresh) {
        setRefreshing(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      // Cancelar requisição anterior
      if (requestController.current) {
        requestController.current.abort();
      }

      requestController.current = new AbortController();

      const currentCursor = customCursor || cursor;
      
      if (debug) {
        console.log('[useInfiniteScroll] Fetching:', { 
          isRefresh, 
          currentCursor, 
          itemsCount: items.length 
        });
      }

      const result = await fetchData({
        cursor: currentCursor,
        isRefresh,
        signal: requestController.current.signal
      });

      const { data: newItems, hasMore: moreAvailable, nextCursor } = result;

      if (isRefresh) {
        setItems(newItems || []);
        setCursor(nextCursor || '2');
        setHasMore(moreAvailable !== false);
      } else {
        const dedupedItems = deduplicateItems(newItems || [], items);
        setItems(prev => [...prev, ...dedupedItems]);
        setCursor(nextCursor || String(parseInt(currentCursor) + 1));
        setHasMore(moreAvailable !== false && items.length < maxItems);
      }

      lastPaginateAt.current = Date.now();

    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('[useInfiniteScroll] Error:', error);
        setError(error.message || 'Erro ao carregar dados');
        setHasMore(false);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
      paginationInProgress.current = false;
      requestController.current = null;
    }
  }, [cursor, items, fetchData, deduplicateItems, debug, maxItems]);

  // Carregar dados iniciais
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      setLoading(true);
      fetch(true, initialCursor);
    }
  }, [fetch, initialCursor]);

  // Função de refresh
  const refresh = useCallback(() => {
    if (loading || refreshing) return;
    
    if (debug) console.log('[useInfiniteScroll] Refreshing');
    
    setCursor(initialCursor);
    setHasMore(true);
    setError(null);
    fetch(true, initialCursor);
  }, [loading, refreshing, fetch, initialCursor, debug]);

  // Função para carregar mais
  const loadMore = useCallback(() => {
    if (loading || loadingMore || paginationInProgress.current || !hasMore) return;
    
    const now = Date.now();
    if (now - lastPaginateAt.current < minPaginationInterval) return;
    
    if (debug) console.log('[useInfiniteScroll] Loading more');
    
    fetch(false);
  }, [loading, loadingMore, hasMore, fetch, minPaginationInterval, debug]);

  // Função para resetar e recomeçar
  const restart = useCallback(() => {
    setCursor(initialCursor);
    setHasMore(true);
    setError(null);
    fetch(true, initialCursor);
  }, [fetch, initialCursor]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (requestController.current) {
        requestController.current.abort();
      }
    };
  }, []);

  return {
    // Estados
    items,
    loading,
    loadingMore,
    refreshing,
    hasMore,
    error,
    cursor,
    
    // Ações
    refresh,
    loadMore,
    restart,
    
    // Utilitários
    setItems,
    setError
  };
}

export default useInfiniteScroll;
