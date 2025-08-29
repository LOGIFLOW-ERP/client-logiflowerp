import { GridToolbarColumnsButton, GridToolbarContainer } from '@mui/x-data-grid'
import { Box, Button } from '@mui/material'
import Add from '@mui/icons-material/Add'
import { usePermissions } from '@shared/ui/hooks'
import { PERMISSIONS } from '@shared/application'
import { Dispatch, SetStateAction } from 'react'

interface IProps {
    setOpenAdd: Dispatch<SetStateAction<boolean>>
}

export function CustomToolbar({ setOpenAdd }: IProps) {

    const [POST_PRODUCT_PRICE] = usePermissions([PERMISSIONS.POST_PRODUCT_PRICE])

    return (
        <GridToolbarContainer>
            {
                POST_PRODUCT_PRICE && (
                    <Button color='primary' startIcon={<Add />} onClick={() => setOpenAdd(true)}>
                        Crear
                    </Button>
                )
            }
            <Box sx={{ flexGrow: 1 }} />
            <GridToolbarColumnsButton />
        </GridToolbarContainer>
    )
}
