import { Search, X } from 'lucide-react';
import { base_url } from '../../../api/api';
import FriendsSkeleton from './friendsskeleton';

export default function FriendsModal({ 
  showOnlineUsers, 
  setShowOnlineUsers, 
  searchQuery, 
  setSearchQuery, 
  loadingFriends, 
  filteredFriends, 
  handleFriendSelect 
}) {
  if (!showOnlineUsers) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Iniciar nova conversa</h2>
          <X 
            className="cursor-pointer" 
            onClick={() => setShowOnlineUsers(false)}
          />
        </div>
        
        <div className="p-4 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Pesquisar amigos..."
              className="w-full p-2 pl-10 border rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loadingFriends ? (
            <FriendsSkeleton />
          ) : filteredFriends.length > 0 ? (
            filteredFriends.map(friend => (
              <div 
                key={friend.id} 
                className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  handleFriendSelect(friend);
                  setShowOnlineUsers(false);
                }}
              >
                <img 
                  src={friend.foto_perfil || "https://skyvenda-mz.vercel.app/avatar.png"}
                  alt={friend.nome}
                  className="w-12 h-12 rounded-full"
                  onError={(e) => e.target.src = `https://skyvenda-mz.vercel.app/avatar.png`}
                />
                <div>
                  <p className="font-semibold">{friend.nome}</p>
                  <p className="text-sm text-gray-500">@{friend.username}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              {searchQuery ? 'Nenhum amigo encontrado' : 'Nenhum amigo disponível'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
