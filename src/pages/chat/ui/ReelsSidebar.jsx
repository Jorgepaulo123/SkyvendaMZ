import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeft, Play } from 'lucide-react';
import { base_url } from '../../../api/api';

/*
 * Sidebar que lista os reels.  
 * – show : exibe/oculta componente  
 * – onBack : callback ← botão voltar  
 * – onSelect(reel) : dispara quando usuário clica no vídeo
 */
export default function ReelsSidebar({ show, onBack, onSelect }) {
  const [reels, setReels] = useState([]);

  useEffect(() => {
    if (!show) return;
    (async () => {
      try {
        const { data } = await axios.get(`${base_url}/usuario/reels/listar`);
        setReels(data || []);
      } catch (err) {
        console.error('Erro ao carregar reels', err);
      }
    })();
  }, [show]);

  if (!show) return null;

  return (
    <div className="w-full md:w-[350px] flex flex-col min-h-0 border-r border-gray-200 bg-white">
      {/* Cabeçalho */}
      <div className="flex items-center gap-2 p-4 border-b">
        <ArrowLeft className="cursor-pointer" onClick={onBack} />
        <span className="font-semibold">Reels</span>
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {reels.length === 0 && (
          <p className="text-center text-gray-500">Nenhum reel disponível</p>
        )}

        {reels.map(reel => (
          <div
            key={reel.id}
            className="relative cursor-pointer group"
            onClick={() => onSelect?.(reel)}
          >
            <video
              src={`${reel.video_url}#t=0.1`}
              className="w-full h-40 object-cover rounded-lg"
              muted
            />

            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Play className="w-12 h-12 text-white" />
            </div>

            <span className="absolute bottom-2 left-2 text-xs text-white bg-black/60 px-2 rounded-full">
              {reel.likes} ❤
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}