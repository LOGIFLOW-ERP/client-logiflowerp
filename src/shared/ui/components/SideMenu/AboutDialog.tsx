import { Typography, Divider, } from '@mui/material';
import { CustomDialog } from '@shared/ui-library';

export const AboutDialog = ({ open, setOpen }: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
    return (
        <CustomDialog
            open={open}
            setOpen={setOpen}
            title='Sobre Logiflow ERP'
        >
            <Typography gutterBottom>
                <strong>Logiflow ERP</strong> es una aplicación diseñada para gestionar de forma eficiente la <strong>logística de almacén</strong>, enfocándose en el <strong>despacho de materiales hacia obras</strong>.
            </Typography>
            <Typography gutterBottom>
                Permite llevar un control detallado de los trabajos, materiales, ubicaciones y movimientos logísticos, optimizando la operación diaria y facilitando la trazabilidad en tiempo real.
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" color="text.secondary">
                Versión: {__APP_VERSION__}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Desarrollado por: -
            </Typography>
        </CustomDialog>
    )
}