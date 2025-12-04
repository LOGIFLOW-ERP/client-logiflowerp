import { Button, CircularProgress } from '@mui/material';

interface IProps {
    isLoading: boolean;
    label?: string;
    size?: 'small' | 'medium' | 'large';
    color?: 'error' | 'success' | 'warning' | 'info' | 'inherit' | 'primary' | 'secondary' | undefined
}

export function CustomButtonSave({ isLoading, label = 'Guardar', size = 'medium', color = 'primary' }: IProps) {
    return (
        <Button
            type='submit'
            variant='contained'
            color={color}
            fullWidth
            sx={{ marginTop: 2 }}
            loading={isLoading}
            loadingIndicator={<CircularProgress size={24} color='inherit' />}
            loadingPosition='center'
            size={size}
        >
            {label}
        </Button>
    )
}
