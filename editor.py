from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse
import uvicorn

app = FastAPI()
clients = []  # Lista para armazenar conexões WebSocket

# Página HTML com JavaScript embutido
html = """
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat WebSocket</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; }
        #chat { width: 300px; height: 300px; border: 1px solid black; overflow-y: scroll; margin: auto; padding: 5px; }
        input { width: 80%; padding: 5px; }
    </style>
</head>
<body>
    <h2>Chat WebSocket</h2>
    <div id="chat"></div>
    <input type="text" id="messageInput" placeholder="Digite uma mensagem..." />
    <button onclick="sendMessage()">Enviar</button>

    <script>
        const ws = new WebSocket("ws://localhost:8000/ws");

        ws.onmessage = (event) => {
            const chat = document.getElementById("chat");
            chat.innerHTML += "<p>" + event.data + "</p>";
            chat.scrollTop = chat.scrollHeight;
        };

        function sendMessage() {
            const input = document.getElementById("messageInput");
            ws.send(input.value);
            input.value = "";
        }
    </script>
</body>
</html>
"""

@app.get("/")
async def get():
    return HTMLResponse(html)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)  # Adiciona cliente à lista
    try:
        while True:
            data = await websocket.receive_text()
            for client in clients:  
                await client.send_text(data)  # Envia a mensagem para todos
    except:
        clients.remove(websocket)  # Remove cliente desconectado

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
