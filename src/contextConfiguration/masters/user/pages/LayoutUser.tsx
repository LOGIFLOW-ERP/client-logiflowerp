import { useEffect } from 'react'
import { DataGrid, useGridApiRef } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { useSnackbar } from 'notistack'
import {
    useGetUsersQuery,
    useUpdateUserMutation,
} from '@shared/api'
import { UserENTITY, State, UpdateUserDTO } from 'logiflowerp-sdk'
import { CustomToolbar, CustomViewError } from '@shared/ui-library'
import { columns } from '../GridCol'
import { usePermissions } from '@shared/ui/hooks'
import { PERMISSIONS } from '@shared/application'

export default function LayoutUser() {
    const apiRef = useGridApiRef()

    const [
        PUT_USER_BY_ID,
    ] = usePermissions([
        PERMISSIONS.PUT_USER_BY_ID,
    ])

    const { enqueueSnackbar } = useSnackbar()
    const { data, isError, isLoading } = useGetUsersQuery()
    const [updateUser, { isLoading: isLoadingUpdate }] = useUpdateUserMutation()

    useEffect(() => {
        apiRef.current?.autosizeColumns({
            includeHeaders: true,
            includeOutliers: true,
        })
    }, [data, isLoadingUpdate, isLoading])

    const handleChangeStatusClick = async (row: UserENTITY) => {
        try {
            const dto = new UpdateUserDTO()
            dto.set(row)
            dto.state = dto.state === State.ACTIVO ? State.INACTIVO : State.ACTIVO
            await updateUser({ id: row._id, data: dto }).unwrap()
            enqueueSnackbar({ message: 'Estado actualizado con éxito', variant: 'success' })
        } catch (error: any) {
            console.error(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    if (isError) return <CustomViewError />

    return (
        <>
            <Box sx={{ height: '85vh', width: '100%' }}>
                <DataGrid<UserENTITY>
                    rows={data}
                    columns={columns({
                        handleChangeStatusClick,
                        PUT_USER_BY_ID
                    })}
                    disableRowSelectionOnClick
                    slots={{ toolbar: () => <CustomToolbar AGREGAR_NUEVO_REGISTRO={false} /> }}
                    getRowId={row => row._id}
                    loading={isLoading || isLoadingUpdate}
                    density='compact'
                    showToolbar
                    autoPageSize
                    apiRef={apiRef}
                />
            </Box>
        </>
    )
}
