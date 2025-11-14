import { useCallback, useEffect, useRef } from "react";
import notificationSound from '/sounds/notification.wav';

export function useSound(src: string = notificationSound) {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio(src);
    }, [src]);

    const play = useCallback(() => {
        if (!audioRef.current) return;

        audioRef.current.currentTime = 0; // Reiniciar por si se ejecuta varias veces
        audioRef.current.play().catch(() => { /* ignore */ });
    }, []);

    return play;
}
