import { NotificationENTITY } from "logiflowerp-sdk";
import { io, Socket } from "socket.io-client";

// URL base de tu API (ajústala según tu entorno)
const API_URL = import.meta.env.VITE_SOCKET_URL || "https://api.tuapp.com";

// Define los eventos personalizados que el backend puede emitir
export interface AppSocketEvents {
    'notification:insertOne': NotificationENTITY;
    // "inventory:updated": { code: string; qty: number };
}

// Combina con eventos reservados de Socket.IO
type CombinedEvents = AppSocketEvents & {
    connect: void;
    disconnect: string;
    connect_error: Error;
};

export class SocketClient {
    private static instance: SocketClient;
    private socket: Socket;

    private constructor() {
        this.socket = io(API_URL, {
            withCredentials: true, // <-- importante para enviar cookie authToken
            autoConnect: false,
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1500,
        });

        this.registerBaseEvents();
    }

    static getInstance(): SocketClient {
        if (!SocketClient.instance) {
            SocketClient.instance = new SocketClient();
        }
        return SocketClient.instance;
    }

    private registerBaseEvents() {
        this.socket.on("connect", () => {
            console.log("🟢 Socket conectado:", this.socket.id);
        });

        this.socket.on("disconnect", (reason) => {
            console.log("🔴 Socket desconectado:", reason);
        });

        this.socket.on("connect_error", (err) => {
            console.warn("⚠️ Error de conexión socket:", err.message);
        });
    }

    connect() {
        if (!this.socket.connected) {
            console.log("🚀 Conectando socket...");
            this.socket.connect();
        }
    }

    disconnect() {
        if (this.socket.connected) {
            console.log("🔌 Desconectando socket...");
            this.socket.disconnect();
        }
    }

    on<E extends keyof CombinedEvents>(
        event: E,
        listener: (data: CombinedEvents[E]) => void
    ) {
        this.socket.on(event as string, listener as any);
    }

    off<E extends keyof CombinedEvents>(
        event: E,
        listener?: (data: CombinedEvents[E]) => void
    ) {
        this.socket.off(event as string, listener as any);
    }

    emit<E extends keyof AppSocketEvents>(
        event: E,
        data: AppSocketEvents[E]
    ) {
        this.socket.emit(event as string, data);
    }

    get isConnected() {
        return this.socket.connected;
    }
}
