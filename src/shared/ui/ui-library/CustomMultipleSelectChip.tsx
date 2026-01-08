import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { Theme, useTheme } from '@mui/material/styles';
import { FormHelperText } from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
}

function getStyles(name: string, personName: readonly string[], theme: Theme) {
	return {
		fontWeight: personName?.includes(name)
			? theme.typography.fontWeightBold
			: theme.typography.fontWeightRegular,
	};
}

interface CustomMultipleSelectChipProps {
	label: string
	options: string[]
	value: string[]
	onChange: (...event: any[]) => void
	isError?: boolean
	helperText?: string
}

export function CustomMultipleSelectChip(props: CustomMultipleSelectChipProps) {
	const { label, options, value, onChange, isError, helperText } = props
	const theme = useTheme()

	const handleChange = (event: SelectChangeEvent<typeof options>) => {
		const {
			target: { value },
		} = event
		const newValue = typeof value === 'string' ? value.split(',') : value
		onChange(event, newValue)
	}

	return (
		<div>
			<FormControl size='small' sx={{ width: '100%' }} margin='normal'>
				<InputLabel id={`demo-multiple-chip-label-${label}`}>{label}</InputLabel>
				<Select
					labelId={`demo-multiple-chip-label-${label}`}
					id={`demo-multiple-chip-${label}`}
					multiple
					value={value ?? []}
					onChange={handleChange}
					input={<OutlinedInput id={`select-multiple-chip-${label}`} label={label} />}
					renderValue={(selected) => (
						<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
							{selected.map((value) => (
								<Chip key={value} label={value} />
							))}
						</Box>
					)}
					MenuProps={MenuProps}
					size='small'
				>
					{options.map((option) => (
						<MenuItem
							key={option}
							value={option}
							style={getStyles(option, value, theme)}
						>
							{option}
						</MenuItem>
					))}
				</Select>
				{isError && <FormHelperText error>{helperText}</FormHelperText>}
			</FormControl>
		</div>
	);
}
