import { CustomDialog } from '@shared/ui-library'
import React from 'react'
import { WINOrderENTITY } from 'logiflowerp-sdk'
import { Divider, Stack, Typography } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
    selectedRow: WINOrderENTITY
}

export function DireccionClienteDialog(props: IProps) {

    const { open, setOpen, selectedRow } = props

    return (
        <CustomDialog
            open={open}
            setOpen={setOpen}
            title={
                <Stack direction='row' alignItems='center' spacing={1}>
                    <LocationOnIcon color='primary' />
                    <Typography variant='h6'>Dirección del Cliente</Typography>
                </Stack>
            }
        >
            <Stack spacing={1}>
                <Typography variant='body1'>
                    {selectedRow.direccion_cliente.direccion}
                </Typography>

                <Divider sx={{ my: 1 }} />

                <Stack spacing={0.5}>
                    <Typography variant='body2'>
                        <strong>Código Postal:</strong> {selectedRow.direccion_cliente.codigo_postal}
                    </Typography>
                    <Typography variant='body2'>
                        <strong>Zona:</strong> {selectedRow.direccion_cliente.zona}
                    </Typography>
                    <Typography variant='body2'>
                        <strong>Región:</strong> {selectedRow.direccion_cliente.region}
                    </Typography>
                    <Typography variant='body2'>
                        <strong>Sector Operativo:</strong> {selectedRow.direccion_cliente.sector_operativo}
                    </Typography>
                    <Typography variant='body2'>
                        <strong>Tipo de Vivienda:</strong> {selectedRow.direccion_cliente.tipo_de_vivienda}
                    </Typography>
                    <Typography variant='body2'>
                        <strong>Ubicación:</strong> {selectedRow.direccion_cliente.ubicacion}
                    </Typography>
                    <Typography variant='body2'>
                        <strong>Empresa:</strong> {selectedRow.direccion_cliente.empresa}
                    </Typography>
                    <Typography variant='body2'>
                        <strong>Georreferencia:</strong> {selectedRow.direccion_cliente.georeferencia}
                    </Typography>
                </Stack>
            </Stack>
        </CustomDialog>
    )
}
