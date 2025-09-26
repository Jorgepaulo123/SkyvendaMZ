import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function LeftSidebar() {
  const { user } = useContext(AuthContext) || {};

  return (
    <aside className="sticky top-20 space-y-4">
      {/* Profile card */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex items-center space-x-3">
          <img
            src={user?.foto_perfil || 'https://ui-avatars.com/api/?name=Sky&background=EEF2FF'}
            alt="avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <div className="font-semibold text-gray-800 leading-tight">{user?.nome || 'Bem-vindo(a)'}</div>
            <div className="text-sm text-gray-500">@{user?.username || 'skyvenda'}</div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 text-center text-sm">
          <div>
            <div className="font-bold text-gray-800">{user?.seguidores || 0}</div>
            <div className="text-gray-500">Seguidores</div>
          </div>
          <div>
            <div className="font-bold text-gray-800">{user?.seguindo || 0}</div>
            <div className="text-gray-500">Seguindo</div>
          </div>
          <div>
            <div className="font-bold text-gray-800">{user?.produtos || 0}</div>
            <div className="text-gray-500">Produtos</div>
          </div>
        </div>
      </div>

      {/* Shortcuts */}
      <div className="bg-white rounded-xl shadow-sm p-3 border border-gray-100">
        <nav className="space-y-2 text-[15px]">
          <a href="/posts" className="block px-3 py-2 rounded-lg hover:bg-gray-50">Publicações</a>
          <a href="/nhonguistas" className="block px-3 py-2 rounded-lg hover:bg-gray-50">Lojas/Perfis</a>
          <a href="/melhores-boladas" className="block px-3 py-2 rounded-lg hover:bg-gray-50">Melhores Boladas</a>
          <a href="/friends" className="block px-3 py-2 rounded-lg hover:bg-gray-50">Seguidores</a>
        </nav>
      </div>
    </aside>
  );
}
