import { styled } from '@mui/material/styles'
import Chip from '@mui/material/Chip'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import DoneIcon from '@mui/icons-material/Done'
import React from 'react'
import {
    GridRenderCellParams,
} from '@mui/x-data-grid'

interface StatusProps {
    status: string
}

const StyledChip = styled(Chip)(({ theme }) => ({
    justifyContent: 'left',
    '& .icon': {
        color: 'inherit',
    },
    '&.activo': {
        color: (theme).palette.success.dark,
        border: `1px solid rgb(56, 142, 60)`,
    },
    '&.inactivo': {
        color: (theme).palette.error.dark,
        border: `1px solid inherit`,
    },
}))

const Status = React.memo((props: StatusProps) => {
    const { status } = props;

    let icon: any = null;
    if (status === 'inactivo') {
        icon = <ReportProblemIcon className='icon' />
    } else if (status === 'activo') {
        icon = <DoneIcon className='icon' />
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

export function CustomStatus(params: GridRenderCellParams<any, string>) {
    if (params.value == null) {
        return ''
    }
    return <Status status={params.value} />
}