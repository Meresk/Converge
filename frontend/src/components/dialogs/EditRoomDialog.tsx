// components/EditRoomModal.tsx
import { AutoAwesome, Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, Typography, Modal, Fade, TextField } from '@mui/material';
import { IconButton, InputAdornment } from '@mui/material';
import { useState } from 'react';

interface EditRoomModalProps {
    open: boolean;
    onClose: () => void;
    onUpdate: () => void;
    updatedName: string;
    setUpdatedName: (value: string) => void;
    updatedPassword: string;
    setUpdatedPassword: (value: string) => void;
    nameError: boolean;
    setNameError: (value: boolean) => void;
}

function generateRandomPassword(length = 6) {
    const chars = '0123456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export default function EditRoomModal({
                                          open,
                                          onClose,
                                          onUpdate,
                                          updatedName,
                                          setUpdatedName,
                                          updatedPassword,
                                          setUpdatedPassword,
                                          nameError,
                                          setNameError,
                                      }: EditRoomModalProps) {

    const [showPassword, setShowPassword] = useState(false);

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
                    <Typography variant="h6" mb={3} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        ✏️ Редактирование комнаты
                    </Typography>

                    <TextField
                        fullWidth
                        label="Название*"
                        variant="outlined"
                        value={updatedName}
                        onChange={(e) => {
                            setUpdatedName(e.target.value);
                            if (nameError && e.target.value.trim()) {
                                setNameError(false);
                            }
                        }}
                        margin="normal"
                        error={nameError}
                        helperText={nameError ? 'Название не может быть пустым' : ''}
                        InputLabelProps={{
                            sx: {
                                color: nameError ? 'error.main' : '#bbb',
                            },
                        }}
                        InputProps={{
                            sx: {
                                color: 'white',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: nameError ? 'error.main' : '#555',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: nameError ? 'error.main' : '#888',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: nameError ? 'error.main' : 'primary.main',
                                },
                            },
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Новый пароль (если нужно)"
                        variant="outlined"
                        type={showPassword ? 'text' : 'password'}
                        value={updatedPassword}
                        onChange={(e) => setUpdatedPassword(e.target.value)}
                        margin="normal"
                        InputLabelProps={{ sx: { color: '#bbb' } }}
                        InputProps={{
                            sx: {
                                color: 'white',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#555',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#888',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'primary.main',
                                },
                            },
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setUpdatedPassword(generateRandomPassword())}
                                        edge="end"
                                        sx={{ color: '#bbb' }}
                                        title="Сгенерировать пароль"
                                    >
                                        <AutoAwesome />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        sx={{ color: '#bbb' }}
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

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
                            onClick={onUpdate}
                            color="primary"
                            sx={{
                                fontWeight: 'bold',
                                boxShadow: '0 2px 8px rgba(33,150,243,0.4)',
                            }}
                        >
                            Сохранить
                        </Button>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
}
