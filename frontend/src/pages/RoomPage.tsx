import React, { useState } from "react";
import {
    GridLayout,
    LiveKitRoom,
    ParticipantTile,
    RoomAudioRenderer,
    useTracks,
    Chat
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useLocation, useNavigate } from "react-router-dom";
import { Track } from "livekit-client";
import {closeRoom} from "../services/rooms/roomsService.ts";
import {getToken} from "../services/auth/storage.ts";
import {CustomControlBar} from "../components/CustomControlBar.tsx";

const serverUrl = "ws://localhost:7880";
type LocationState = { token?: string, selectedRoomId?: number };

const RoomPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const jwtToken = getToken();

    // Состояние для управления видимостью чата
    const [chatVisible, setChatVisible] = useState(true);

    const handleOnLeave = () => {
        navigate(-1);
    };

    const handleCloseRoom = async () => {
        const roomId = state.selectedRoomId;

        if (!roomId) {
            console.warn("roomId не задан");
            return;
        }

        try {
            await closeRoom(roomId);
            navigate('/teacher');
        } catch (err: any) {
            console.error("Ошибка:", err.message || err);
            alert(err.message || "Не удалось закрыть комнату");
        }
    }

    // Получаем токен и имя комнаты из state
    const state = location.state as LocationState;
    const token = state?.token;
    return (
        <LiveKitRoom
            video={false}
            audio={false}
            token={token}
            serverUrl={serverUrl}
            data-lk-theme="default"
            style={{
                height: "100vh",
                display: "flex",
                flexDirection: "row",
                overflow: "hidden", // Предотвращаем прокрутку
            }}
            onDisconnected={handleOnLeave}
        >
            <MyVideoConference chatVisible={chatVisible}/>
            <RoomAudioRenderer/>

            <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                zIndex: 10,
                backgroundColor: "rgba(0,0,0,0.7)"
            }}>
                <CustomControlBar />
            </div>

                {jwtToken && (
                    <button
                        onClick={handleCloseRoom}
                        style={{
                            position: "absolute",
                            top: "10px",
                            left: "10px",
                            zIndex: 3,
                            padding: "10px",
                            backgroundColor: "#e74c3c",
                            color: "white",
                            borderRadius: "5px",
                        }}
                    >
                        Закрыть комнату
                    </button>
                )}

            {/* Кнопка для скрытия/показа чата */}
            <button
                onClick={() => setChatVisible(prev => !prev)}
                style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    zIndex: 3,
                    padding: "10px",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    borderRadius: "5px",
                    }}
                >
                    {chatVisible ? "Скрыть чат" : "Показать чат"}
                </button>

                {/* Компонент чата с передачей сообщений */}
                <Chat
                    style={{
                        position: "absolute",
                        right: "0px",
                        bottom: "var(--lk-control-bar-height)",
                        width: chatVisible ? "300px" : "0", // Скрытие чата
                        height: "calc(100vh - var(--lk-control-bar-height))", // Высота чата
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        borderRadius: "8px",
                        zIndex: 1,
                        overflow: "auto", // Добавление прокрутки для чата
                        transition: "width 0.3s ease-in-out", // Плавное изменение ширины
                    }}
                />
        </LiveKitRoom>
);
};

interface MyVideoConferenceProps {
    chatVisible: boolean;
}

function MyVideoConference({chatVisible}: MyVideoConferenceProps) {
    const tracks = useTracks(
        [
            {source: Track.Source.ScreenShare, withPlaceholder: false },
        ],
        { onlySubscribed: false }
    );

    return (
        <GridLayout
            tracks={tracks}
            style={{
                height: "calc(100vh - var(--lk-control-bar-height))",
                width: chatVisible ? "calc(100vw - 300px)" : "100vw", // Регулируем ширину при скрытии чата
                marginRight: chatVisible ? "300px" : "0", // Отступ для чата
                transition: "width 0.3s ease-in-out", // Плавное изменение ширины
            }}
        >
            <ParticipantTile />
        </GridLayout>
    );
}

export default RoomPage;