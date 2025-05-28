// Update message by ID in chat messages
export function updateMessageById(chats, messageId, updateFn) {
    if (!chats || !Array.isArray(chats)) return [];
    
    return chats.map(chat => ({
        ...chat,
        mensagens: chat.mensagens?.map(msg => {
            if (msg.id === messageId || msg.message_id === messageId) {
                return updateFn(msg);
            }
            return msg;
        })
    }));
}

// Get the last message from a chat
export function getLastMessage(chat) {
    if (!chat || !chat.mensagens || chat.mensagens.length === 0) return '';
    
    const lastMsg = chat.mensagens[chat.mensagens.length - 1];
    
    // Handle different message types
    if (lastMsg.message_type === 'image') {
        return '🖼️ Imagem';
    } else if (lastMsg.message_type === 'audio') {
        return '🎵 Áudio';
    } else if (lastMsg.message_type === 'video') {
        return '🎬 Vídeo';
    } else if (lastMsg.message_type === 'pdf') {
        return '📄 Documento';
    } else {
        return lastMsg.content || '';
    }
}

// Filter friends by search query
export function filterFriends(friends, searchQuery) {
    return friends.filter(friend => 
        friend.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
}

// Create a new chat object from a friend
export function createNewChat(friend) {
    return {
        id: friend.id,
        nome: friend.nome,
        username: friend.username,
        foto: friend.foto_perfil || null,
        avatar: friend.foto_perfil || null,
        sky_user_id: friend.identificador_unico || null,
        mensagens: [],
        total_news_msgs: 0
    };
}

// Update chats list with a new message
export function updateChatsWithMessage(chats, selectedUser, newMessage) {
    if (!chats || !Array.isArray(chats)) {
        chats = [];
    }
    
    const existingChatIndex = chats.findIndex(
        (chat) => String(chat.id) === String(selectedUser.id)
    );

    if (existingChatIndex !== -1) {
        const chat = chats[existingChatIndex];
        
        // Check if message already exists to avoid duplicates
        const messageExists = chat.mensagens?.some(msg => 
            (msg.message_id && msg.message_id === newMessage.message_id) || 
            (msg.id && msg.id === newMessage.id)
        );
        
        if (messageExists) {
            // Update the message instead of adding a duplicate
            const updatedChat = {
                ...chat,
                mensagens: chat.mensagens.map(msg => {
                    if ((msg.message_id && msg.message_id === newMessage.message_id) || 
                        (msg.id && msg.id === newMessage.id)) {
                        return { ...msg, ...newMessage };
                    }
                    return msg;
                }),
            };
            return [
                updatedChat,
                ...chats.filter((_, i) => i !== existingChatIndex),
            ];
        } else {
            // Add new message
            const updatedChat = {
                ...chat,
                mensagens: [...(chat.mensagens || []), newMessage],
            };
            return [
                updatedChat,
                ...chats.filter((_, i) => i !== existingChatIndex),
            ];
        }
    } else {
        return [
            {
                ...selectedUser,
                mensagens: [newMessage],
            },
            ...chats,
        ];
    }
}

// Format message timestamp for display
export function formatMessageTime(timestamp) {
    if (!timestamp) return '';
    
    try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return '';
        
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();
        
        if (isToday) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (isYesterday) {
            return `Ontem ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else {
            return date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: '2-digit' });
        }
    } catch (error) {
        console.error('Error formatting message time:', error);
        return '';
    }
}

// Check if a message is pending (not yet confirmed by server)
export function isMessagePending(message) {
    return !message.id || message.status === 'pending';
}

// Sort messages by timestamp
export function sortMessagesByTimestamp(messages) {
    if (!messages || !Array.isArray(messages)) return [];
    
    return [...messages].sort((a, b) => {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return timeA - timeB;
    });
}

// Get appropriate file icon based on message type
export function getFileIcon(messageType) {
    switch (messageType) {
        case 'image':
            return '🖼️';
        case 'audio':
            return '🎵';
        case 'video':
            return '🎬';
        case 'pdf':
            return '📄';
        default:
            return '📎';
    }
}

// Format file size for display
export function formatFileSize(bytes) {
    if (!bytes || isNaN(bytes)) return '';
    
    if (bytes < 1024) {
        return bytes + ' B';
    } else if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(1) + ' KB';
    } else if (bytes < 1024 * 1024 * 1024) {
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    } else {
        return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
    }
}
