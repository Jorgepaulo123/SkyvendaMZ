# Sistema de Feed Dinâmico - SkyVenda MZ Web

## Visão Geral

Este sistema implementa infinite scroll otimizado para a versão web, baseado na lógica do aplicativo Android. O sistema é composto por dois componentes principais:

### Componentes

1. **DynamicFeedV2.jsx** - Componente principal do feed
2. **useInfiniteScroll.js** - Hook personalizado para gerenciar infinite scroll

## Funcionalidades Implementadas

### ✅ Infinite Scroll
- Carregamento automático quando o usuário se aproxima do fim da lista
- Controle de threshold para prefetch (200px antes do fim)
- Paginação por cursor otimizada

### ✅ Estados de Carregamento
- **Loading**: Carregamento inicial
- **LoadingMore**: Carregamento de mais itens
- **Refreshing**: Atualização do feed
- **Error**: Tratamento de erros

### ✅ Controle de Performance
- Deduplicação automática de itens
- Limite máximo de itens (80) para evitar sobrecarga
- Intervalo mínimo entre paginações (1000ms)
- Cancelamento de requisições em progresso

### ✅ Tipos de Conteúdo Misturado
- **Produtos**: Cards de produtos principais
- **Publicações**: Carousel de publicações a cada 4 produtos
- **Nhonguistas**: Carousel de usuários/lojas
- **Anúncios**: Banners promocionais

### ✅ Funcionalidades Extras
- Botão de refresh manual
- Botão "Recomeçar do início" quando chega ao fim
- Estados vazios e de erro com ações de recuperação
- Debug mode para desenvolvimento

## Como Usar

### Implementação Básica
```jsx
import DynamicFeed from './components/feed/DynamicFeedV2';

function HomePage() {
  return (
    <div>
      <DynamicFeed />
    </div>
  );
}
```

### Hook Personalizado
```jsx
import useInfiniteScroll from './hooks/useInfiniteScroll';

const { 
  items, 
  loading, 
  hasMore, 
  loadMore, 
  refresh 
} = useInfiniteScroll({
  fetchData: myFetchFunction,
  initialCursor: '1',
  maxItems: 100
});
```

## Configurações

### Constantes Configuráveis
```javascript
const DEBUG = true; // Ativar logs de debug
const MAX_ITEMS = 80; // Máximo de itens na lista
const MIN_PAGINATION_INTERVAL = 1000; // Intervalo entre paginações (ms)
const PREFETCH_THRESHOLD = 200; // Distância para prefetch (px)
```

## Comparação com Android

| Funcionalidade | Android (React Native) | Web (React) |
|---|---|---|
| Infinite Scroll | ✅ FlatList onEndReached | ✅ Intersection Observer |
| Paginação | ✅ Cursor-based | ✅ Cursor-based |
| Prefetch | ✅ onScroll threshold | ✅ rootMargin |
| Deduplicação | ✅ Por ID | ✅ Por ID |
| Estados Loading | ✅ Múltiplos estados | ✅ Múltiplos estados |
| Pull to Refresh | ✅ RefreshControl | ✅ Botão manual |
| Performance | ✅ VirtualizedList | ✅ Intersection Observer |

## Melhorias Implementadas

### Sobre o Android Original
1. **Hook Reutilizável**: Lógica separada em hook personalizado
2. **Melhor UX**: Indicadores de loading mais informativos
3. **Controle de Erro**: Estados de erro mais robustos
4. **Flexibilidade**: Mais fácil de customizar e reutilizar

### Performance Web
1. **Intersection Observer**: Mais eficiente que scroll listeners
2. **Memoização**: React.useMemo para evitar re-renders
3. **Abort Controller**: Cancelamento de requisições duplicadas
4. **Throttling**: Controle de frequência de requisições

## Estrutura de Dados

### Item do Feed
```javascript
{
  type: 'product' | 'ad' | 'publications' | 'nhonguistas',
  id: string,
  timestamp: string,
  data: any // Dados específicos do tipo
}
```

### Resposta da API
```javascript
{
  data: FeedItem[],
  hasMore: boolean,
  nextCursor: string
}
```

## Debug e Monitoramento

Ative o debug mode para ver logs detalhados:
```javascript
const DEBUG = true;
```

Logs incluem:
- Início e fim de requisições
- Estados de paginação
- Contadores de itens
- Erros e recuperações

## Próximas Melhorias

- [ ] Cache local com AsyncStorage/localStorage
- [ ] Suporte a filtros dinâmicos
- [ ] Métricas de performance
- [ ] Testes automatizados
- [ ] PWA offline support
