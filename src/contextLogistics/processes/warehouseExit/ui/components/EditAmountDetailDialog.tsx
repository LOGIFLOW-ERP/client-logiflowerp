import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle'
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { EditAmountDetailDTO } from 'logiflowerp-sdk';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { useStore } from '@shared/ui/hooks';

const resolver = classValidatorResolver(EditAmountDetailDTO)

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
    editAmountDetail: any
    isLoading: boolean
}

export function EditAmountDetailDialog(props: IProps) {
    const { open, setOpen, editAmountDetail, isLoading } = props
    const { setState, state: { selectedDetail, selectedDocument } } = useStore('warehouseExit')

    const {
        handleSubmit,
        formState: { errors },
        register,
        reset
    } = useForm({ resolver, defaultValues: { amount: selectedDetail ? selectedDetail.amount : 0 } })
    const { enqueueSnackbar } = useSnackbar()

    const handleClose = () => {
        setOpen(false);
    };

    const onSubmit = async (data: EditAmountDetailDTO) => {
        try {
            if (!selectedDocument) {
                throw new Error('¡No hay un documento seleccionado!')
            }
            if (!selectedDetail) {
                throw new Error('¡No hay un detalle seleccionado!')
            }
            const document = await editAmountDetail({
                _id: selectedDocument._id,
                keyDetail: selectedDetail.keyDetail,
                data
            }).unwrap()
            reset(new EditAmountDetailDTO())
            enqueueSnackbar({ message: 'Editado correctamente!', variant: 'success' })
            setState({ selectedDocument: document })
            handleClose()
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth='xs'>
            <DialogTitle>Editar</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Para editar la cantidad, introduzca un número aquí. Se editará la cantidad de este detalle.
                </DialogContentText>
                <form onSubmit={handleSubmit(onSubmit)} id="subscription-form">
                    <TextField
                        focused
                        label='Cantidad'
                        variant='outlined'
                        fullWidth
                        margin='dense'
                        size='small'
                        type="number"
                        slotProps={{
                            htmlInput: { step: 'any' },
                        }}
                        {...register('amount', {
                            setValueAs: (v) =>
                                v === '' ? undefined : parseFloat(v.toString().replace(',', '.')),
                        })}
                        error={!!errors.amount}
                        helperText={errors.amount?.message}
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} loading={isLoading}>Cancelar</Button>
                <Button type="submit" form="subscription-form" loading={isLoading}>
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    )
}
