import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Tooltip } from '@mui/material';
import { ToolbarButton } from '@mui/x-data-grid';
import { useRef } from 'react';

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
    handleFileChange: (files: FileList | null) => void
    multiple?: boolean
    accept?: string
}

export function CustomInputFileUpload(props: IProps) {
    const {
        titleTooltip,
        handleFileChange,
        multiple = false,
        accept
    } = props

    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    return (
        <Tooltip title={titleTooltip}>
            <ToolbarButton
                aria-describedby="InputFileUpload"
                onClick={handleClick}
            >
                <CloudUploadIcon fontSize='small' />
                <VisuallyHiddenInput
                    ref={fileInputRef}
                    type="file"
                    onChange={(event) => handleFileChange(event.target.files)}
                    multiple={multiple}
                    accept={accept}
                />
            </ToolbarButton>
        </Tooltip>
    )
}
