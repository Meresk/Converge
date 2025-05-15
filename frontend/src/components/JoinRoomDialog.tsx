import React, { useState, useEffect } from "react";
import {
    Modal,
    Fade,
    Box,
    Typography,
    TextField,
    Button,
} from "@mui/material";

type JoinRoomDialogProps = {
    open: boolean;
    onClose: () => void;
    onJoin: (name: string, password?: string) => void;
    isProtected?: boolean;
    error?: string;
};

export const JoinRoomDialog: React.FC<JoinRoomDialogProps> = ({
                                                                  open,
                                                                  onClose,
                                                                  onJoin,
                                                                  isProtected = false,
                                                                  error = "",
                                                              }) => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [localError, setLocalError] = useState("");

    useEffect(() => {
        if (!open) {
            setName("");
            setPassword("");
            setLocalError("");
        }
    }, [open]);

    const handleJoin = () => {
        if (!name.trim()) {
            setLocalError("Введите имя");
            return;
        }
        setLocalError("");
        onJoin(name.trim(), password);
    };

    return (
        <Modal open={open} onClose={onClose} closeAfterTransition>
            <Fade in={open}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: { xs: "90%", sm: 420 },
                        bgcolor: "#1e1e1e",
                        color: "white",
                        borderRadius: 3,
                        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                        p: 4,
                        outline: "none",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                >
                    <Typography variant="h6" mb={3}>
                        🔗 Подключение к комнате
                    </Typography>

                    <TextField
                        fullWidth
                        label="Ваше имя*"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            if (localError) setLocalError("");
                        }}
                        margin="normal"
                        error={!!localError}
                        helperText={localError || error || ""}
                        InputLabelProps={{ sx: { color: "#bbb" } }}
                        InputProps={{
                            sx: {
                                color: "white",
                                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#555" },
                                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#888" },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "primary.main",
                                },
                            },
                        }}
                    />

                    {isProtected && (
                        <TextField
                            fullWidth
                            label="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            type="password"
                            InputLabelProps={{ sx: { color: "#bbb" } }}
                            InputProps={{
                                sx: {
                                    color: "white",
                                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#555" },
                                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#888" },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "primary.main",
                                    },
                                },
                            }}
                        />
                    )}

                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={onClose}
                            sx={{
                                borderColor: "#777",
                                color: "#ccc",
                                "&:hover": {
                                    borderColor: "#aaa",
                                    backgroundColor: "rgba(255,255,255,0.05)",
                                },
                            }}
                        >
                            Отмена
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleJoin}
                            color="primary"
                            sx={{
                                fontWeight: "bold",
                                boxShadow: "0 2px 8px rgba(33,150,243,0.4)",
                            }}
                        >
                            Присоединиться
                        </Button>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
};
