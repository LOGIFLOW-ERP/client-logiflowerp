import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Box } from '@mui/material';

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement<unknown>;
	},
	ref: React.Ref<unknown>,
) {
	return <Slide direction="up" ref={ref} {...props} />;
});

interface IProps {
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	open: boolean
	title: string
	children: React.ReactNode
	toolbar?: React.ReactNode
}

export function CustomFullScreenDialog(props: IProps) {

	const { open, setOpen, title, children, toolbar } = props

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Dialog
			fullScreen
			open={open}
			onClose={handleClose}
			TransitionComponent={Transition}
		>
			<AppBar sx={{ position: 'relative' }}>
				<Toolbar>
					<IconButton
						edge="start"
						color="inherit"
						onClick={handleClose}
						aria-label="close"
					>
						<CloseIcon />
					</IconButton>
					<Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
						{title}
					</Typography>
					{toolbar}
					{/* <Button autoFocus color="inherit" onClick={handleClose}>
						save
					</Button> */}
				</Toolbar>
			</AppBar>
			<Box padding={1}>
				{children}
			</Box>
		</Dialog>
	);
}
