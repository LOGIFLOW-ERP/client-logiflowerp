import { Button, CircularProgress } from '@mui/material';

interface IProps {
    isLoading: boolean;
    size?: 'small' | 'medium' | 'large'
}

export function CustomButtonSearch({ isLoading, size = 'medium' }: IProps) {
    return (
        <Button
            type='submit'
            variant='contained'
            color='primary'
            fullWidth
            sx={{ marginTop: 2 }}
            loading={isLoading}
            loadingIndicator={<CircularProgress size={24} color='inherit' />}
            loadingPosition='center'
            size={size}
        >
            Buscar
        </Button>
    )
}
