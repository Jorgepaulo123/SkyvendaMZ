import React, { useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { AuthContext } from '../../context/AuthContext';
import { HomeContext } from '../../context/HomeContext';
import api from '../../api/api';
import PublicationCard from '../cards/PublicationCard';
import ProductCard2 from '../cards/ProductCard2';
import StoriesStrip from './StoriesStrip';

function Composer({ onPosted }){
  const { token, isAuthenticated } = useContext(AuthContext);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const canPost = text.trim().length > 0 && text.trim().split(/\s+/).length <= 10;

  const submit = async(e)=>{
    e.preventDefault();
    if(!isAuthenticated) return window.location.href = '/login';
    if(!canPost) return;
    try{
      setLoading(true);
      const form = new FormData();
      form.append('conteudo', text.trim());
      await api.post('/publicacoes/form', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setText('');
      onPosted?.();
    }catch(err){
      console.error('Falha ao publicar', err);
    }finally{ setLoading(false); }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 md:p-4 mb-4">
      <form onSubmit={submit} className="flex items-start gap-3">
        <textarea
          value={text}
          onChange={(e)=>setText(e.target.value)}
          placeholder="Escreva algo (até 10 palavras)"
          className="flex-1 resize-none rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 p-3 min-h-[56px]"
        />
        <button
          type="submit"
          disabled={!canPost || loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg"
        >
          {loading? 'Publicando...' : 'Publicar'}
        </button>
      </form>
      <div className="text-xs text-gray-500 mt-1">Dica: use frases curtas, máximo 10 palavras.</div>
    </div>
  );
}

export default function CenterFeed(){
  const { produtos, setProdutos } = useContext(HomeContext);
  const [pubs, setPubs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView({ threshold: 0 });

  const fetchPublications = useCallback(async (nextPage)=>{
    if(loading || !hasMore) return;
    try{
      setLoading(true);
      const perPage = 6;
      const res = await api.get(`/publicacoes/listar?page=${nextPage}&per_page=${perPage}`);
      const items = res?.data?.publicacoes || [];
      setPubs(prev => [...prev, ...items]);
      if(items.length < perPage) setHasMore(false);
    }catch(err){
      console.error('Erro ao carregar publicações', err);
      setHasMore(false);
    }finally{ setLoading(false); }
  }, [loading, hasMore]);

  useEffect(()=>{ fetchPublications(page); }, []); // eslint-disable-line

  useEffect(()=>{
    if(inView && hasMore && !loading){
      const next = page + 1;
      setPage(next);
      fetchPublications(next);
    }
  }, [inView]); // eslint-disable-line

  const feed = useMemo(()=>{
    // Intercalar publicações e produtos
    const arr = [];
    const maxLen = Math.max(pubs.length, produtos.length);
    for(let i=0;i<maxLen;i++){
      if(pubs[i]) arr.push(<PublicationCard key={`pub-${pubs[i].id}`} pub={pubs[i]} />);
      if(produtos[i]) arr.push(<ProductCard2 key={`prod-${produtos[i].id}`} product={produtos[i]} />);
      if((i+1)%4===0) arr.push(<div key={`sep-${i}`} className="h-1"/>);
    }
    return arr;
  }, [pubs, produtos]);

  return (
    <main>
      <StoriesStrip/>
      <Composer onPosted={()=>{ setPubs([]); setPage(1); setHasMore(true); fetchPublications(1); }} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {feed}
        {(!pubs.length && loading) && (
          Array.from({length:4}).map((_,i)=> (
            <div key={`sk-${i}`} className="animate-pulse bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"/>
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"/>
                  <div className="h-2 bg-gray-100 rounded w-1/4"/>
                </div>
              </div>
              <div className="h-24 bg-gray-100 rounded"/>
            </div>
          ))
        )}
      </div>
      {hasMore && <div ref={ref} className="h-6" />}
      {loading && pubs.length>0 && <p className="text-center text-gray-500 py-2">Carregando...</p>}
    </main>
  );
}
