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
    <div className="bg-white border-b border-gray-200 px-4 py-4">
      <div className="flex items-center space-x-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img
            src={user?.avatar || '/assets/images/default-avatar.png'}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/40x40?text=U';
            }}
          />
        </div>

        {/* Input */}
        <button
          onClick={handlePostClick}
          className="flex-1 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full px-4 py-3 text-left"
        >
          <span className="text-gray-600">
            {isAuthenticated ? 'Poste uma novidade...' : 'Entre para postar'}
          </span>
        </button>

        {/* Photo Button */}
        <button
          onClick={handlePhotoClick}
          className="flex flex-col items-center justify-center p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Camera size={20} className="text-gray-600 mb-1" />
          <span className="text-xs text-gray-600">Foto</span>
        </button>

        {/* Post Button - Mobile */}
        <button
          onClick={handlePostClick}
          className="md:hidden bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-full transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}
