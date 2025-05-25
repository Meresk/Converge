import React, { useState } from "react";
import {
    GridLayout,
    LiveKitRoom,
    ParticipantTile,
    RoomAudioRenderer,
    useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useLocation, useNavigate } from "react-router-dom";
import { Track } from "livekit-client";
import {CustomControlBar} from "../components/livekitControls/CustomControlBar.tsx";
import { CustomChat } from "../components/livekitControls/CustomChat.tsx";
import {ParticipantList} from "../components/livekitControls/ParticipantList.tsx";
import { CustomRoomFiles } from "../components/livekitControls/CustomRoomFiles.tsx";

const serverUrl = import.meta.env.VITE_SERVER_URL;
type LocationState = { token?: string, selectedRoomId: number };

const RoomPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const state = location.state as LocationState;
    const token = state?.token;

    // Управление видимостью чата
    type ActivePanel = 'chat' | 'participants' | 'files' | null;
    const [activePanel, setActivePanel] = useState<ActivePanel>(null);

    const handleOnLeave = () => {
        navigate(-1);
    };

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
                overflow: "hidden",
                position: "relative", // чтобы кнопки с absolute работали относительно этого контейнера
            }}
            onDisconnected={handleOnLeave}
        >
            <MyVideoConference panelVisible={activePanel} />
            <RoomAudioRenderer />

            <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                zIndex: 10,
                backgroundColor: "rgba(0,0,0,0.7)"
            }}>
                <CustomControlBar
                    activePanel={activePanel}
                    setActivePanel={setActivePanel}
                />
            </div>

            {/* Чат */}
            <CustomChat visible={activePanel === 'chat'} />

            <ParticipantList visible={activePanel === 'participants'} />

            <CustomRoomFiles visible={activePanel === 'files'} roomId={state.selectedRoomId} />

        </LiveKitRoom>
    );
};

interface MyVideoConferenceProps {
    panelVisible: string | null;
}

function MyVideoConference({ panelVisible }: MyVideoConferenceProps) {
    const tracks = useTracks(
        [{ source: Track.Source.ScreenShare, withPlaceholder: false }],
        { onlySubscribed: false }
    );

    return (
        <GridLayout
            tracks={tracks}
            style={{
                height: "calc(100vh - var(--lk-control-bar-height))",
                width: panelVisible != null ? "calc(100vw - 300px)" : "100vw",
                marginRight: panelVisible != null ? "300px" : "0",
                transition: "width 0.3s ease-in-out",
            }}
        >
            <ParticipantTile />
        </GridLayout>
    );
}

export default RoomPage;
