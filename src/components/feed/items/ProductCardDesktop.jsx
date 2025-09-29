import React, { useState } from 'react';
import { Heart, MapPin, MoreHorizontal, Eye, Share2, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './feed-desktop.css';

export default function ProductCardDesktop({ data }) {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Processar imagens
  const images = (data.images && data.images.length > 0)
    ? data.images
    : (data.thumb ? [data.thumb] : ['https://via.placeholder.com/800x800?text=Produto']);

  const handleProductPress = () => {
    navigate(`/post/${data.slug}`);
  };

  const handleUserPress = () => {
    console.log('User pressed:', data.user?.id);
    // navigate(`/profile/${data.user?.id}`);
  };

  const formatPrice = (price) => {
    try {
      return new Intl.NumberFormat('pt-MZ', { 
        style: 'decimal', 
        minimumFractionDigits: 2 
      }).format(price);
    } catch {
      return String(price);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="product-card-desktop">
      {/* Header - User Info */}
      <div className="card-header-desktop">
        <div className="flex items-center justify-between">
          <button 
            onClick={handleUserPress}
            className="flex items-center space-x-3 flex-1"
          >
            <img
              src={data.user?.avatar || 'https://via.placeholder.com/32x32?text=U'}
              alt={data.user?.name}
              className="avatar-desktop object-cover"
            />
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-gray-900 text-sm">
                {data.user?.name || 'Usuário'}
              </h3>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                {data.province && (
                  <div className="flex items-center space-x-1">
                    <MapPin size={12} />
                    <span>{data.province}</span>
                  </div>
                )}
                {data.time && <span>• {data.time}</span>}
              </div>
            </div>
          </button>
          <button className="action-button-desktop">
            <MoreHorizontal size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Product Title & Price */}
      <div className="px-4 py-3">
        <h2 className="product-title-desktop">{data.title}</h2>
        <p className="product-price-desktop">
          {formatPrice(data.price)} MT
        </p>
        {data.description && (
          <p className="product-description-desktop">
            {data.description}
          </p>
        )}
      </div>

      {/* Image - Square aspect ratio like Instagram */}
      <div className="relative bg-gray-100">
        <button 
          onClick={handleProductPress}
          className="block w-full"
        >
          <img
            src={images[currentImageIndex]}
            alt={data.title}
            className="product-image-desktop"
          />
          
          {/* Image counter */}
          {images.length > 1 && (
            <div className="image-counter-desktop absolute top-3 right-3">
              {currentImageIndex + 1}/{images.length}
            </div>
          )}
          
          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="image-nav-desktop absolute left-3 top-1/2 transform -translate-y-1/2"
              >
                ←
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="image-nav-desktop absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                →
              </button>
            </>
          )}
        </button>

        {/* Image dots indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`image-dots-desktop ${
                  index === currentImageIndex ? 'active' : ''
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="action-bar-desktop">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setLiked(!liked)}
              className={`action-button-desktop flex items-center space-x-2 ${
                liked ? 'like-button-desktop liked' : 'like-button-desktop'
              }`}
            >
              <Heart 
                size={24} 
                className={liked ? 'text-red-500 fill-current' : 'text-gray-600'} 
              />
              <span className="text-sm font-medium">{data.likes || 0}</span>
            </button>
            
            <button className="action-button-desktop flex items-center space-x-2 text-gray-600">
              <MessageCircle size={24} />
              <span className="text-sm font-medium">{data.comments || 0}</span>
            </button>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <Eye size={24} />
              <span className="text-sm font-medium">{data.views || '0'}</span>
            </div>
            
            <button className="action-button-desktop text-gray-600">
              <Share2 size={24} />
            </button>
          </div>

          <button
            onClick={() => setBookmarked(!bookmarked)}
            className="action-button-desktop text-gray-600"
          >
            <svg 
              width={24} 
              height={24} 
              viewBox="0 0 24 24" 
              fill={bookmarked ? 'currentColor' : 'none'}
              stroke="currentColor" 
              strokeWidth={2}
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
