// components/JoinRoomDialog.tsx
import { Box, Button, Fade, Modal, TextField, Typography } from '@mui/material';
import React from 'react';

interface JoinRoomDialogProps {
    open: boolean;
    onClose: () => void;
    onJoin: () => void;
    joinName: string;
    joinPassword: string;
    isProtected: boolean;
    joinError: string;
    setJoinName: (value: string) => void;
    setJoinPassword: (value: string) => void;
    setJoinError: (value: string) => void;
}

const JoinRoomDialog: React.FC<JoinRoomDialogProps> = ({
                                                           open,
                                                           onClose,
                                                           onJoin,
                                                           joinName,
                                                           joinPassword,
                                                           isProtected,
                                                           joinError,
                                                           setJoinName,
                                                           setJoinPassword,
                                                           setJoinError,
                                                       }) => {
    return (
        <Modal open={open} onClose={onClose} closeAfterTransition>
            <Fade in={open}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', sm: 420 },
                        bgcolor: '#1e1e1e',
                        color: 'white',
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                        p: 4,
                        outline: 'none',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    <Typography variant="h6" mb={3}>
                        🔗 Подключение к комнате
                    </Typography>

                    <TextField
                        fullWidth
                        label="Ваше имя*"
                        value={joinName}
                        onChange={(e) => {
                            setJoinName(e.target.value);
                            if (joinError) setJoinError('');
                        }}
                        margin="normal"
                        error={!!joinError}
                        helperText={joinError || ''}
                        InputLabelProps={{ sx: { color: '#bbb' } }}
                        InputProps={{
                            sx: {
                                color: 'white',
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#888' },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                            },
                        }}
                    />

                    {isProtected && (
                        <TextField
                            fullWidth
                            label="Пароль"
                            type="password"
                            value={joinPassword}
                            onChange={(e) => setJoinPassword(e.target.value)}
                            margin="normal"
                            InputLabelProps={{ sx: { color: '#bbb' } }}
                            InputProps={{
                                sx: {
                                    color: 'white',
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#888' },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                                },
                            }}
                        />
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={onClose}
                            sx={{
                                borderColor: '#777',
                                color: '#ccc',
                                '&:hover': {
                                    borderColor: '#aaa',
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                },
                            }}
                        >
                            Отмена
                        </Button>
                        <Button
                            variant="contained"
                            onClick={onJoin}
                            color="primary"
                            sx={{
                                fontWeight: 'bold',
                                boxShadow: '0 2px 8px rgba(33,150,243,0.4)',
                            }}
                        >
                            Подключиться
                        </Button>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
};

export default JoinRoomDialog;
