import {
    GridColDef,
    // GridRowId,
    // GridRowModesModel,
    // GridValidRowModel
} from '@mui/x-data-grid'
// import { RowActions } from '@shared/ui-library'
import { UnitOfMeasureENTITY } from 'logiflowerp-sdk'

// interface IParams {
//     handleDeleteClick: (id: GridRowId) => () => void
//     rowModesModel: GridRowModesModel
//     setRowModesModel: React.Dispatch<React.SetStateAction<GridRowModesModel>>
//     rows: readonly GridValidRowModel[]
//     setRows: React.Dispatch<React.SetStateAction<readonly GridValidRowModel[]>>
//     // buttonEdit?: boolean
//     // buttonDelete?: boolean
// }

// export const columns = (params: IParams): GridColDef<UnitOfMeasureENTITY>[] => {
export const columns = (): GridColDef<UnitOfMeasureENTITY>[] => {
    return [
        {
            field: 'uomCode',
            headerName: 'Código',
            editable: true
        },
        {
            field: 'uomName',
            headerName: 'Nombre',
            editable: true
        },
        // {
        //     field: 'Acciones',
        //     type: 'actions',
        //     headerName: 'Acciones',
        //     cellClassName: 'actions',
        //     getActions: ({ id }) => [
        //         <RowActions
        //             id={id}
        //             {...params}
        //         />
        //     ]
        // },
    ]
}