import { GridToolbarColumnsButton, GridToolbarContainer } from '@mui/x-data-grid'
import { Box, Button } from '@mui/material'
import { Add } from '@mui/icons-material'

interface IProps {
    handleClickAdd: React.MouseEventHandler<HTMLButtonElement>
}

export function CustomToolbar({ handleClickAdd }: IProps) {
    return (
        <GridToolbarContainer>
            <Button color='primary' startIcon={<Add />} onClick={handleClickAdd}>
                Agregar
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            <GridToolbarColumnsButton />
        </GridToolbarContainer>
    )
}
