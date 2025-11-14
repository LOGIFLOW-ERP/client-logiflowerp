import React, { createContext, useContext, useEffect, useState } from "react";
import { SocketClient } from "./SocketClient";
import { useStore } from "@shared/ui/hooks";

interface SocketContextValue {
    socket: SocketClient;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextValue | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket] = useState(() => SocketClient.getInstance());
    const [isConnected, setIsConnected] = useState(false);
    const { state: { isAuthenticated } } = useStore('auth');

    useEffect(() => {
        const handleConnect = () => setIsConnected(true);
        const handleDisconnect = () => setIsConnected(false);

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);

        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.disconnect();
        };
    }, [socket]);

    useEffect(() => {
        if (isAuthenticated) {
            socket.connect();
        } else {
            socket.disconnect();
        }
    }, [isAuthenticated]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

export function useSocketContext() {
    const ctx = useContext(SocketContext);
    if (!ctx) {
        throw new Error("useSocketContext debe usarse dentro de <SocketProvider>");
    }
    return ctx;
}
