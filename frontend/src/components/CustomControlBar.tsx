import { useRoomContext } from "@livekit/components-react";
import {Mic, MicOff, ExitToApp, StopScreenShare, ScreenShare} from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useState } from "react";
import {getToken} from "../services/auth/storage.ts";

export function CustomControlBar() {
    const jwtToken = getToken();
    console.log(jwtToken);
    const room = useRoomContext();
    const [micEnabled, setMicEnabled] = useState(false);
    const [screenEnabled, setScreenEnabled] = useState(false);

    const toggleMic = () => {
        room.localParticipant.setMicrophoneEnabled(!micEnabled);
        setMicEnabled(!micEnabled);
    };

    const toggleScreen = async () => {
        await room.localParticipant.setScreenShareEnabled(!screenEnabled);
        setScreenEnabled(!screenEnabled);
    };

    const leaveRoom = () => {
        room.disconnect();
    };

    return (
        <div
            style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                backgroundColor: 'rgba(0,0,0,0.7)',
                padding: '0.5rem 1rem',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                    alignItems: 'center',
                }}
            >
                {jwtToken && (
                    <>
                        <Tooltip title={micEnabled ? "Выключить микрофон" : "Включить микрофон"}>
                            <IconButton onClick={toggleMic} color="primary">
                                {micEnabled ? <Mic /> : <MicOff />}
                            </IconButton>
                        </Tooltip>

                        <Tooltip title={screenEnabled ? "Остановить демонстрацию экрана" : "Поделиться экраном"}>
                            <IconButton onClick={toggleScreen} color="primary">
                                {screenEnabled ? <StopScreenShare /> : <ScreenShare />}
                            </IconButton>
                        </Tooltip>
                    </>
                )}

                {/* Кнопка выхода всегда видна и тоже входит в flex */}
                <Tooltip title="Покинуть комнату">
                    <IconButton onClick={leaveRoom} color="error">
                        <ExitToApp />
                    </IconButton>
                </Tooltip>
            </div>
        </div>
    );

}
