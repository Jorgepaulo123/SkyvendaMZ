import React from 'react';
import { NotificationItem } from './NotificationItem';
import { Bell } from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  description: string;
  imagem: string;
}

export function Notifications() {
  const notificacoes: Notification[] = [
    {
      id: 1,
      title: "Um Nhonguista postou uma bolada",
      description: "Vendo carro Mark X com preco basico",
      imagem: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=400&fit=crop"
    },
    {
      id: 2,
      title: "Nova oferta disponível",
      description: "Toyota Crown em excelente estado",
      imagem: "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=400&h=400&fit=crop"
    },
    {
      id: 3,
      title: "Alerta de preço",
      description: "O preço do Mark X que você segue baixou",
      imagem: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=400&fit=crop"
    },
    {
      id: 4,
      title: "Novo comentário",
      description: "Alguém comentou no seu anúncio",
      imagem: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=400&h=400&fit=crop"
    }
  ];

  return (
    <div className="absolute right-0 mt-2 w-96 rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden transform origin-top-right transition-all duration-200 animate-fadeIn z-50">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-white" />
            <h3 className="text-lg font-semibold text-white">Notificações</h3>
          </div>
          <span className="bg-white bg-opacity-20 text-white text-xs font-medium px-2 py-1 rounded-full">
            {notificacoes.length} novas
          </span>
        </div>
      </div>
      <div className="divide-y divide-gray-100 max-h-[calc(100vh-200px)] overflow-y-auto">
        {notificacoes.map(notificacao => (
          <NotificationItem
            key={notificacao.id}
            title={notificacao.title}
            description={notificacao.description}
            image={notificacao.imagem}
          />
        ))}
      </div>
      <div className="p-4 bg-gray-50">
        <button className="w-full text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
          Ver todas as notificações
        </button>
      </div>
    </div>
  );
}