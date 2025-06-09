import React, { useState, useCallback, useContext, useEffect, useRef } from 'react';
import { Heart, MapPin, Eye, MessageCircle, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/api';
import { base_url } from '../../api/api';

function useInView(options = {}) {
  const [isInView, setIsInView] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, {
      threshold: 0.1,
      ...options
    });

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [options]);

  return [elementRef, isInView];
}

const ProductCard2 = ({ product }) => {
  const [isLiked, setIsLiked] = useState(product.liked || false);
  const [likesCount, setLikesCount] = useState(product.likes || 0);
  const navigate = useNavigate();
  const { isAuthenticated, token } = useContext(AuthContext);
  const [ref, isInView] = useInView();

  const handleLike = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsLiked((prev) => !prev);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    
    api.post(`/produtos/${product.slug}/like`, {}, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });
  }, [isLiked, isAuthenticated, navigate, product.slug, token]);

  const handleBuyClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/post/${product.slug}`);
  };

  return (
    <div 
      ref={ref}
      className={`group bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 ${
        isInView 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-20'
      }`}
    >
      <div 
        onClick={() => navigate(`/post/${product.slug}`)}
        className="cursor-pointer"
      >
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.thumb}
            onError={(e) => e.target.src = `${base_url}/default.png`}
            alt={product.title}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-4 left-4 flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-sm font-medium">{product.state}</span>
          </div>
          <button 
            onClick={handleLike}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-xl hover:bg-white transition-all hover:scale-110"
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
          </button>
        </div>

        <div className="p-4">
          {/* Usuário e Tempo */}
          <div className="flex items-center space-x-2 mb-3">
            <img
              src={`${product.user.avatar}`}
              onError={(e) => e.target.src = `${base_url}/avatar.png`}
              className="w-6 h-6 rounded-full"
            />
            <span  
              className="text-sm text-gray-600 hover:underline hover:text-[#7a4fed]"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/${product.user.username}`);
              }}
            >
              {product.user.name}
            </span>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-400">{product.time}</span>
          </div>

          {/* Título e Preço */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 group-hover:text-[#7a4fed] transition-colors line-clamp-2" title={product.title}>
                {product.title}
              </h3>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                {product.province}, {product.district}
              </div>
            </div>
            <p className="text-xl font-bold text-[#7a4fed] ml-4">
              {product.price.toLocaleString('pt-MZ')} MT
            </p>
          </div>

          {/* Estatísticas e Status */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {product.views || 0}
              </div>
              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-1" />
                {likesCount || 0}
              </div>
            </div>
            {product.negociavel && (
              <span className="text-sm font-medium text-[#7a4fed]">Negociável</span>
            )}
          </div>
        </div>
      </div>

      {/* Botão de Comprar */}
      <div className="px-4 pb-4">
        <button 
          type="button" 
          onClick={handleBuyClick}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-[#7a4fed] text-[#7a4fed] hover:bg-[#7a4fed] hover:text-white transition-all duration-300"
        >
          <ShoppingCart className="h-5 w-5" />
          <span>Comprar Agora</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard2;