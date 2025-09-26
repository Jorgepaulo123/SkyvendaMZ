import React, { useEffect, useState } from 'react';
import api from '../../api/api';

function Story({ item }){
  const user = item?.usuario || {};
  const avatar = user?.foto_perfil || 'https://ui-avatars.com/api/?name=U&background=EEF2FF';
  return (
    <div className="flex flex-col items-center w-20">
      <div className="relative">
        <img
          src={avatar}
          alt={user?.nome}
          className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500"
          onError={(e)=>{e.currentTarget.src='https://ui-avatars.com/api/?name=U&background=EEF2FF'}}
        />
      </div>
      <div className="mt-1 text-xs text-center line-clamp-1 w-full">{user?.nome || 'Usuário'}</div>
    </div>
  );
}

export default function StoriesStrip(){
  const [items, setItems] = useState([]);
  useEffect(()=>{
    let mounted = true;
    (async()=>{
      try{
        const res = await api.get('/publicacoes/listar?page=1&per_page=12');
        if(mounted){ setItems(res?.data?.publicacoes || []); }
      }catch(e){ /* noop */ }
    })();
    return ()=>{ mounted = false };
  },[]);
  if(!items?.length) return null;
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 mb-4 overflow-x-auto">
      <div className="flex gap-3">
        {items.map((p)=> (<Story key={p.id} item={p}/>))}
      </div>
    </div>
  );
}
