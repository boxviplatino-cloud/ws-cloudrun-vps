import http from "http";
import { WebSocketServer } from "ws";
import { WebSocket } from "ws";

const TARGET = "ws://195.26.246.18:80";

const server = http.createServer();

const wss = new WebSocketServer({ server });

wss.on("connection", (client, req) => {
    console.log("🔗 Nueva conexión entrante a Cloud Run");

    const targetSocket = new WebSocket(TARGET);

    // Cuando conecta al VPS
    targetSocket.on("open", () => {
        console.log("➡️ Conectado al VPS");
    });

    // Mensajes del cliente → VPS
    client.on("message", (msg) => {
        targetSocket.send(msg);
    });

    // Mensajes desde VPS → cliente
    targetSocket.on("message", (msg) => {
        client.send(msg);
    });

    // Si Cloud Run cierra
    client.on("close", () => {
        targetSocket.close();
    });

    // Si VPS cierra
    targetSocket.on("close", () => {
        client.close();
    });

    // Errores
    client.on("error", () => {});
    targetSocket.on("error", () => {});
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log("🚀 Proxy WebSocket Cloud Run activo en puerto " + PORT);
});
