import { styled } from '@mui/material/styles'
import Chip from '@mui/material/Chip'
import PendingIcon from '@mui/icons-material/Pending'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import VerifiedIcon from '@mui/icons-material/Verified'
import React from 'react'
import {
    GridRenderCellParams,
} from '@mui/x-data-grid'
import LockResetIcon from '@mui/icons-material/LockReset';
import { StateOrder } from 'logiflowerp-sdk'
import DrawIcon from '@mui/icons-material/Draw';

interface StatusProps {
    status: string
}

const StyledChip = styled(Chip)(({ }) => ({
    justifyContent: 'left',
    '& .icon': {
        color: 'inherit',
    },
    '&.Registrado': {
        color: '#2196f3',
        border: `1px solid #2196f3`,
    },
    '&.Aprobado': {
        color: '#ff9800',
        border: `1px solid #ff9800`,
    },
    '&.Validado': {
        color: '#4caf50',
        border: `1px solid #4caf50`,
    },
    '&.Procesando': {
        color: '#ffc107',
        border: `1px solid #ffc107`,
    },
    '&.Borrador': {
        color: '#ccbb26ff',
        border: `1px solid #ccbb26ff`,
    },
}))

const Status = React.memo((props: StatusProps) => {
    const { status } = props;

    let icon: any = null;
    if (status === StateOrder.REGISTRADO) {
        icon = <PendingIcon className='icon' />
    } else if (status === StateOrder.APROBADO) {
        icon = <CheckCircleOutlineIcon className='icon' />
    } else if (status === StateOrder.VALIDADO) {
        icon = <VerifiedIcon className='icon' />
    } else if (status === StateOrder.PROCESANDO) {
        icon = <LockResetIcon className='icon' />
    } else if (status === StateOrder.BORRADOR) {
        icon = <DrawIcon className='icon' />
    }

    return (
        <StyledChip
            className={status}
            icon={icon}
            size='small'
            label={status}
            variant='outlined'
        />
    );
})

export function CustomStatusOrder(params: GridRenderCellParams<any, string>) {
    if (params.value == null) {
        return ''
    }
    return <Status status={params.value} />
}