import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import './feed-desktop.css';

const gradientStyles = {
  purple: 'bg-gradient-to-br from-purple-500 to-purple-600',
  blue: 'bg-gradient-to-br from-blue-500 to-blue-800',
  green: 'bg-gradient-to-br from-green-500 to-green-600',
  pink: 'bg-gradient-to-br from-pink-500 to-pink-700',
  orange: 'bg-gradient-to-br from-yellow-500 to-orange-600',
  red: 'bg-gradient-to-br from-red-500 to-red-600',
  default: 'bg-gradient-to-br from-gray-500 to-gray-600'
};

export default function PostCardDesktop({ data }) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const handleUserPress = () => {
    console.log('User pressed:', data.user?.id);
    // navigate(`/profile/${data.user?.id}`);
  };

  const gradientClass = gradientStyles[data.gradient_style] || gradientStyles.default;

  return (
    <div className="product-card-desktop">
      {/* Header */}
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
              <p className="text-xs text-gray-500">{data.time}</p>
            </div>
          </button>
          <button className="action-button-desktop">
            <MoreHorizontal size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Post Content - Square like Instagram */}
      <div className={`mx-4 my-4 p-8 rounded-lg ${gradientClass} min-h-[400px] flex items-center justify-center`}>
        <p className="text-white text-center text-lg leading-relaxed font-medium">
          {data.content}
        </p>
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
