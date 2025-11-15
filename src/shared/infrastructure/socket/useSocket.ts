import { useEffect } from "react";
import { useSocketContext } from "./SocketContext";
import { AppSocketEvents } from "./SocketClient";

export function useSocketEvent<E extends keyof AppSocketEvents>(
    event: E,
    handler: (data: AppSocketEvents[E]) => void
) {
    const { socket } = useSocketContext();

    useEffect(() => {
        socket.on(event, handler);
        return () => {
            socket.off(event, handler);
        };
    }, [event, handler, socket]);
}
