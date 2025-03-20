import React from 'react'
import { Dialog, DialogContent, DialogProps, DialogTitle, IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
	'& .MuiDialogContent-root': {
		padding: theme.spacing(2),
	},
	'& .MuiDialogActions-root': {
		padding: theme.spacing(1),
	},
}))

interface IProps {
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	open: boolean
	title: string
	children: React.ReactNode
	maxWidth?: DialogProps['maxWidth']
}

export function CustomDialog(props: IProps) {

	const { open, setOpen, title, children, maxWidth } = props

	return (
		<BootstrapDialog
			onClose={() => setOpen(false)}
			aria-labelledby="customized-dialog-title"
			open={open}
			maxWidth={maxWidth}
		>
			<DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
				{title}
			</DialogTitle>
			<IconButton
				aria-label="close"
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
