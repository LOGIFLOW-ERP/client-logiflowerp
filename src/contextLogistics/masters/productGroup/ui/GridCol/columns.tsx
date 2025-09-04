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
    buttonEdit?: boolean
    buttonDelete?: boolean
}

export const columns = (params: IParams): GridColDef<ProductGroupENTITY>[] => {
    return [
        {
            field: 'itmsGrpCod',
            headerName: 'Código',
            editable: true
        },
        {
            field: 'itmsGrpNam',
            headerName: 'Nombre',
            editable: true
        },
        {
            field: 'Acciones',
            type: 'actions',
            headerName: 'Acciones',
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