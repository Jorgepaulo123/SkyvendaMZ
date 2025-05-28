import React, { memo, useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { base_url } from '../../api/api';
import api from '../../api/api';

const ProductItemSkeleton = () => (
  <div className="bg-white/50 rounded-lg overflow-hidden shadow-sm p-3 flex-1">
    <div className="relative aspect-square bg-gray-200/80 animate-pulse rounded" />
    <div className="p-2">
      <div className="h-4 bg-gray-200/80 animate-pulse rounded w-3/4 mb-1" />
      <div className="h-5 bg-gray-200/80 animate-pulse rounded w-1/2" />
    </div>
  </div>
);

const ProductItem = memo(({ produto, anuncio }) => (
  <div className="product-item bg-white rounded-lg h-[181px] md:h-auto overflow-hidden shadow-sm hover:shadow-md transition-all p-3 flex-1 animate-fade-slide-in opacity-0">
    <div className="relative aspect-square bg-gray-50 rounded">
      <img 
        src={`${base_url}/produto/${produto.capa}`} 
        alt={produto.nome} 
        className="w-full h-full object-cover"
        onError={(e) => e.target.src = `${base_url}/default.png`} 
      />
    </div>
    <div className="p-2">
      <h3 className="text-sm text-gray-700 line-clamp-2 mb-1">{produto.nome}</h3>
      <div className="flex items-baseline gap-1">
        <span className="text-xs md:text-base font-bold">{produto.preco} MT</span>
      </div>
    </div>
  </div>
));

const AdSectionSkeleton = () => (
  <div className="bg-white/50 rounded-xl p-4 shadow-sm">
    <div className="flex justify-between items-center mb-4">
      <div>
        <div className="h-8 bg-gray-200/80 animate-pulse rounded w-48 mb-2" />
        <div className="h-4 bg-gray-200/80 animate-pulse rounded w-36" />
      </div>
      <div className="w-10 h-10 bg-gray-200/80 animate-pulse rounded-full" />
    </div>
    <div className="grid grid-cols-3 lg:grid-cols-4 gap-2">
      {[...Array(4)].map((_, index) => (
        <ProductItemSkeleton 
          key={index} 
          className={index === 3 ? 'hidden lg:block' : ''} 
        />
      ))}
    </div>
  </div>
);

const AdSection = memo(({ title, subtitle, gradient, buttonColor, items }) => (
  <div className={`${gradient} rounded-xl p-4 shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg`}>
    <div className="flex justify-between items-center mb-4">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
      <button className={`p-2 rounded-full ${buttonColor} transition-colors`}>
        <ArrowRight className="w-6 h-6" />
      </button>
    </div>

    <div className="grid grid-cols-3 lg:grid-cols-4 gap-2">
      {items.slice(0, 4).map((item, index) => (
        <div 
          key={item.anuncio.id} 
          className={index === 3 ? 'hidden lg:block' : ''}
        >
          <ProductItem {...item} />
        </div>
      ))}
    </div>
  </div>
));

function AdsMore() {
  const [advertisements, setAdvertisements] = useState({
    ofertas_diarias: [],
    para_sim: [],
    melhores_boladas: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/produtos/anuncios/').then(res => {
      const ads = res.data;
      
      // Organize ads by type
      const organizedAds = ads.reduce((acc, ad) => {
        const type = ad.anuncio.tipo_anuncio;
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(ad);
        return acc;
      }, {});

      setAdvertisements(organizedAds);
      setIsLoading(false);
    }).catch(err => {
      console.error('Error fetching advertisements:', err);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <AdSectionSkeleton />
        <AdSectionSkeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full px-2 md:px-0">
      <AdSection 
        title={<>Super<span className="text-red-500">Ofertas</span></>}
        subtitle="Ofertas diárias especiais"
        gradient="bg-gradient-to-r from-pink-100 to-red-100"
        buttonColor="bg-red-200 hover:bg-red-300"
        items={advertisements.ofertas_diarias || []}
      />
      <AdSection 
        title="Melhors Boladas"
        subtitle="Itens com valor de atacado"
        gradient="bg-gradient-to-r from-blue-100 to-purple-100"
        buttonColor="bg-purple-200 hover:bg-purple-300"
        items={advertisements.melhores_boladas || []}
      />
    </div>
  );
}

export default AdsMore;