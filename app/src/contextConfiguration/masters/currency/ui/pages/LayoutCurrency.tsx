import { DataGrid } from '@mui/x-data-grid'
import { columns } from '../GridCol'
import { Box } from '@mui/material';
import { currencies, CurrencyENTITY } from 'logiflowerp-sdk';

export default function LayoutCurrency() {

	return (
		<Box
			sx={{
				height: '85vh',
				width: '100%',
				'& .actions': {
					color: 'text.secondary',
				},
				'& .textPrimary': {
					color: 'text.primary',
				},
			}}
		>
			<DataGrid
				rows={currencies.map(c => {
					const entity = new CurrencyENTITY()
					entity.set(c)
					return entity
				})}
				columns={columns()}
				density='compact'
				getRowId={row => row.code}
				autoPageSize
			/>
		</Box>
	)
}
