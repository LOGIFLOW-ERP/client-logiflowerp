import { GridRowId, GridRowModel, GridRowModesModel, GridValidRowModel } from '@mui/x-data-grid'
import { CustomDataGrid, CustomDialog } from '@shared/ui/ui-library'
import { ScrapingCredentialDTO, validateCustom } from 'logiflowerp-sdk'
import { useState } from 'react'
import { columnsScrapingTargets } from '../GridCol'
import { useSnackbar } from 'notistack'

interface Props {
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	open: boolean
	scrapingTargets: readonly GridValidRowModel[]
	setScrapingTargets: React.Dispatch<React.SetStateAction<readonly GridRowModel[]>>
}

export function ScrapingTargetsDialog(props: Props) {

	const { open, scrapingTargets, setOpen, setScrapingTargets } = props

	const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
	const newRowTemplate: Partial<ScrapingCredentialDTO & { fieldToFocus: keyof ScrapingCredentialDTO }> = { ...new ScrapingCredentialDTO(), fieldToFocus: 'url' }
	const { enqueueSnackbar } = useSnackbar()

	const handleDeleteClick = (id: GridRowId) => async () => {
		try {
			setScrapingTargets(scrapingTargets.filter((row) => row.url !== id))
			enqueueSnackbar({ message: '¡Eliminado 🚀!', variant: 'info' })
		} catch (error: any) {
			console.error(error)
			enqueueSnackbar({ message: error.message, variant: 'error' })
		}
	}

	const processRowUpdate = async (newRow: GridRowModel) => {
		try {
			const updatedRow = { ...newRow, isNew: false }
			await validateCustom(newRow, ScrapingCredentialDTO, Error)
			setScrapingTargets(scrapingTargets.map((row) => (row.url === newRow.url ? newRow : row)))
			enqueueSnackbar({ message: '¡Éxito 🚀!', variant: 'success' })
			return updatedRow
		} catch (error: any) {
			console.error(error)
			enqueueSnackbar({ message: error.message, variant: 'error' })
		}
	}

	return (
		<CustomDialog
			open={open}
			setOpen={setOpen}
			title='SCRAPING TARGETS'
			maxWidth='lg'
		>
			<CustomDataGrid
				rows={scrapingTargets}
				setRows={setScrapingTargets}
				rowModesModel={rowModesModel}
				setRowModesModel={setRowModesModel}
				columns={columnsScrapingTargets({
					handleDeleteClick,
					rowModesModel,
					setRowModesModel,
					rows: scrapingTargets,
					setRows: setScrapingTargets
				})}
				newRowTemplate={newRowTemplate}
				processRowUpdate={processRowUpdate}
				getRowId={(row) => row.url}
			/>
		</CustomDialog>
	)
}