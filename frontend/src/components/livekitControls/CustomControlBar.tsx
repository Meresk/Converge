import {
    useRoomContext,
} from "@livekit/components-react";
import {
    Mic,
    MicOff,
    ExitToApp,
    StopScreenShare,
    ScreenShare,
    Chat,
    Fullscreen,
    FullscreenExit, SpeakerNotesOff,
    Group, GroupOff, Folder, FolderOff
} from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useState } from "react";
import {getToken, isTokenValid} from "../../services/auth/storage.ts";

interface CustomControlBarProps {
    activePanel: 'chat' | 'participants' | 'files' | null;
    setActivePanel: (panel: 'chat' | 'participants'| 'files' | null) => void;
}

export function CustomControlBar({ activePanel, setActivePanel }: CustomControlBarProps) {
    const jwtToken = getToken();
    const validToken = isTokenValid()
    const room = useRoomContext();
    const [micEnabled, setMicEnabled] = useState(false);
    const [screenEnabled, setScreenEnabled] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);

    const togglePanel = (panel: 'chat' | 'participants' | 'files') => {
        setActivePanel(activePanel === panel ? null : panel);
    };

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

    const toggleFullscreen = () => {
        const elem = document.documentElement;
        if (!document.fullscreenElement) {
            elem.requestFullscreen().catch((err) => {
                console.error(`Ошибка перехода в полноэкранный режим: ${err.message}`);
            });
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
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
                {jwtToken && validToken &&  (
                    <>
                        <Tooltip title={micEnabled ? "Выключить микрофон" : "Включить микрофон"}>
                            <IconButton onClick={toggleMic} color="primary">
                                {micEnabled ? <Mic /> : <MicOff />}
                            </IconButton>
                        </Tooltip>

                        <Tooltip title={screenEnabled ? "Остановить демонстрацию экрана" : "Поделиться экраном"}>
                            <IconButton onClick={toggleScreen} color="primary">
                                {screenEnabled ? <ScreenShare /> :  <StopScreenShare />}
                            </IconButton>
                        </Tooltip>
                    </>
                )}

                <Tooltip title={activePanel === 'chat' ? "Скрыть чат" : "Показать чат"}>
                    <IconButton onClick={() => togglePanel('chat')} color="primary">
                        {activePanel === 'chat' ? <Chat /> : <SpeakerNotesOff />}
                    </IconButton>
                </Tooltip>

                <Tooltip title={activePanel === 'participants' ? "Скрыть участников" : "Показать участников"}>
                    <IconButton onClick={() => togglePanel('participants')} color="primary">
                        {activePanel === 'participants' ? <Group /> : <GroupOff />}
                    </IconButton>
                </Tooltip>

                <Tooltip title={activePanel === 'files' ? "Скрыть файлы" : "Показать файлы"}>
                    <IconButton onClick={() => togglePanel('files')} color="primary">
                        {activePanel === 'files' ? <Folder /> : <FolderOff />}
                    </IconButton>
                </Tooltip>

                <Tooltip title={isFullscreen ? "Выход из полного экрана" : "Полный экран"}>
                    <IconButton onClick={toggleFullscreen} color="primary">
                        {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                    </IconButton>
                </Tooltip>

                <Tooltip title="Покинуть комнату">
                    <IconButton onClick={leaveRoom} color="error">
                        <ExitToApp />
                    </IconButton>
                </Tooltip>
            </div>
        </div>
    );
}
