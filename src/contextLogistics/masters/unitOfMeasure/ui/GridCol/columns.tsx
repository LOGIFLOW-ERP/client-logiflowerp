import {
    GridColDef,
    GridRowId,
    GridRowModesModel,
    GridValidRowModel
} from '@mui/x-data-grid'
import { RowActions } from '@shared/ui-library'
import { UnitOfMeasureENTITY } from 'logiflowerp-sdk'

interface IParams {
    handleDeleteClick: (id: GridRowId) => () => void
    rowModesModel: GridRowModesModel
    setRowModesModel: React.Dispatch<React.SetStateAction<GridRowModesModel>>
    rows: readonly GridValidRowModel[]
    setRows: React.Dispatch<React.SetStateAction<readonly GridValidRowModel[]>>
    buttonEdit?: boolean
    buttonDelete?: boolean
}

export const columns = (params: IParams): GridColDef<UnitOfMeasureENTITY>[] => {
    return [
        {
            field: 'uomCode',
            headerName: 'Código',
            width: 90,
            editable: true
        },
        {
            field: 'uomName',
            headerName: 'Nombre',
            width: 180,
            editable: true
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Acciones',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => [
                <RowActions
                    id={id}
                    {...params}
                />
            ]
        },
    ]
}