import { useState, useEffect } from "react";

const Chat = () => {
    const [clientId] = useState(Date.now());
    const [ws, setWs] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");

    useEffect(() => {
        const websocket = new WebSocket(`ws://192.168.1.63:8000/ws/${clientId}`);
        websocket.onmessage = (event) => {
            setMessages((prevMessages) => [...prevMessages, event.data]);
        };
        setWs(websocket);
        return () => websocket.close();
    }, [clientId]);

    const sendMessage = (event) => {
        event.preventDefault();
        if (ws && messageText.trim() !== "") {
            ws.send(messageText);
            setMessageText("");
        }
    };

    return (
        <div className="w-full h-[100vh]">
            <h1>WebSocket Chat</h1>
            <h2>Your ID: {clientId}</h2>
            <form onSubmit={sendMessage}>
                <input 
                    type="text" 
                    value={messageText} 
                    onChange={(e) => setMessageText(e.target.value)} 
                    autoComplete="off" 
                />
                <button type="submit">Send</button>
            </form>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
        </div>
    );
};

export default Chat;
