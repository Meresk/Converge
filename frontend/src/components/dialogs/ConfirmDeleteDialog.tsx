// components/ConfirmDeleteDialog.tsx
import {
    Box,
    Button,
    Typography,
    Modal,
    Fade,
} from '@mui/material';

interface ConfirmDeleteDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    content?: string;
}

export default function ConfirmDeleteDialog({
                                                open,
                                                onClose,
                                                onConfirm,
                                                content = 'Вы уверены, что хотите удалить этот элемент?',
                                            }: ConfirmDeleteDialogProps) {
    return (
        <Modal open={open} onClose={onClose} closeAfterTransition>
            <Fade in={open}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', sm: 400 },
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
                    <Typography variant="h6" mb={2} sx={{ fontWeight: 'bold' }}>
                        🗑️ Удаление комнаты
                    </Typography>

                    <Typography sx={{ mb: 4 }}>{content}</Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
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
                            color="error"
                            onClick={onConfirm}
                            sx={{
                                fontWeight: 'bold',
                                boxShadow: '0 2px 8px rgba(244, 67, 54, 0.6)',
                            }}
                        >
                            Удалить
                        </Button>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
}
