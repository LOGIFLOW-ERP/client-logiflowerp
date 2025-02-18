import { Container, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';

export function LayoutAuth() {
    return (
        <Container>
            <Typography>Logiflow ERP</Typography>
            <Outlet />
        </Container>
    )
}
