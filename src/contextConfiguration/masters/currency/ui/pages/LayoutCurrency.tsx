import { DataGrid, useGridApiRef } from '@mui/x-data-grid'
import { columns } from '../GridCol'
import { Box } from '@mui/material';
import { currencies, CurrencyENTITY } from 'logiflowerp-sdk';
import { useEffect } from 'react';

export default function LayoutCurrency() {

	const apiRef = useGridApiRef()

	useEffect(() => {
		apiRef.current?.autosizeColumns({
			includeHeaders: true,
			includeOutliers: true,
		})
	}, [currencies])

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
				showToolbar
				apiRef={apiRef}
			/>
		</Box>
	)
}
