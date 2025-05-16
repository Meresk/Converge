import { Card, CardContent, Typography, Box } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

interface RoomCardProps {
    name: string;
    isProtected: boolean;
    onClick: () => void;
}

export default function RoomCard({ name, isProtected, onClick }: RoomCardProps) {
    return (
        <Card
            onClick={onClick}
            elevation={8}
            sx={{
                height: '100%',
                bgcolor: '#2a2a2a',
                color: '#cfd8dc',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
                // цвет текста без transition здесь, чтобы менялся мгновенно
                '&:hover': {
                    transform: 'translateY(-6px) scale(1.03)',
                    boxShadow: '0 12px 40px rgba(33, 150, 243, 0.3)',
                    bgcolor: '#1565c0',
                    color: '#e0e0e0', // текст меняется сразу при hover
                    '& .MuiTypography-root': {
                        // анимация цвета с задержкой
                        transition: 'color 0.3s ease 0.15s',
                        color: '#e0e0e0',
                    },
                    '& svg': {
                        transition: 'color 0.3s ease 0.15s',
                        color: '#e0e0e0',
                    },
                },
                '& .MuiTypography-root': {
                    transition: 'color 0.3s ease', // переход цвета без задержки в обычном состоянии
                },
                '& svg': {
                    transition: 'color 0.3s ease',
                    color: isProtected ? '#f44336' : '#4caf50', // красный или зелёный по умолчанию
                },
            }}
        >
            <CardContent>
                <Typography
                    variant="h5"
                    component="div"
                    sx={{
                        fontWeight: '700',
                        mb: 1,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        userSelect: 'none',
                    }}
                >
                    {name}
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        fontWeight: 500,
                        userSelect: 'none',
                    }}
                >
                    {isProtected ? (
                        <>
                            <LockIcon color="error" />
                            <Typography variant="body1" color="error">
                                Защищена паролем
                            </Typography>
                        </>
                    ) : (
                        <>
                            <LockOpenIcon color="success" />
                            <Typography variant="body1" color="success.main">
                                Открытая комната
                            </Typography>
                        </>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}
