import { GridRowId, GridRowModel, GridRowModesModel, GridValidRowModel } from '@mui/x-data-grid'
import { CustomDataGrid, CustomDialog } from '@shared/ui/ui-library'
import { ResourceSystemDTO, validateCustom } from 'logiflowerp-sdk'
import { useState } from 'react'
import { columnsResourceSystem } from '../GridCol/columnsResourceSystem'
import { useSnackbar } from 'notistack'

interface Props {
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	open: boolean
	resourceSystem: readonly GridValidRowModel[]
	setResourceSystem: React.Dispatch<React.SetStateAction<readonly GridRowModel[]>>
}

export function ResourceSystemDialog(props: Props) {

	const { open, resourceSystem, setOpen, setResourceSystem } = props

	const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
	const newRowTemplate: Partial<ResourceSystemDTO & { fieldToFocus: keyof ResourceSystemDTO }> = { ...new ResourceSystemDTO(), fieldToFocus: 'resource_id' }
	const { enqueueSnackbar } = useSnackbar()

	const handleDeleteClick = (id: GridRowId) => async () => {
		try {
			setResourceSystem(resourceSystem.filter((row) => row._id !== id))
			enqueueSnackbar({ message: '¡Pre eliminado 🚀, por favor cierre el modal y guarde cambios!', variant: 'info' })
		} catch (error) {
			console.error(error)
			enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
		}
	}

	const processRowUpdate = async (newRow: GridRowModel) => {
		try {
			const updatedRow = { ...newRow, isNew: false }
			await validateCustom(newRow, ResourceSystemDTO, Error)
			setResourceSystem(resourceSystem.map((row) => (row._id === newRow._id ? newRow : row)))
			enqueueSnackbar({ message: 'Pre actualizado 🚀, por favor cierre el modal y guarde cambios!', variant: 'success' })
			return updatedRow
		} catch (error) {
			console.error(error)
			enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
		}
	}

	return (
		<CustomDialog
			open={open}
			setOpen={setOpen}
			title='Recursos de sistemas'
		>
			<CustomDataGrid
				rows={resourceSystem}
				setRows={setResourceSystem}
				rowModesModel={rowModesModel}
				setRowModesModel={setRowModesModel}
				columns={columnsResourceSystem({
					handleDeleteClick,
					rowModesModel,
					setRowModesModel,
					rows: resourceSystem,
					setRows: setResourceSystem,
					buttonDelete: true,
					buttonEdit: true
				})}
				newRowTemplate={newRowTemplate}
				processRowUpdate={processRowUpdate}
				buttonCreate
				height='50vh'
			/>
		</CustomDialog>
	)
}