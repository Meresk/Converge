import {
    Room,
    createLocalTracks,
    RoomEvent,
    Track,
    VideoPresets,
} from 'livekit-client';
import  { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

type LocationState = { serverUrl?: string; token?: string };

export default function RoomPage() {
    const { state } = useLocation();
    const { serverUrl, token } = state as LocationState;
    const navigate = useNavigate();

    const [room, setRoom] = useState<Room | null>(null);
    const [error, setError] = useState<string>();
    const localV = useRef<HTMLVideoElement>(null);
    const remoteContainer = useRef<HTMLDivElement>(null);

    const rtcConfig: RTCConfiguration = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            {
                urls: 'turn:your.turn.server:5349?transport=tcp',
                username: 'TURN_USER',
                credential: 'TURN_PASS',
            },
        ],
    };

    useEffect(() => {
        if (!token) {
            setError('Отсутствуют token');
            return;
        }
        const roomInstance = new Room({ adaptiveStream: true, dynacast: true });

        (async () => {
            try {
                // 1) Подключаемся к серверу и комнате
                await roomInstance.connect("ws://localhost:7880", token, { rtcConfig });
                setRoom(roomInstance);

                // 2) Создаём локальные треки
                const localTracks = await createLocalTracks({
                    audio: true,
                    video: { resolution: VideoPresets.h720.resolution },
                });

                // 3) Публикуем каждый трек по‑отдельности
                for (const t of localTracks) {
                    await roomInstance.localParticipant.publishTrack(t);
                }

                // 4) Отображаем локальное видео
                localTracks.forEach(t => {
                    if (t.kind === Track.Kind.Video && localV.current) {
                        t.attach(localV.current);
                    }
                });

                // 5) Подписываемся на треки участников
                roomInstance.on(RoomEvent.TrackSubscribed, track => {
                    if (track.kind === Track.Kind.Video && remoteContainer.current) {
                        const el = track.attach();
                        el.style.width = '200px';
                        el.style.margin = '4px';
                        remoteContainer.current.appendChild(el);
                    }
                });

                roomInstance.on(RoomEvent.TrackUnsubscribed, track => {
                    track.detach().forEach(el => el.remove());
                });

                // 6) Возврат к списку комнат при отключении
                roomInstance.on(RoomEvent.Disconnected, () => {
                    navigate('/student');
                });
            } catch (e) {
                console.error(e);
                setError('Не удалось подключиться к LiveKit');
            }
        })();

        return () => {
            roomInstance.disconnect();
        };
    }, [serverUrl, token, navigate]);

    if (error) {
        return (
            <Box sx={{ p: 4, color: 'red' }}>
                <Typography>{error}</Typography>
                <Button onClick={() => navigate('/student')}>Назад</Button>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: '#121212', color: 'white', p: 3 }}>
            <Typography variant="h4">Комната LiveKit</Typography>
            <Typography>Ваше видео:</Typography>
            <video ref={localV} autoPlay muted playsInline style={{ width: 320, background: 'black' }} />
            <Typography sx={{ mt: 2 }}>Видео участников:</Typography>
            <Box ref={remoteContainer} sx={{ display: 'flex', flexWrap: 'wrap', mt: 1 }} />
            <Button
                variant="contained"
                color="error"
                sx={{ mt: 4 }}
                onClick={() => room?.disconnect()}
            >
                Выйти из комнаты
            </Button>
        </Box>
    );
}
