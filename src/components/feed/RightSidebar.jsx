import React, { useContext } from 'react';
import { HomeContext } from '../../context/HomeContext';

function AdCard({ ad }){
  if(!ad) return null;
  return (
    <a href={ad.link || '#'} target="_blank" rel="noreferrer"
       className="block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition">
      {ad.imagem && (
        <img src={ad.imagem} alt={ad.nome} className="w-full h-28 object-cover"/>
      )}
      <div className="p-3">
        <div className="text-sm font-semibold text-gray-800 line-clamp-2">{ad.nome}</div>
        {ad.preco && <div className="text-xs text-gray-500 mt-1">Desde {Number(ad.preco).toFixed(2)} MT</div>}
      </div>
    </a>
  );
}

export default function RightSidebar(){
  const { ads } = useContext(HomeContext);

  return (
    <aside className="sticky top-20 space-y-4">
      {/* Ads */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3">
        <div className="font-semibold text-gray-700 mb-2">Patrocinado</div>
        <div className="space-y-3">
          {(ads || []).slice(0,3).map((a)=> (
            <AdCard key={a.id} ad={a}/>
          ))}
        </div>
      </div>

      {/* Suggestions placeholder */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3">
        <div className="font-semibold text-gray-700 mb-2">Sugestões para seguir</div>
        <ul className="space-y-2 text-sm text-gray-600">
          <li><a className="hover:underline" href="/nhonguistas">Descubra lojas e perfis</a></li>
          <li><a className="hover:underline" href="/friends">Ver seguidores</a></li>
          <li><a className="hover:underline" href="/posts">Ver publicações</a></li>
        </ul>
      </div>
    </aside>
  );
}
