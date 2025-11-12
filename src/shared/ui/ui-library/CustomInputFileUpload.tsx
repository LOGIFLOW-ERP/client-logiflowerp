import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Button, Tooltip } from '@mui/material';
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
    size?: 'small' | 'large' | 'medium'
    fontSize?: 'small' | 'inherit' | 'large' | 'medium'
}

export function CustomInputFileUpload(props: IProps) {
    const {
        titleTooltip,
        handleFileChange,
        multiple = false,
        accept,
        size,
        fontSize
    } = props

    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    return (
        <Tooltip title={titleTooltip}>
            <Button
                aria-describedby='InputFileUpload'
                onClick={handleClick}
                variant='outlined'
                color='info'
                size={size}
                fullWidth
            >
                <CloudUploadIcon fontSize={fontSize} />
                <VisuallyHiddenInput
                    ref={fileInputRef}
                    type='file'
                    onChange={(event) => handleFileChange(event.target.files)}
                    multiple={multiple}
                    accept={accept}
                />
            </Button>
        </Tooltip>
    )
}
