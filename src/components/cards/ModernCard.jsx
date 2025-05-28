import React, { useState, useCallback, useContext } from 'react';
import { Heart, MapPin, Eye, MessageCircle, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/api';
import { base_url } from '../../api/api';

export function ModernCard({ product }) {
  const [isLiked, setIsLiked] = useState(product.liked);
  const [likesCount, setLikesCount] = useState(product.likes);
  const navigate = useNavigate();
  const { isAuthenticated, token } = useContext(AuthContext);

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
    <div className="bg-white rounded-xl border border-grey-300 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
      <div className="relative h-60" onClick={() => navigate(`/post/${product.slug}`)}>
        <img 
          src={`${base_url}/produto/${product.thumb}`}
          onError={(e) => e.target.src = `${base_url}/default.png`}
          alt={product.title}
          className="w-full h-full object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
        />
        <button 
          onClick={handleLike}
          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
        >
          <Heart 
            className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
          />
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white line-clamp-2">
            {product.title}
          </h3>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-xs sm:text-sm">
              {product.district}, {product.province}
            </span>
          </div>
          <span className="text-lg font-bold text-indigo-600">
            {product.price}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <img
            src={`${base_url}/perfil/${product.user.avatar}`}
            alt={product.user.name}
            className="h-8 w-8 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium">{product.user.name}</p>
            <p className="text-xs text-gray-500">{product.time}</p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-3">
          <div className="flex items-center gap-3 text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span className="text-xs">{product.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              <span className="text-xs">{likesCount}</span>
            </div>
            <div className="flex items-center gap-1 hover:text-indigo-500 hover:border hover:p-1 rounded-md border-indigo-400">
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs">{product?.comments?.length || 0}</span>
            </div>
          </div>
          
          <button
            onClick={() => navigate(`/post/${product.slug}`)}
            className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Comprar</span>
          </button>
        </div>
      </div>
    </div>
  );
}