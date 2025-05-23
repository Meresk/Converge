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

const serverUrl = "ws://localhost:7880";
type LocationState = { token?: string, selectedRoomId?: number };

const RoomPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const state = location.state as LocationState;
    const token = state?.token;

    // Управление видимостью чата
    const [chatVisible, setChatVisible] = useState(false);

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
            <MyVideoConference chatVisible={chatVisible} />
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
                    chatVisible={chatVisible}
                    setChatVisible={setChatVisible}
                />
            </div>

            {/* Чат */}
            <CustomChat visible={chatVisible} />
        </LiveKitRoom>
    );
};

interface MyVideoConferenceProps {
    chatVisible: boolean;
}

function MyVideoConference({ chatVisible }: MyVideoConferenceProps) {
    const tracks = useTracks(
        [{ source: Track.Source.ScreenShare, withPlaceholder: false }],
        { onlySubscribed: false }
    );

    return (
        <GridLayout
            tracks={tracks}
            style={{
                height: "calc(100vh - var(--lk-control-bar-height))",
                width: chatVisible ? "calc(100vw - 300px)" : "100vw",
                marginRight: chatVisible ? "300px" : "0",
                transition: "width 0.3s ease-in-out",
            }}
        >
            <ParticipantTile />
        </GridLayout>
    );
}

export default RoomPage;
