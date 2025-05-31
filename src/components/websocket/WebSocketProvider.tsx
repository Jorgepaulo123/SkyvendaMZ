import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
// @ts-ignore - Ignorando erro de tipagem para o AuthContext
import { useAuth } from '../../context/AuthContext';

interface WebSocketContextType {
  connected: boolean;
  lastMessage: any | null;
  sendMessage: (message: any) => void;
  notificationCount: number;
  resetNotificationCount: () => void;
}

const WebSocketContext = createContext<WebSocketContextType>({
  connected: false,
  lastMessage: null,
  sendMessage: () => {},
  notificationCount: 0,
  resetNotificationCount: () => {}
});

export const useWebSocket = () => useContext(WebSocketContext);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const { token, user } = useAuth();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any | null>(null);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const notificationSound = useRef<HTMLAudioElement | null>(null);
  
  // Inicializar o som de notificação
  useEffect(() => {
    notificationSound.current = new Audio('/sound.ogg');
  }, []);
  
  // Função para tocar o som de notificação
  const playNotificationSound = () => {
    if (notificationSound.current) {
      notificationSound.current.currentTime = 0;
      notificationSound.current.play().catch(error => {
        console.warn('Erro ao tocar som de notificação:', error);
      });
    }
  };
  
  // Função para resetar a contagem de notificações
  const resetNotificationCount = () => {
    setNotificationCount(0);
  };

  useEffect(() => {
    // Só conecta ao WebSocket se o usuário estiver autenticado
    if (!token || !user) {
      return;
    }

    // Conectar ao WebSocket
    const ws = new WebSocket(`wss://skyvendamz-1.onrender.com/ws/${user.id}`);

    ws.onopen = () => {
      console.log('WebSocket conectado');
      setConnected(true);
      
      // Enviar mensagem de autenticação
      ws.send(JSON.stringify({
        type: 'authenticate',
        token: token
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket mensagem recebida:', data);
        setLastMessage(data);
        
        // Se for uma notificação ou atualização de notificação
        if (data.type === 'notification' || data.type === 'notification_update' || data.type === 'notifications_update') {
          // Tocar som de notificação
          playNotificationSound();
          
          // Incrementar contador de notificações
          if (data.type === 'notification') {
            setNotificationCount(prev => prev + 1);
          }
          
          // Disparar evento personalizado
          const notificationEvent = new CustomEvent('new-notification', { 
            detail: data.data 
          });
          window.dispatchEvent(notificationEvent);
        }
      } catch (error) {
        console.error('Erro ao processar mensagem do WebSocket:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket desconectado');
      setConnected(false);
    };

    ws.onerror = (error) => {
      console.error('Erro no WebSocket:', error);
    };

    setSocket(ws);

    // Limpar ao desmontar
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [token, user]);

  // Função para enviar mensagens pelo WebSocket
  const sendMessage = (message: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket não está conectado');
    }
  };

  return (
    <WebSocketContext.Provider value={{ 
      connected, 
      lastMessage, 
      sendMessage, 
      notificationCount,
      resetNotificationCount
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};
