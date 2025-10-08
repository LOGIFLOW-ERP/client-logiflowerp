import { Box, SxProps, Theme, Tooltip } from '@mui/material'
import EditSquareIcon from '@mui/icons-material/EditSquare';
import { MouseEventHandler } from 'react'

interface Props {
    value: string
    onClick?: MouseEventHandler<SVGSVGElement> | undefined
    sx?: SxProps<Theme> | undefined
}

export function CustomCellEdit(props: Props) {
    const { value, onClick, sx } = props
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', ...sx }}>
            <span>{value}</span>
            <Tooltip title='Editar'>
                <EditSquareIcon
                    sx={{
                        color: '#2196f3',
                        alignSelf: 'center',
                        ml: '4px',
                        cursor: 'pointer',
                        fontSize: 20
                    }}
                    onClick={onClick}
                />
            </Tooltip>
        </Box>
    )
}