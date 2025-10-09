import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

export interface Option {
	id: number;
	month: number;
	year: number;
	name: string;
}

interface CustomMultipleSelectCheckmarksProps {
	label: string;
	options: Option[];
	value: number[]; // solo guardamos ids
	onChange: (value: number[]) => void;
	error?: string;
}

export default function CustomMultipleSelectCheckmarks({
	label,
	options,
	value,
	onChange,
	error,
}: CustomMultipleSelectCheckmarksProps) {
	const handleChange = (event: SelectChangeEvent<typeof value>) => {
		const selected = event.target.value as number[];
		onChange(selected);
	};

	return (
		<FormControl sx={{ width: '100%' }} error={!!error}>
			<InputLabel>{label}</InputLabel>
			<Select
				multiple
				value={value}
				onChange={handleChange}
				input={<OutlinedInput label={label} />}
				renderValue={(selected) =>
					options
						.filter((opt) => selected.includes(opt.id))
						.map((opt) => opt.name)
						.join(", ")
				}
				size="small"
				// MenuProps={{ disablePortal: true }}
			>
				{options.map((option) => (
					<MenuItem key={option.id} value={option.id}>
						<Checkbox checked={value.includes(option.id)} size="small" />
						<ListItemText primary={option.name} />
					</MenuItem>
				))}
			</Select>
			{error && <p style={{ color: "red" }}>{error}</p>}
		</FormControl>
	);
}
