import React, { useState } from 'react';
import { UserPlus, X, MapPin, Store } from 'lucide-react';

export default function FriendSuggestionCard({ data }) {
  const [dismissed, setDismissed] = useState(false);
  const [following, setFollowing] = useState(false);

  const handleFollow = () => {
    setFollowing(!following);
    // Aqui você implementaria a lógica para seguir/deixar de seguir
    console.log('Follow/Unfollow:', data.id);
  };

  const handleDismiss = () => {
    setDismissed(true);
    // Aqui você implementaria a lógica para dispensar a sugestão
    console.log('Dismiss suggestion:', data.id);
  };

  if (dismissed) {
    return null;
  }

  return (
    <div className="bg-white border-b border-gray-200 md:mb-4 md:shadow-sm md:border md:border-gray-100 md:rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-2">
        <div className="flex items-center space-x-2">
          <UserPlus size={16} className="text-indigo-500" />
          <span className="text-sm font-medium text-gray-700">Sugestão para você</span>
        </div>
        <button
          onClick={handleDismiss}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <X size={16} className="text-gray-400" />
        </button>
      </div>

      {/* User Info */}
      <div className="px-4 pb-4">
        <div className="flex items-start space-x-4">
          <img
            src={data.avatar || 'https://via.placeholder.com/60x60?text=U'}
            alt={data.name}
            className="w-15 h-15 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-gray-900 text-base">
                {data.name}
              </h3>
              {data.type === 'business' && (
                <Store size={14} className="text-blue-500" />
              )}
            </div>
            
            {data.location && (
              <div className="flex items-center space-x-1 mb-2">
                <MapPin size={12} className="text-gray-500" />
                <span className="text-xs text-gray-500">{data.location}</span>
              </div>
            )}

            {data.bio && (
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3">
                {data.bio}
              </p>
            )}

            {data.mutualFriends && (
              <p className="text-xs text-gray-500 mb-3">
                {data.mutualFriends} amigos em comum
              </p>
            )}

            {data.products && (
              <p className="text-xs text-gray-500 mb-3">
                {data.products} produtos
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleFollow}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  following
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-indigo-500 text-white hover:bg-indigo-600'
                }`}
              >
                {following ? 'Seguindo' : 'Seguir'}
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
