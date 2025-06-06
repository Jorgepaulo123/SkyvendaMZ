import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import { base_url } from "../api/api";
import api from "../api/api";

const WebSocketContext = createContext(null);

// Ensure proper protocol conversion by using replace with full protocol strings
const WS_URL = base_url.replace('http://', 'ws://').replace('https://', 'wss://');

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [webSocketConnected, setWebSocketConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const { token, isAuthenticated, user } = useAuth();
  const [newMessage, setNewMessage] = useState(0);
  const [newNotification, setNewNotification] = useState(0);
  const [userTyping, setUserTyping] = useState(null);
  const [userRecording, setUserRecording] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const notificationSound = useRef(null);
  const [soundLoaded, setSoundLoaded] = useState(false);
  // Estado para rastrear usuários online
  const [onlineUsers, setOnlineUsers] = useState([]);
  
  // Referências para controle de duplicação de mensagens e som
  const processedMessages = useRef(new Set());

  // Inicializa o som de notificação
  useEffect(() => {
    const audio = new Audio('/sound.ogg');
    audio.preload = 'auto';
    audio.addEventListener('canplaythrough', () => {
      setSoundLoaded(true);
      notificationSound.current = audio;
    });
    audio.addEventListener('error', (e) => {
      console.error('Erro ao carregar o som:', e);
    });

    return () => {
      if (notificationSound.current) {
        notificationSound.current.pause();
        notificationSound.current = null;
      }
    };
  }, []);

  // Função para tocar o som
  const playNotificationSound = useCallback(async () => {
    try {
      if (soundLoaded && notificationSound.current) {
        notificationSound.current.currentTime = 0;
        await notificationSound.current.play();
      }
    } catch (error) {
      console.warn('Não foi possível tocar o som de notificação:', error);
    }
  }, [soundLoaded]);

  // Já temos o cache de mensagens para evitar duplicações definido acima

  const handleIncomingMessage = useCallback(async (messageData) => {
    const { from_user, content, message_id } = messageData;
    console.log("Received message from user ID:", from_user, "Type:", typeof from_user);
    console.log("Full message data:", messageData);

    // Verifica se a mensagem já foi processada para evitar duplicação
    // Use uma combinação de dados para identificar unicamente a mensagem
    const messageKey = `${from_user}-${content}-${message_id || Date.now()}`;
    if (processedMessages.current.has(messageKey)) {
      console.log("Mensagem já processada, ignorando:", messageKey);
      return;
    }

    // Marca a mensagem como processada
    processedMessages.current.add(messageKey);
    // Limita o tamanho do cache para evitar vazamento de memória
    if (processedMessages.current.size > 100) {
      const oldestKeys = Array.from(processedMessages.current).slice(0, 50);
      oldestKeys.forEach(key => processedMessages.current.delete(key));
    }

    // Toca o som de notificação
    await playNotificationSound();

    // Normalize ID - ensure it's always a string
    const normalizedUserId = String(from_user);
    
    setChats((prevChats) => {
      console.log("Current chats:", prevChats.map(c => ({id: c.id, type: typeof c.id, username: c.username})));
      
      // First check if any chat with this user exists by ID or username
      let chatIndex = prevChats.findIndex((chat) => String(chat.id) === normalizedUserId);
      
      // If not found by ID, try to find by username if available
      if (chatIndex === -1 && messageData.sender_username) {
        chatIndex = prevChats.findIndex((chat) => 
          chat.username === messageData.sender_username
        );
      }
      
      // Create new message object
      const newMessage = {
        id: message_id || Date.now(),
        message_id: message_id || null,
        sender_id: normalizedUserId,
        receiver_id: user?.id,
        content: content,
        message_type: messageData.message_type || 'text',
        file_url: messageData.file_url || null,
        file_name: messageData.file_name || null,
        file_size: messageData.file_size || null,
        is_delivered: true,
        reaction: null,
        is_read: selectedUser?.id === normalizedUserId || selectedUser?.id === from_user,
        created_at: new Date().toISOString(),
        status: 'received'
      };

      if (chatIndex !== -1) {
        // Existing chat - update it
        const chat = prevChats[chatIndex];
        console.log("Found existing chat:", chat.id, chat.username);
        
        // Verifica se a mensagem já existe neste chat para evitar duplicação
        const messageExists = chat.mensagens && chat.mensagens.some(msg => 
          (msg.message_id && msg.message_id === newMessage.message_id) || 
          (msg.content === newMessage.content && 
           msg.sender_id === newMessage.sender_id &&
           Math.abs(new Date(msg.created_at) - new Date(newMessage.created_at)) < 1000)
        );

        if (messageExists) {
          console.log("Mensagem já existe no chat, ignorando");
          return prevChats;
        }
        
        const updatedChat = {
          ...chat,
          // Ensure ID is normalized
          id: normalizedUserId,
          mensagens: [...(chat.mensagens || []), newMessage],
          total_news_msgs: (selectedUser?.id === normalizedUserId || selectedUser?.id === from_user) ? 
            chat.total_news_msgs : 
            (chat.total_news_msgs || 0) + 1
        };

        // Update selected user if this chat is currently selected
        if (selectedUser && (selectedUser.id === normalizedUserId || selectedUser.id === from_user)) {
          setSelectedUser(updatedChat);
        }

        // Create a new array with the updated chat at the top
        const newChats = prevChats.filter((_, i) => i !== chatIndex);
        return [updatedChat, ...newChats];
      } else {
        // Check if we already started fetching this user's data (prevent double fetching)
        if (!prevChats.some(chat => String(chat.id) === normalizedUserId)) {
          console.log("No existing chat found, creating new one");
          // New chat - fetch user info and create new chat
          (async () => {
            try {
              console.log("Fetching info for new user:", normalizedUserId);
              const response = await api.get(`/usuario/perfil/${normalizedUserId}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              
              console.log("User info received:", response.data);
              
              // Check again before adding to prevent race conditions
              setChats(current => {
                // Check for both ID and username to prevent duplicates
                const userExists = current.some(chat => 
                  String(chat.id) === normalizedUserId || 
                  (chat.username && response.data.username && chat.username === response.data.username)
                );
                
                console.log("User exists check:", userExists);
                
                if (userExists) {
                  // Either the chat was added while we were fetching or we have a user with same username
                  // Find all instances of this user (by ID or username)
                  const userChats = current.filter(chat => 
                    String(chat.id) === normalizedUserId || 
                    (chat.username && response.data.username && chat.username === response.data.username)
                  );
                  
                  console.log("Found user chats:", userChats.length);
                  
                  if (userChats.length > 0) {
                    // Merge all messages from these chats
                    const allMessages = userChats.flatMap(chat => chat.mensagens || []);
                    
                    // Verifica se a mensagem já existe antes de adicionar
                    const messageExists = allMessages.some(msg => 
                      (msg.message_id && msg.message_id === newMessage.message_id) || 
                      (msg.content === newMessage.content && 
                      msg.sender_id === newMessage.sender_id &&
                      Math.abs(new Date(msg.created_at) - new Date(newMessage.created_at)) < 1000)
                    );

                    if (!messageExists) {
                      allMessages.push(newMessage);
                    }
                    
                    // Sort messages by date
                    allMessages.sort((a, b) => 
                      new Date(a.created_at) - new Date(b.created_at)
                    );
                    
                    // Remove duplicatas
                    const uniqueMessages = [];
                    const seenIds = new Set();
                    
                    for (const msg of allMessages) {
                      const msgId = msg.message_id || msg.id;
                      if (!seenIds.has(msgId)) {
                        seenIds.add(msgId);
                        uniqueMessages.push(msg);
                      }
                    }
                    
                    // Create a merged chat with the newest ID
                    const mergedChat = {
                      id: normalizedUserId,
                      nome: response.data.nome,
                      username: response.data.username,
                      foto: response.data.foto_perfil,
                      mensagens: uniqueMessages,
                      total_news_msgs: 1 + userChats.reduce((sum, chat) => sum + (chat.total_news_msgs || 0), 0)
                    };
                    
                    console.log("Created merged chat with ID:", mergedChat.id);
                    
                    // Remove all instances of this user
                    const filteredChats = current.filter(chat => 
                      String(chat.id) !== normalizedUserId && 
                      (!chat.username || !response.data.username || chat.username !== response.data.username)
                    );

                    // Update selected user if this is the current chat
                    if (selectedUser && (selectedUser.id === normalizedUserId || selectedUser.id === from_user)) {
                      setSelectedUser(mergedChat);
                    }
                    
                    return [mergedChat, ...filteredChats];
                  }
                }
                
                const newChat = {
                  id: normalizedUserId,
                  nome: response.data.nome,
                  username: response.data.username,
                  foto: response.data.foto_perfil,
                  mensagens: [newMessage],
                  total_news_msgs: 1
                };
                
                console.log("Created brand new chat with ID:", newChat.id);

                // Update selected user if this is the current chat
                if (selectedUser && (selectedUser.id === normalizedUserId || selectedUser.id === from_user)) {
                  setSelectedUser(newChat);
                }
  
                return [newChat, ...current];
              });
            } catch (error) {
              console.error('Error fetching new user info:', error);
            }
          })();
        }
      }

      return prevChats;
    });
  }, [user, selectedUser, token, playNotificationSound]);

  const updateMessageById = useCallback((messageId, updateFn) => {
    if (!messageId) return;
    
    console.log("Atualizando mensagem por ID:", messageId);
    
    // Se temos um chat selecionado, atualizamos ele primeiro
    if (selectedUser) {
      setSelectedUser(prev => {
        if (!prev.mensagens) return prev;
        
        const updatedMensagens = prev.mensagens.map(msg => {
          if (msg.message_id === messageId || msg.id === messageId) {
            console.log("Mensagem encontrada e atualizada no selectedUser");
            return updateFn(msg);
          }
          return msg;
        });
        
        return {
          ...prev,
          mensagens: updatedMensagens
        };
      });
    }
    
    // Depois atualizamos os chats
    setChats(prevChats => {
      const updatedChats = prevChats.map(chat => {
        if (!chat.mensagens) return chat;
        
        const updatedMensagens = chat.mensagens.map(msg => {
          if (msg.message_id === messageId || msg.id === messageId) {
            console.log("Mensagem encontrada e atualizada nos chats");
            return updateFn(msg);
          }
          return msg;
        });
        
        return {
          ...chat,
          mensagens: updatedMensagens
        };
      });

      return updatedChats;
    });
  }, [selectedUser]);

  // Função para lidar com notificações
  const handleNotification = useCallback((notification) => {
    if (notification.type === 'user_connected') {
      // Adicionar usuário à lista de usuários online
      setOnlineUsers(prev => {
        // Verificar se o usuário já está na lista
        if (prev.some(u => u.id === notification.user_id)) {
          return prev;
        }
        return [...prev, { 
          id: notification.user_id, 
          username: notification.username,
          last_seen: new Date().toISOString()
        }];
      });
    } else if (notification.type === 'user_disconnected') {
      // Remover usuário da lista de usuários online
      setOnlineUsers(prev => prev.filter(u => u.id !== notification.user_id));
    }
    playNotificationSound();
  }, [playNotificationSound]);

  // Função para enviar mensagem via WebSocket
  const sendWebSocketMessage = useCallback((type, content, toUser, additionalData = {}) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const message = {
        type,
        to_user: toUser,
        content,
        ...additionalData
      };
      socket.send(JSON.stringify(message));
    }
  }, [socket]);

  const connectWebSocket = useCallback(() => {
    // Não tentar conectar se já estiver conectado ou em processo de reconexão
    if (webSocketConnected || isReconnecting || !isAuthenticated || !token || !isOnline) return;

    setIsReconnecting(true);
    const ws = new WebSocket(`${WS_URL}/ws?token=${token}`);

    ws.onopen = () => {
      console.log("WebSocket conectado!");
      setWebSocketConnected(true);
      setIsReconnecting(false);
    };
  
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch(data.type) {
        case 'message':
          handleNotification(data.data);
          setNewMessage(prev => prev + 1);
          handleIncomingMessage(data.data);
          break;
        case 'typing':
          setUserTyping(data.data.username);
          setTimeout(() => setUserTyping(null), 3000);
          break;
        case 'recording':
          setUserRecording(data.data.status === 'start' ? data.data.username : null);
          break;
        case 'user_status':
          // Atualizar status do usuário (online/offline)
          if (data.data.status === 'online') {
            setOnlineUsers(prev => {
              if (prev.some(u => u.id === data.data.user_id)) {
                return prev.map(u => u.id === data.data.user_id ? 
                  {...u, last_seen: new Date().toISOString()} : u);
              }
              return [...prev, { 
                id: data.data.user_id, 
                username: data.data.username,
                last_seen: new Date().toISOString()
              }];
            });
          } else if (data.data.status === 'offline') {
            setOnlineUsers(prev => prev.filter(u => u.id !== data.data.user_id));
          }
          break;
        case 'message_status':
          if (data.data.message_id) {
            updateMessageById(data.data.message_id, msg => ({
              ...msg,
              is_delivered: true,
              file_url: data.data.file_url && data.data.file_url.trim() !== '' ? 
                       data.data.file_url : msg.file_url
            }));
          }
          break;
        case 'notification':
          handleNotification(data.data);
          setNewNotification(prev => prev + 1)
          break;
        case 'order_status':
          console.log('Recebido status do pedido:', data.data);
          // Aqui podemos adicionar lógica para atualizar o status do pedido se necessário
          toast({
            title: data.data.success ? "✨ Sucesso!" : "😢 Erro",
            description: data.data.message || (data.data.success ? "Pedido processado com sucesso!" : "Erro ao processar pedido"),
          });
          break;
        default:
          console.log('Unknown message type:', data);
      }
    };

    ws.onerror = (error) => {
      console.error("Erro WebSocket:", error);
      setWebSocketConnected(false);
    };

    ws.onclose = () => {
      console.log("WebSocket desconectado!");
      setWebSocketConnected(false);
      if (isOnline && isAuthenticated) {
        console.log("Tentando reconectar em 10 segundos...");
        setTimeout(() => {
          setIsReconnecting(false);
          connectWebSocket();
        }, 10000); // 10 segundos entre tentativas
      }
    };

    setSocket(ws);
    return ws;
  }, [token, isAuthenticated, isOnline, webSocketConnected, isReconnecting, handleIncomingMessage, updateMessageById]);

  useEffect(() => {
    const handleOnline = () => {
      console.log("Conexão de internet restaurada");
      setIsOnline(true);
      if (!webSocketConnected) {
        connectWebSocket();
      }
    };

    const handleOffline = () => {
      console.log("Conexão de internet perdida");
      setIsOnline(false);
      if (socket) {
        socket.close();
        setSocket(null);
        setWebSocketConnected(false);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Iniciar conexão WebSocket se estiver online
    let ws = null;
    if (isOnline && !webSocketConnected) {
      ws = connectWebSocket();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (ws) {
        ws.close();
        setWebSocketConnected(false);
        console.log("WebSocket fechado!");
      }
    };
  }, [connectWebSocket, socket, webSocketConnected]);

  const contextValue = {
    socket,
    isOnline,
    webSocketConnected,
    reconnect: connectWebSocket,
    newMessage,
    setNewMessage,
    userTyping,
    setUserTyping,
    userRecording,
    setUserRecording,
    chats,
    setChats,
    selectedUser,
    setSelectedUser,
    updateMessageById,
    sendWebSocketMessage,
    handleIncomingMessage,
    notificationSound,
    newNotification,
    onlineUsers,
    setOnlineUsers
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);