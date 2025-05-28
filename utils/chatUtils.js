export const createNewChat = (messageData) => ({
  participants: [messageData.from_user, messageData.to_user],
  messages: [messageData],
  lastMessage: messageData
});

export const updateChatsWithMessage = (chats, newMessage) => {
  return chats.map(chat => {
    if (chat.participants.includes(newMessage.from_user) && 
        chat.participants.includes(newMessage.to_user)) {
      return {
        ...chat,
        messages: [...chat.messages, newMessage],
        lastMessage: newMessage
      };
    }
    return chat;
  });
};

export const createUpdateMessageById = (setChats) => (messageId, updateFn) => {
  setChats(prevChats => 
    prevChats.map(chat => ({
      ...chat,
      messages: chat.messages.map(msg => 
        msg.id === messageId ? updateFn(msg) : msg
      )
    }))
  );
};

export const getLastMessage = (chat) => {
  return chat.messages[chat.messages.length - 1];
};

export const filterFriends = (chats, currentUserId) => {
  return chats.map(chat => ({
    ...chat,
    friend: chat.participants.find(id => id !== currentUserId)
  }));
};