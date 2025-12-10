import { Divider, Stack, styled, Toolbar, Tooltip, Typography } from '@mui/material'
import GridOnIcon from '@mui/icons-material/GridOn'
import IconButton from '@mui/material/IconButton'

const VerticalDivider = styled(Divider)(({ theme }) => ({
    height: 20,
    alignSelf: 'center',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
}))

interface IProps {
    title: string
    handleExportExcelClick?: () => void
}

export function CustomToolbar({ title, handleExportExcelClick }: IProps) {
    return (
        <Stack
            width='100%'
            direction='row'
            alignItems='center'
            justifyContent='space-between'
            gap={1}
            flexWrap='wrap'
            paddingX={2}
        >
            <Typography
                justifyContent='center'
                sx={{ textAlign: { xs: 'center', sm: 'left' } }}
                variant='h6'
            >
                {title}
            </Typography>
            <Stack>
                <Toolbar>
                    <VerticalDivider orientation='vertical' />
                    <Tooltip title='Exportar como Excel'>
                        <IconButton size='small' onClick={handleExportExcelClick}>
                            <GridOnIcon />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </Stack>
        </Stack>
    )
}