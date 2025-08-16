import React from 'react';
import { base_url } from "../../../api/api";
import { getHours } from '../../../utils/getHours';
import ChatSkeleton from "./chatskeleton";
import { useWebSocket } from '../../../context/websoketContext';

export default function ChatList({chats,gettingChats,handleUserSelect,selectedUser}){
  const { onlineUsers } = useWebSocket();

  const getLastMessage = (chat) => {
    const lastMessage = chat.mensagens?.[chat.mensagens.length - 1];
    if (!lastMessage) return '';

    switch (lastMessage.message_type) {
      case 'audio':
        return 'Áudio';
      case 'image':
        return 'Imagem';
      case 'document':
        return 'Documento';
      default:
        return lastMessage.content || '';
    }
  };

  const getLastMessageTime = (chat) => {
    const lastMessage = chat.mensagens?.[chat.mensagens.length - 1];
    return getHours(lastMessage?.created_at);
  };
  
  return (
    <div className="flex flex-col gap-1 overflow-y-auto">
      {gettingChats ? (
        <ChatSkeleton />
      ) : (
        chats.map((chat, index) => (
          <div 
            key={`chat-${chat.id}-${index}`} 
            className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${selectedUser?.id === chat.id ? 'bg-gray-100' : ''}`}
            onClick={() => handleUserSelect(chat)}
          >
            <div className="relative">
              <img 
                src={chat.foto || `https://skyvenda-mz.vercel.app/avatar.png`} 
                alt={chat.nome} 
                className="w-12 h-12 rounded-full"
                onError={(e) => e.target.src = `https://skyvenda-mz.vercel.app/avatar.png`}
              />
              {onlineUsers.some(u => String(u.id) === String(chat.id)) && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" title="Online"></div>
              )}
            </div>
            <div className="flex-1 min-w-0"> 
              <div className="flex justify-between items-center">
                <span className="font-medium truncate">{chat.nome}</span>
                <div className="flex flex-col space-y-2">
                <span className={`${chat.total_news_msgs > 0 ? "text-skyvenda-500" : "text-gray-500"} text-xs whitespace-nowrap ml-2`}>
                  {getLastMessageTime(chat)}
                </span>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm text-gray-500 truncate mt-0.5">
                  {getLastMessage(chat)}
                </div>
                {chat.total_news_msgs >0 && (
                    <span className="bg-skyvenda-500 text-white rounded-full ml-2 h-[16px] min-w-[16px]  text-center text-xs">
                      {chat.total_news_msgs}
                    </span>
                  )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}