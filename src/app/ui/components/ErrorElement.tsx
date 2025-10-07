import { Box, Typography } from '@mui/material'

export function ErrorElement() {
    return (
        <Box
            sx={{
                display: 'flex'
            }}
        >
            <Typography variant='subtitle1'>
                😢 Ups, está función no está disponible
            </Typography>
        </Box>
    )
}
