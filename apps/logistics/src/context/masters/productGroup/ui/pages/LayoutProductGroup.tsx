import { useState } from 'react'
import { ProductGroupENTITY, validateCustom } from 'logiflowerp-sdk'
import {
  GridCellParams,
  GridRowId,
  GridRowModel,
  GridRowModesModel,
  GridValidRowModel,
} from '@mui/x-data-grid'
import { useSnackbar } from 'notistack'
import {
  useCreateMovementMutation,
  useDeleteMovementMutation,
  useGetMovementsQuery,
  useUpdateMovementMutation
} from '@shared/api'

export default function LayoutProductGroup() {

  const [rows, setRows] = useState<readonly GridValidRowModel[]>([])
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
  const newRowTemplate: Partial<ProductGroupENTITY & { fieldToFocus: keyof ProductGroupENTITY }> = { code: '', name: '', fieldToFocus: 'code' }

  const { enqueueSnackbar } = useSnackbar()
  const { data: movements, error, isLoading } = useGetMovementsQuery()
  const [createMovement, { isLoading: isLoadingCreate }] = useCreateMovementMutation()
  const [updateMovement, { isLoading: isLoadingUpdate }] = useUpdateMovementMutation()
  const [deleteMovement, { isLoading: isLoadingDelete }] = useDeleteMovementMutation()
  useEffect(() => movements && setRows(movements.map(e => ({ ...e, id: e._id }))), [movements])

  return (
    <div>LayoutProductGroup</div>
  )
}
