import { Box, SxProps, Theme, Tooltip } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import { MouseEventHandler } from 'react'

interface Props {
    value: string
    onClick?: MouseEventHandler<SVGSVGElement> | undefined
    sx?: SxProps<Theme> | undefined
}

export function CustomCellInfo(props: Props) {
    const { value, onClick, sx } = props
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', ...sx }}>
            <span>{value}</span>
            <Tooltip title='Ver mas datos'>
                <InfoIcon
                    sx={{
                        color: '#2196f3',
                        alignSelf: 'center',
                        ml: '8px',
                        cursor: 'pointer',
                        fontSize: 20
                    }}
                    onClick={onClick}
                />
            </Tooltip>
        </Box>
    )
}