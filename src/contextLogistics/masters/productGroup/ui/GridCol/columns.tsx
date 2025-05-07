import {
    GridColDef,
    GridRowId,
    GridRowModesModel,
    GridValidRowModel
} from '@mui/x-data-grid'
import { RowActions } from '@shared/ui-library'
import { ProductGroupENTITY } from 'logiflowerp-sdk'

interface IParams {
    handleDeleteClick: (id: GridRowId) => () => void
    rowModesModel: GridRowModesModel
    setRowModesModel: React.Dispatch<React.SetStateAction<GridRowModesModel>>
    rows: readonly GridValidRowModel[]
    setRows: React.Dispatch<React.SetStateAction<readonly GridValidRowModel[]>>
}

export const columns = (params: IParams): GridColDef<ProductGroupENTITY>[] => {
    return [
        {
            field: 'itmsGrpCod',
            headerName: 'Código',
            width: 90,
            editable: true
        },
        {
            field: 'itmsGrpNam',
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