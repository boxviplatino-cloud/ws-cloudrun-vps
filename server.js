import http from "http";
import { WebSocketServer } from "ws";
import { WebSocket } from "ws";

const TARGET = "ws://195.26.246.18:80";

// Servidor HTTP con respuesta 200
const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("CloudRun WebSocket Proxy OK");
});

// WebSocket listener
const wss = new WebSocketServer({ server });

wss.on("connection", (client, req) => {
    console.log("🔗 Nueva conexión entrante a Cloud Run");

    const targetSocket = new WebSocket(TARGET);

    targetSocket.on("open", () => {
        console.log("➡️ Conectado al VPS");
    });

    client.on("message", (msg) => {
        targetSocket.send(msg);
    });

    targetSocket.on("message", (msg) => {
        client.send(msg);
    });

    client.on("close", () => {
        targetSocket.close();
    });

    targetSocket.on("close", () => {
        client.close();
    });

    client.on("error", () => {});
    targetSocket.on("error", () => {});
});

// Cloud Run PORT
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log("🚀 Proxy WebSocket Cloud Run activo en puerto " + PORT);
});
