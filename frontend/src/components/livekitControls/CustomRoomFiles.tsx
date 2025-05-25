// components/CustomRoomFiles.tsx
import React, { useEffect, useState } from "react";
import { fetchRoomFiles, uploadRoomFile, deleteRoomFile, getRoomFileDownloadUrl } from "../../services/room_file/roomFileService.ts"; // путь поправь под себя
import { getToken, isTokenValid } from "../../services/auth/storage.ts";
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import type {RoomFile} from "../../services/room_file/types.ts";

interface CustomRoomFilesProps {
    visible: boolean;
    roomId: number;
}

export const CustomRoomFiles: React.FC<CustomRoomFilesProps> = ({ visible, roomId }) => {
    const [files, setFiles] = useState<RoomFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const jwtToken = getToken();
    const validToken = isTokenValid();

    const loadFiles = async () => {
        try {
            const fetched = await fetchRoomFiles(roomId);
            setFiles(fetched);
        } catch (e: any) {
            alert(e.message);
        }
    };

    useEffect(() => {
        if (visible) {
            loadFiles();
        }
    }, [roomId, visible]);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const onUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        try {
            await uploadRoomFile(roomId, selectedFile);
            setSelectedFile(null);
            await loadFiles();
        } catch (e: any) {
            alert(e.message);
        }
        setUploading(false);
    };

    const onDelete = async (fileId: number) => {
        if (!window.confirm("Удалить файл?")) return;
        try {
            await deleteRoomFile(fileId);
            setFiles((prev) => prev.filter(f => f.id !== fileId));
        } catch (e: any) {
            alert(e.message);
        }
    };

    if (!visible) return null;

    return (
        <div
            style={{
                position: "absolute",
                right: "0px",
                top: "8px",
                bottom: "calc(var(--lk-control-bar-height) + 8px)",
                width: "320px",
                backgroundColor: "#1e1e1e",
                color: "#f1f1f1",
                display: "flex",
                flexDirection: "column",
                zIndex: 5,
                borderRadius: "12px",
                boxShadow: "0 0 15px rgba(0,0,0,0.5)",
                overflow: "hidden",
                fontSize: "0.9rem",
            }}
        >
            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "10px",
                }}
            >
                {files.length === 0 && (
                    <div style={{ textAlign: "center", color: "#888" }}>
                        Нет файлов
                    </div>
                )}
                {files.map((file) => (
                    <div
                        key={file.id}
                        style={{
                            marginBottom: "8px",
                            padding: "6px 8px",
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                            borderRadius: "6px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            wordBreak: "break-word",
                        }}
                    >
                        <a
                            href={getRoomFileDownloadUrl(file.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#2ecc71", textDecoration: "none", flexGrow: 1 }}
                            title={`Скачать ${file.file_name}`}
                        >
                            {file.file_name}
                        </a>
                        {jwtToken && validToken && (
                            <button
                                onClick={() => onDelete(file.id)}
                                style={{
                                    marginLeft: "8px",
                                    backgroundColor: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#e74c3c",
                                }}
                                aria-label="Удалить файл"
                                title="Удалить файл"
                            >
                                <DeleteIcon fontSize="small" />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {jwtToken && validToken && (
                <div
                    style={{
                        borderTop: "1px solid #444",
                        padding: "8px",
                        backgroundColor: "#2c2c2c",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    <input
                        type="file"
                        onChange={onFileChange}
                        disabled={uploading}
                        style={{ flexGrow: 1, color: "#fff" }}
                        title="Выберите файл для загрузки"
                    />
                    <button
                        onClick={onUpload}
                        disabled={!selectedFile || uploading}
                        style={{
                            padding: "8px",
                            backgroundColor: "#2ecc71",
                            border: "none",
                            borderRadius: "4px",
                            color: "white",
                            cursor: selectedFile && !uploading ? "pointer" : "default",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        aria-label="Загрузить файл"
                        title="Загрузить файл"
                    >
                        <UploadFileIcon />
                    </button>
                </div>
            )}
        </div>
    );
};
