import React from 'react';
import { ExternalLink, Star } from 'lucide-react';

export default function AdCard({ data }) {
  const handleAdClick = () => {
    if (data.link) {
      window.open(data.link, '_blank');
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200 md:mb-4 md:border md:border-indigo-100 md:rounded-lg overflow-hidden">
      {/* Ad Label */}
      <div className="px-4 py-2 bg-indigo-100">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-indigo-700">Anúncio Patrocinado</span>
          <Star size={12} className="text-indigo-500" />
        </div>
      </div>

      {/* Ad Content */}
      <div className="p-4">
        <button 
          onClick={handleAdClick}
          className="w-full text-left hover:bg-white hover:bg-opacity-50 rounded-lg p-2 transition-colors"
        >
          <div className="flex items-start space-x-4">
            {data.image && (
              <img
                src={data.image}
                alt={data.title}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                {data.title || 'Anúncio Especial'}
              </h3>
              <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
                {data.description || 'Descubra ofertas incríveis e produtos exclusivos.'}
              </p>
              {data.price && (
                <p className="text-indigo-600 font-bold text-sm mt-2">
                  A partir de {data.price} MT
                </p>
              )}
            </div>
            <ExternalLink size={16} className="text-indigo-500 flex-shrink-0 mt-1" />
          </div>
        </button>
      </div>

      {/* CTA Button */}
      <div className="px-4 pb-4">
        <button
          onClick={handleAdClick}
          className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors"
        >
          {data.cta || 'Ver Mais'}
        </button>
      </div>
    </div>
  );
}
