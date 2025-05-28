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
  const [isLiked, setIsLiked] = useState(product.liked);
  const [likesCount, setLikesCount] = useState(product.likes);
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

  return (
    <div 
      ref={ref}
      className={`group hover:shadow-2xl transition-all duration-500 hover:p-4 hover:rounded-3xl transform ${
        isInView 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-20'
      }`}
      onClick={() => navigate(`/post/${product.slug}`)}
    >
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300">
        <img
          src={product.thumb} // Usando diretamente a URL completa do thumb
          onError={(e) => e.target.src = `${base_url}/default.png`}
          alt={product.title}
          className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 left-4 flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
          <span className="text-sm font-medium">{product.state}</span>
        </div>
        <button 
          onClick={handleLike}
          className="absolute top-4 right-4 p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-xl hover:bg-white transition-all hover:scale-110 hover:shadow-2xl"
        >
          <Heart className={`h-5 w-5 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
        </button>
      </div>
      <div className="mt-6">
        <div className="flex items-center space-x-2 mb-2">
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
        <div className="flex justify-between items-start">
          <div className="max-w-[70%]">
            <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate" title={product.title}>
              {product.title}
            </h3>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <MapPin className="h-4 w-4 mr-1" />
              {product.province}, {product.district}
            </div>
          </div>
          <p className="text-lg font-semibold bg-gradient-to-r from-[#7a4fed] to-indigo-600 bg-clip-text text-transparent">
            {product.price.toLocaleString('pt-MZ')} MT
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {product.views}
            </div>
            <div className="flex items-center">
              <Heart className="h-4 w-4 mr-1" />
              {likesCount}
            </div>
          </div>
          {product.negociavel && (
            <span className='text-md bg-gradient-to-r from-blue-600 to-[#7a4fed] bg-clip-text text-transparent'>Negociavel</span>
          )}
        </div>
        <button type="button" className="w-full border border-[#7a4fed] rounded-lg p-3 mt-2 items-center flex justify-center gap-2 hover:bg-indigo-600 hover:text-white">
          <ShoppingCart className="h-5 w-5" />
          <span>Comprar Agora</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard2;