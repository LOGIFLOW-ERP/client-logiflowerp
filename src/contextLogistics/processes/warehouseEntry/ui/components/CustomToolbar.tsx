import { GridToolbarColumnsButton, GridToolbarContainer } from '@mui/x-data-grid'
import { Box, Button } from '@mui/material'
import { Add } from '@mui/icons-material'
import { PERMISSIONS } from '@shared/application'
import { usePermissions } from '@shared/ui/hooks'

interface IProps {
    handleAddClick: React.MouseEventHandler<HTMLButtonElement>
}

export function CustomToolbar({ handleAddClick }: IProps) {

    const [canCreateWarehouseEntry] = usePermissions([PERMISSIONS.POST_WAREHOUSE_ENTRY])

    return (
        <GridToolbarContainer>
            {
                canCreateWarehouseEntry && (
                    <Button color='primary' startIcon={<Add />} onClick={handleAddClick}>
                        Crear
                    </Button>
                )
            }
            <Box sx={{ flexGrow: 1 }} />
            <GridToolbarColumnsButton />
        </GridToolbarContainer>
    )
}
