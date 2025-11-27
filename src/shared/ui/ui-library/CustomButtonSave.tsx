import { Button, CircularProgress } from '@mui/material';

interface IProps {
    isLoading: boolean;
    label?: string;
}

export function CustomButtonSave({ isLoading, label = 'Guardar' }: IProps) {
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
        >
            {label}
        </Button>
    )
}
