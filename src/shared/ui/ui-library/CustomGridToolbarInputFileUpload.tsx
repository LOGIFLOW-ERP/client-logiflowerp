import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { CircularProgress, Tooltip } from '@mui/material';
import { ToolbarButton } from '@mui/x-data-grid';
import { useRef } from 'react';
import { useSnackbar } from 'notistack';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

interface IProps {
    titleTooltip: string
    handleFileChange: (files: FileList | null) => Promise<void>
    multiple?: boolean
    accept?: string
    disabled?: boolean
    loading?: boolean
}

export function CustomGridToolbarInputFileUpload(props: IProps) {
    const {
        titleTooltip,
        handleFileChange,
        multiple = false,
        accept,
        disabled,
        loading
    } = props

    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const { enqueueSnackbar } = useSnackbar()

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            await handleFileChange(event.target.files)
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        } finally {
            event.target.value = ''
        }
    }

    return (
        <Tooltip title={loading ? 'Cargando...' : titleTooltip}>
            <ToolbarButton
                aria-describedby='InputFileUpload'
                onClick={handleClick}
                disabled={disabled}
            >
                {
                    loading
                        ? <CircularProgress size={12} />
                        : <>
                            <CloudUploadIcon fontSize='small' />
                            <VisuallyHiddenInput
                                ref={fileInputRef}
                                type='file'
                                onChange={handleChange}
                                multiple={multiple}
                                accept={accept}
                            />
                        </>
                }
            </ToolbarButton>
        </Tooltip>
    )
}
