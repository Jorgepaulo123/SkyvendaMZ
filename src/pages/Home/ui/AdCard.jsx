import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Clock } from 'lucide-react';

const formatPrice = (price) => {
  return new Intl.NumberFormat('pt-MZ', {
    style: 'currency',
    currency: 'MZN'
  }).format(price);
};

const TimeRemaining = ({ expiryDate }) => {
  const expiry = new Date(expiryDate);
  const now = new Date();
  const diff = expiry.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return (
    <div className="flex items-center gap-1 text-xs text-gray-500">
      <Clock className="w-3 h-3" />
      <span>{days}d {hours}h restantes</span>
    </div>
  );
};

const AdCard = ({ item }) => {
  return (
    <Link 
      to={`/produto/${item.produto.id}`}
      className="block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="relative aspect-square">
        <img
          src={item.produto.thumb}
          alt={item.produto.nome}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            -45%
          </span>
        </div>
      </div>
      
      <div className="p-3 space-y-2">
        <div>
          <div className="text-lg font-bold text-indigo-600">
            {formatPrice(item.produto.preco)}
          </div>
          <div className="text-sm text-gray-400 line-through">
            {formatPrice(item.produto.preco * 1.45)}
          </div>
        </div>
        
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
          {item.produto.nome}
        </h3>
        
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <TimeRemaining expiryDate={item.anuncio.expira_em} />
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Eye className="w-3 h-3" />
            <span>{item.produto.views}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AdCard;