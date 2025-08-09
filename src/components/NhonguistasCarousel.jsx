import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function NhonguistasCarousel({ embedded=false }) {
  const [vendedores, setVendedores] = useState([]);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchVendedores() {
      try {
        const res = await api.get('/usuario/usuarios/lojas', { params:{ skip:0, limit:10 } });
        const lista = res.data.usuarios || [];
        setVendedores(lista);
      } catch (e) {
        console.error('Erro ao carregar nhonguistas', e);
      }
    }
    fetchVendedores();
  }, []);

  if (!vendedores.length) return null;

  const scroll = dir => {
    if (!containerRef.current) return;
    const width = containerRef.current.offsetWidth;
    containerRef.current.scrollBy({ left: dir * width, behavior: 'smooth' });
  };

  return (
    <div className={`${embedded ? '' : 'container mx-auto'} my-8 w-full max-w-full overflow-hidden`}>
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg px-4 md:px-6 py-5 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Nhonguistas</h2>
          <button onClick={()=>navigate('/nhonguistas')} className="text-sm text-indigo-600 hover:underline">Ver mais</button>
        </div>

        {/* Arrows */}
        <button onClick={()=>scroll(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10">
          ◀
        </button>
        <button onClick={()=>scroll(1)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10">
          ▶
        </button>

        <div ref={containerRef} className="flex gap-4 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory scrollbar-hide touch-pan-x overscroll-x-contain w-full max-w-full">
          {vendedores.map(v => (
            <div
              key={v.id}
              className="min-w-[120px] max-w-[75vw] sm:max-w-none snap-start flex-shrink-0 cursor-pointer text-center"
              onClick={() => navigate(`/${v.username || v.identificador_unico || v.id}`)}
            >
              <img
                src={v.foto_perfil || v.avatar || v.foto || 'https://via.placeholder.com/100'}
                alt={v.nome || v.name}
                className="w-[100px] h-[100px] rounded-full object-cover border-2 border-indigo-500 mb-2 max-w-full"
                onError={e => (e.target.src = 'https://via.placeholder.com/100')}
              />
              <p className="text-sm font-medium text-gray-700 truncate w-[100px] mx-auto">{v.nome || v.name || v.username}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
