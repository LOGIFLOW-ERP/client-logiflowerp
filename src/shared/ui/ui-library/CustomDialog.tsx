import React from 'react'
import { Dialog, DialogContent, DialogProps, DialogTitle, IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
	'& .MuiDialogContent-root': {
		padding: theme.spacing(2),
		[theme.breakpoints.only('xs')]: {
			padding: 1,
		},
	},
	'& .MuiPaper-root': {
		[theme.breakpoints.only('xs')]: {
			margin: 1,
			width: '100%',
		},
	},
	'& .MuiDialogActions-root': {
		padding: theme.spacing(1),
	},
}))

interface IProps {
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	open: boolean
	title: React.ReactNode
	children: React.ReactNode
	maxWidth?: DialogProps['maxWidth']
	slotProps?: DialogProps['slotProps']
}

export function CustomDialog(props: IProps) {

	const { open, setOpen, title, children, maxWidth, slotProps } = props

	return (
		<BootstrapDialog
			onClose={() => setOpen(false)}
			aria-labelledby='customized-dialog-title'
			open={open}
			maxWidth={maxWidth}
			fullWidth
			slotProps={slotProps}
		>
			<DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
				{title}
			</DialogTitle>
			<IconButton
				aria-label='close'
				onClick={() => setOpen(false)}
				sx={(theme) => ({
					position: 'absolute',
					right: 8,
					top: 8,
					color: theme.palette.grey[500],
				})}
			>
				<CloseIcon />
			</IconButton>
			<DialogContent dividers>
				{children}
			</DialogContent>
		</BootstrapDialog>
	)
}
