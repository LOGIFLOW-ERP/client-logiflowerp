import { GridToolbarColumnsButton, GridToolbarContainer } from '@mui/x-data-grid'
import { Box, Button } from '@mui/material'
import Add from '@mui/icons-material/Add'
import { usePermissions } from '@shared/ui/hooks'
import { PERMISSIONS } from '@shared/application'

interface IProps {
    handleAddClick: React.MouseEventHandler<HTMLButtonElement>
}

export function CustomToolbar({ handleAddClick }: IProps) {

    const [POST_PROFILE] = usePermissions([PERMISSIONS.POST_PROFILE])

    return (
        <GridToolbarContainer>
            {
                POST_PROFILE && (
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
