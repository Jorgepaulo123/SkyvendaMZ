import React from 'react';
import { Camera, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function NewPostInput() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handlePostClick = () => {
    if (isAuthenticated) {
      // Navegar para página de criar post
      navigate('/create-post');
    } else {
      navigate('/login');
    }
  };

  const handlePhotoClick = () => {
    if (isAuthenticated) {
      // Navegar para página de publicar produto
      navigate('/publish-product');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3">
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {isAuthenticated && user?.perfil ? (
            <img
              src={`https://skyvendamz.up.railway.app/perfil/${user.perfil}`}
              alt="Avatar"
              className="w-10 h-10 md:w-8 md:h-8 rounded-full object-cover border-2 border-gray-100"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${user.name || 'U'}&background=6366f1&color=fff`;
              }}
            />
          ) : (
            <div className="w-10 h-10 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white">
              <span className="text-sm font-medium">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
          )}
        </div>

        {/* Input */}
        <button
          onClick={handlePostClick}
          className="new-post-input-mobile md:new-post-input-desktop flex-1 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full px-4 py-3 text-left"
        >
          <span className="text-gray-600 text-sm">
            {isAuthenticated ? 'Poste uma novidade...' : 'Entre para postar'}
          </span>
        </button>

        {/* Photo Button */}
        <button
          onClick={handlePhotoClick}
          className="action-button-mobile md:action-button-desktop flex items-center justify-center p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Camera size={22} className="text-gray-600" />
        </button>

        {/* Post Button */}
        <button
          onClick={handlePostClick}
          className="action-button-mobile md:header-button-desktop bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-full transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}
