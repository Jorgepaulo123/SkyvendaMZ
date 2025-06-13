import { Send, Bot, Loader2, Trash, Plus,MapPin } from 'lucide-react';
import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';

interface Product {
  id: string;
  thumb: string;
  title: string;
  price: number;
  stock_quantity: number;
  province: string;
}

interface MessageContent {
  ai_message?: string;
  response?: string;
  api_data?: Product[];
}

interface Message {
  type: 'text' | 'just_chat' | 'without_api' | 'with_api' | 'error';
  content: string | MessageContent;
  isUser: boolean;
}

export default function SkAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const submit = async () => {
    if (!newMessage.trim()) return;
    
    const userMessage = newMessage;
    setMessages(prev => [...prev, { type: 'text', content: userMessage, isUser: true }]);
    setNewMessage('');
    setLoading(true);

    try {
      const data = {
        'message': userMessage,
        'sender_id': "ghost"
      };
      
      const res = await axios.post('https://skyvendamz-1.onrender.com/skai', data);
      setMessages(prev => [...prev, { type: res.data.type, content: res.data, isUser: false }]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { type: 'error', content: 'Occoreu um erro, verifique a sua ligacao', isUser: false }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const renderMessage = (message: Message, index: number) => {
    if (message.isUser) {
      return (
        <div key={index} className="flex justify-end mb-4 transform transition-all duration-300 ease-out">
          <div className="bg-indigo-500 text-white rounded-2xl rounded-tr-none px-4 py-2.5 max-w-[80%] break-words shadow-sm">
            {message.content as string}
          </div>
        </div>
      );
    }
    console.log(message)
    switch (message.type) {
      
      case 'just_chat':
      case 'without_api':
        const content = message.content as MessageContent;
        return (
          <div key={index} className="flex mb-4 transform transition-all duration-300 ease-out">
            <div className="text-gray-800 max-w-[80%] break-words">
              {content.ai_message || content.response}
            </div>
          </div>
        );

      case 'with_api':
        const apiContent = message.content as MessageContent;
        console.log('API Content:', apiContent); // Para debug
        return (
          <div key={index} className="flex flex-col mb-4 transform transition-all duration-300 ease-out">
            <div className="flex mb-2">
              <div className="text-gray-900 font-b px-4 py-2.5 max-w-[80%] break-words">
                {apiContent.ai_message}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 ml-10">
              {Array.isArray(apiContent.api_data) && apiContent.api_data.length > 0 ? (
                apiContent.api_data.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100">
                    <div className="relative pb-[100%]">
                      <img 
                        src={`https://skyvendamz-1.onrender.com/produto/${product.thumb}`}
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          e.currentTarget.src = 'https://skyvenda-mz.vercel.app/default.png';
                        }}
                        alt={product.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-2">{product.title}</h3>
                      <p className="text-indigo-600 text-xs font-semibold mt-1">
                        {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'MZN' })}
                      </p>
                      <div className="flex items-center mt-1 gap-1">
                        <MapPin className="w-3 h-3 text-indigo-600" />
                        <p className="text-xs text-gray-500">
                          {product.province}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-4">
                  <p className="text-gray-500">Nenhum produto encontrado</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'error':
        return (
          <div key={index} className="flex mb-4">
            <div className="bg-red-50 text-red-600 rounded-2xl rounded-tl-none px-4 py-2.5 max-w-[80%] break-words">
             <span>Occoreu um erro 😢</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-white via-white to-indigo-100">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-gray-200 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <Bot className="w-5 h-5 text-indigo-600" />
            </div>
            <h1 className="text-lg font-semibold text-gray-800">Assistante SkAI</h1>
          </div>
          <button 
            className="p-2 hover:bg-indigo-50 rounded-full transition-colors duration-200"
            onClick={clearChat}
          >
            <Trash className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto mt-16 mb-20">
        <div className="max-w-2xl mx-auto px-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                <Bot className="w-8 h-8 text-indigo-600" />
              </div>
              <h1 className="text-2xl text-gray-800 font-semibold">Bem-vindo ao SkAI</h1>
              <p className="text-gray-500">Como posso ajudar você hoje?</p>
            </div>
          ) : (
            messages.map((msg, index) => renderMessage(msg, index))
          )}
          {loading && (
            <div className="flex items-center space-x-2.5 text-gray-500 ml-10">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">SkAI está digitando...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
<div className="fixed bottom-0 left-0 right-0 bg-transparent px-4 py-4 z-50">
  <div className="max-w-2xl mx-auto">
    <div className="flex items-center bg-white/60 py-1 backdrop-blur-md shadow-md border-white border rounded-full">
      <div className="flex items-center pl-4">
        <Plus className="w-5 h-5 text-gray-500" />
      </div>
      <input
        type="text"
        placeholder="Fale com o SkAI..."
        className="flex-grow py-2.5 px-3 bg-transparent outline-none text-gray-700 placeholder-gray-500"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <button
        onClick={submit}
        disabled={loading || !newMessage.trim()}
        className={`
          p-3 mr-5 rounded-full bg-white transition-all duration-200 
          ${newMessage.trim() 
            ? 'opacity-100 scale-100 text-indigo-600 hover:text-indigo-700 hover:bg-white/30' 
            : 'opacity-0  pointer-events-none'
          }
        `}
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  </div>
</div>

    </div>
  );
}