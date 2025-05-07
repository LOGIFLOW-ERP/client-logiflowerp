import { GridToolbarColumnsButton, GridToolbarContainer } from '@mui/x-data-grid'
import { Box, Button } from '@mui/material'
import { Add } from '@mui/icons-material'
import { usePermissions } from '@shared/ui/hooks'
import { PERMISSIONS } from '@shared/application'

interface IProps {
    handleAddClick: React.MouseEventHandler<HTMLButtonElement>
}

export function CustomToolbar({ handleAddClick }: IProps) {

    const [canCreateWarehouseReturn] = usePermissions([PERMISSIONS.POST_WAREHOUSE_RETURN])

    return (
        <GridToolbarContainer>
            {
                canCreateWarehouseReturn && (
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
