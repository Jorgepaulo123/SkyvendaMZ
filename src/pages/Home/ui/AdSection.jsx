import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Zap, Gift, UserCircle, ChevronRight, ChevronDown } from 'lucide-react';
import AdCard from './AdCard';


const AdTypeIcon = ({ type }) => {
    switch (type) {
      case 'promocao':
        return <Tag className="w-5 h-5 text-indigo-600" />;
      case 'em_promocao':
        return <Zap className="w-5 h-5 text-amber-500" />;
      case 'ofertas_diarias':
        return <Gift className="w-5 h-5 text-emerald-500" />;
      case 'para_si':
        return <UserCircle className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };
  
  const AdTypeTitle = ({ type }) => {
    const titles = {
      promocao: 'Promoções Especiais',
      em_promocao: 'Em Promoção',
      ofertas_diarias: 'Ofertas do Dia',
      para_si: 'Recomendados Para Si'
    };
    return <span>{titles[type] || type}</span>;
  };
  
  const AdSection = ({ type, ads }) => {
    const [showAll, setShowAll] = useState(false);
    const displayedAds = showAll ? ads : ads.slice(0, 5);
    const hasMoreToShow = ads.length > 5;
  
    return (
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AdTypeIcon type={type} />
            <h2 className="text-lg font-semibold text-gray-800">
              <AdTypeTitle type={type} />
            </h2>
          </div>
          {type === 'ofertas_diarias' && (
            <Link 
              to="/ofertas-diarias" 
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              Ver todas as ofertas
            </Link>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {displayedAds.map((item) => (
            <AdCard key={item.anuncio.id} item={item} />
          ))}
        </div>
        
        {hasMoreToShow && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium inline-flex items-center gap-1"
            >
              {showAll ? 'Ver menos' : 'Ver mais'}
              <ChevronDown className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}
      </section>
    );
  };
  
  export default AdSection;