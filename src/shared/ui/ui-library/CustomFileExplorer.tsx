import * as React from 'react';
import { animated, useSpring } from '@react-spring/web';
import { styled, alpha, useTheme } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import ArticleIcon from '@mui/icons-material/Article';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FolderRounded from '@mui/icons-material/FolderRounded';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeItem, UseTreeItemParameters } from '@mui/x-tree-view/useTreeItem';
import {
    TreeItemCheckbox,
    TreeItemIconContainer,
    TreeItemLabel,
} from '@mui/x-tree-view/TreeItem';
import { TreeItemIcon } from '@mui/x-tree-view/TreeItemIcon';
import { TreeItemProvider } from '@mui/x-tree-view/TreeItemProvider';
import { TreeItemDragAndDropOverlay } from '@mui/x-tree-view/TreeItemDragAndDropOverlay';
import { useTreeItemModel } from '@mui/x-tree-view/hooks';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, ImageListItem, ImageListItemBar, useMediaQuery } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { FileDTO } from 'logiflowerp-sdk';
import { useSnackbar } from 'notistack';
import CloseIcon from '@mui/icons-material/Close'

// type FileType = 'image' | 'pdf' | 'doc' | 'video' | 'folder' | 'pinned' | 'trash';

// type ExtendedTreeItemProps = {
//     fileType?: FileType;
//     id: string;
//     label: string;
// };

// const ITEMS: TreeViewBaseItem<ExtendedTreeItemProps>[] = [
//     {
//         id: '1',
//         label: 'Documents',
//         children: [
//             {
//                 id: '1.1',
//                 label: 'Company',
//                 children: [
//                     { id: '1.1.1', label: 'Invoice', fileType: 'pdf' },
//                     { id: '1.1.2', label: 'Meeting notes', fileType: 'doc' },
//                     { id: '1.1.3', label: 'Tasks list', fileType: 'doc' },
//                     { id: '1.1.4', label: 'Equipment', fileType: 'pdf' },
//                     { id: '1.1.5', label: 'Video conference', fileType: 'video' },
//                 ],
//             },
//             { id: '1.2', label: 'Personal', fileType: 'folder' },
//             { id: '1.3', label: 'Group photo', fileType: 'image' },
//         ],
//     },
//     {
//         id: '2',
//         label: 'Bookmarked',
//         fileType: 'pinned',
//         children: [
//             { id: '2.1', label: 'Learning materials', fileType: 'folder' },
//             { id: '2.2', label: 'News', fileType: 'folder' },
//             { id: '2.3', label: 'Forums', fileType: 'folder' },
//             { id: '2.4', label: 'Travel documents', fileType: 'pdf' },
//         ],
//     },
//     { id: '3', label: 'History', fileType: 'folder' },
//     { id: '4', label: 'Trash', fileType: 'trash' },
// ];

function DotIcon() {
    return (
        <Box
            sx={{
                width: 6,
                height: 6,
                borderRadius: '70%',
                bgcolor: 'warning.main',
                display: 'inline-block',
                verticalAlign: 'middle',
                zIndex: 1,
                mx: 1,
            }}
        />
    );
}
declare module 'react' {
    interface CSSProperties {
        '--tree-view-color'?: string;
        '--tree-view-bg-color'?: string;
    }
}

const TreeItemRoot = styled('li')(({ theme }) => ({
    listStyle: 'none',
    margin: 0,
    padding: 0,
    outline: 0,
    color: theme.palette.grey[400],
    ...theme.applyStyles('light', {
        color: theme.palette.grey[800],
    }),
}));

const TreeItemContent = styled('div')(({ theme }) => ({
    padding: theme.spacing(0.5),
    paddingRight: theme.spacing(1),
    paddingLeft: `calc(${theme.spacing(1)} + var(--TreeView-itemChildrenIndentation) * var(--TreeView-itemDepth))`,
    width: '100%',
    boxSizing: 'border-box', // prevent width + padding to overflow
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent',
    flexDirection: 'row-reverse',
    borderRadius: theme.spacing(0.7),
    marginBottom: theme.spacing(0.5),
    marginTop: theme.spacing(0.5),
    fontWeight: 500,
    '&[data-expanded]:not([data-focused], [data-selected]) .labelIcon': {
        color: theme.palette.primary.dark,
        ...theme.applyStyles('light', {
            color: theme.palette.primary.main,
        }),
        '&::before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            left: '16px',
            top: '44px',
            height: 'calc(100% - 48px)',
            width: '1.5px',
            backgroundColor: theme.palette.grey[700],
            ...theme.applyStyles('light', {
                backgroundColor: theme.palette.grey[300],
            }),
        },
    },
    [`&[data-focused], &[data-selected]`]: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
        ...theme.applyStyles('light', {
            backgroundColor: theme.palette.primary.main,
        }),
    },
    '&:not([data-focused], [data-selected]):hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        color: 'white',
        ...theme.applyStyles('light', {
            color: theme.palette.primary.main,
        }),
    },
}));

const CustomCollapse = styled(Collapse)({
    padding: 0,
});

const AnimatedCollapse = animated(CustomCollapse);

function TransitionComponent(props: TransitionProps) {
    const style = useSpring({
        to: {
            opacity: props.in ? 1 : 0,
            transform: `translate3d(0,${props.in ? 0 : 20}px,0)`,
        },
    });

    return <AnimatedCollapse style={style} {...props} />;
}

const TreeItemLabelText = styled(Typography)({
    color: 'inherit',
    fontFamily: 'General Sans',
    fontWeight: 500,
});

interface CustomLabelProps {
    children: React.ReactNode;
    icon?: React.ElementType;
    expandable?: boolean;
    item: TreeViewBaseItem<ExtendedTreeItemProps>
    selected: boolean
}

function CustomLabel({
    icon: Icon,
    expandable,
    children,
    item,
    selected,
    ...other
}: CustomLabelProps) {
    return (
        <TreeItemLabel
            {...other}
            sx={{
                display: 'flex',
                alignItems: 'center',
            }}
        >
            {Icon && (
                <Box
                    component={Icon}
                    className="labelIcon"
                    color={item.file
                        ? selected ? '#1ed760' : '#18b44f'
                        : item.children?.length
                            ? 'inherit' : selected ? '#f66055' : '#fe4438'
                    }
                    sx={{ mr: 1, fontSize: '1.2rem' }}
                />
            )}
            <TreeItemLabelText variant="body2">{children}</TreeItemLabelText>
            {expandable && <DotIcon />}
        </TreeItemLabel>
    );
}

const getIconFromFileType = (fileType: FileType) => {
    switch (fileType) {
        case 'image':
            return ImageIcon;
        case 'pdf':
            return PictureAsPdfIcon;
        case 'doc':
            return ArticleIcon;
        case 'video':
            return VideoCameraBackIcon;
        case 'folder':
            return FolderRounded;
        case 'pinned':
            return FolderOpenIcon;
        case 'trash':
            return DeleteIcon;
        default:
            return ArticleIcon;
    }
};

interface CustomTreeItemProps
    extends Omit<UseTreeItemParameters, 'rootRef'>,
    Omit<React.HTMLAttributes<HTMLLIElement>, 'onFocus'> { }

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
    props: CustomTreeItemProps,
    ref: React.Ref<HTMLLIElement>,
) {
    const { id, itemId, label, disabled, children, ...other } = props;

    const {
        getContextProviderProps,
        getRootProps,
        getContentProps,
        getIconContainerProps,
        getCheckboxProps,
        getLabelProps,
        getGroupTransitionProps,
        getDragAndDropOverlayProps,
        status,
    } = useTreeItem({ id, itemId, children, label, disabled, rootRef: ref });

    const item = useTreeItemModel<ExtendedTreeItemProps>(itemId)!;

    let icon;
    if (status.expandable) {
        icon = FolderRounded;
    } else if (item.fileType) {
        icon = getIconFromFileType(item.fileType);
    }

    return (
        <TreeItemProvider {...getContextProviderProps()}>
            <TreeItemRoot {...getRootProps(other)}>
                <TreeItemContent {...getContentProps()}>
                    <TreeItemIconContainer {...getIconContainerProps()}>
                        <TreeItemIcon status={status} />
                    </TreeItemIconContainer>
                    <TreeItemCheckbox {...getCheckboxProps()} />
                    <CustomLabel
                        {...getLabelProps({
                            icon,
                            expandable: status.expandable && status.expanded
                        })}
                        item={item}
                        selected={status.selected}
                    />
                    <TreeItemDragAndDropOverlay {...getDragAndDropOverlayProps()} />
                </TreeItemContent>
                {children && <TransitionComponent {...getGroupTransitionProps()} />}
            </TreeItemRoot>
        </TreeItemProvider>
    );
});

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

function _isLeaf(node: TreeViewBaseItem<ExtendedTreeItemProps>): boolean {
    return !node.children || node.children.length === 0 || node.fileType === 'folder'
}

function findNodeById(nodes: TreeViewBaseItem<ExtendedTreeItemProps>[], id: string): TreeViewBaseItem<ExtendedTreeItemProps> | null {
    for (const node of nodes) {
        if (node.id === id) return node
        if (node.children?.length) {
            const found = findNodeById(node.children, id)
            if (found) return found
        }
    }
    return null
}

interface IPropsFileViewer {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
    selectedItem: TreeViewBaseItem<ExtendedTreeItemProps>
}

function MediaCardView(props: IPropsFileViewer) {
    const { open, setOpen, selectedItem } = props
    const theme = useTheme()
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
    const { enqueueSnackbar } = useSnackbar()

    const handleDownload = async () => {
        if (!selectedItem?.file?.key) return;

        try {
            const fileUrl = `${import.meta.env.VITE_FILES_R2_BASE_URL}/${selectedItem.file.key}`
            const response = await fetch(fileUrl)
            if (!response.ok) throw new Error('No se pudo descargar el archivo')

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)

            const link = document.createElement('a')
            link.href = url
            link.download = `${selectedItem.label}-${Date.now()}`
            document.body.appendChild(link)
            link.click();
            document.body.removeChild(link)

            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
    }

    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle id="responsive-dialog-title">
                {`${selectedItem.label}`}
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
            <DialogContent>
                <ImageListItem>
                    <img
                        src={`${`${import.meta.env.VITE_FILES_R2_BASE_URL}/${selectedItem.file?.key}`}?w=248&fit=crop&auto=format`}
                        alt={selectedItem.label}
                        loading='lazy'
                    />
                    <ImageListItemBar position='top' title={selectedItem.file?.uploadedBy} />
                    <ImageListItemBar position='bottom' title={`${selectedItem.file ? (selectedItem.file?.size / (1024 * 1024)).toFixed(2) : 0} MB`} />
                </ImageListItem>
            </DialogContent>
            <DialogActions>
                <Button
                    component='a'
                    autoFocus
                    href={`${import.meta.env.VITE_FILES_R2_BASE_URL}/${selectedItem?.file?.key}`}
                    download={selectedItem.label}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Ampliar
                </Button>
                <Button
                    onClick={handleDownload}
                    autoFocus
                >
                    Descargar
                </Button>
            </DialogActions>
        </Dialog>
    )
}


interface IProps {
    model: TreeViewBaseItem<ExtendedTreeItemProps>[]
    files: FileDTO[]
    handleFileChange?: (file: File, selectedItem: TreeViewBaseItem<ExtendedTreeItemProps>) => Promise<void>
    handleFileDelete?: (key: string) => Promise<void>
    loading?: boolean
}

export function CustomFileExplorer(props: IProps) {
    const { model, files, handleFileChange, handleFileDelete, loading } = props
    const [selectedItem, setSelectedItem] = React.useState<TreeViewBaseItem<ExtendedTreeItemProps> | null>(null)
    const [isLeaf, setIsLeaf] = React.useState<boolean>(false)
    const [items, setItems] = React.useState<TreeViewBaseItem<ExtendedTreeItemProps>[]>([])
    const { enqueueSnackbar } = useSnackbar()
    const [open, setOpen] = React.useState(false)

    function attachFilesToTree(
        model: TreeViewBaseItem<ExtendedTreeItemProps>[],
        files: FileDTO[]
    ) {
        model.forEach((node) => {
            const nodeFile = files.find((f) => f.id_nodo === node.id)
            if (nodeFile) {
                node.file = nodeFile
            }
            if (node.id === selectedItem?.id) {
                setSelectedItem(node)
            }
            setIsLeaf(_isLeaf(node))
            if (node.children) {
                attachFilesToTree(node.children, files)
            }
        })
    }

    React.useEffect(() => {
        const _model = structuredClone(model)
        attachFilesToTree(_model, files)
        setItems(_model)
    }, [model, files])

    const _handleFileChange = async (files: FileList | null) => {
        try {
            if (!files || files.length === 0) {
                throw new Error('No se seleccionó ningún archivo')
            }
            if (!selectedItem) {
                throw new Error('No se seleccionó ningún archivo')
            }
            const file = files[0]
            if (handleFileChange) {
                await handleFileChange(file, selectedItem)
            }
            enqueueSnackbar({ message: '¡Archivo guardado!', variant: 'success' })
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
    }

    const _handleFileDelete = async () => {
        try {
            if (!selectedItem || !selectedItem.file) {
                throw new Error('Ocurrió un error al eliminar archivo.')
            }
            if (handleFileDelete) {
                await handleFileDelete(selectedItem.file.key)
            }
            enqueueSnackbar({ message: '¡Archivo eliminado!', variant: 'info' })
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
    }

    const _handleFileView = async () => {
        try {
            if (!selectedItem) {
                throw new Error('No se seleccionó ningún archivo')
            }
            setOpen(true)
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
    }

    return (
        <>
            <Box>
                <Box>
                    {
                        (isLeaf && selectedItem)
                            ? <Box component='div' style={{ display: 'flex', gap: 4 }}>
                                {
                                    !selectedItem?.file
                                        ? <>
                                            {
                                                handleFileChange
                                                    ?
                                                    <Button
                                                        component='label'
                                                        role={undefined}
                                                        variant='contained'
                                                        tabIndex={-1}
                                                        size='small'
                                                        loading={loading}
                                                    >
                                                        <CloudUploadIcon fontSize='small' />
                                                        <VisuallyHiddenInput
                                                            type='file'
                                                            onChange={(event) => _handleFileChange(event.target.files)}
                                                        />
                                                    </Button>
                                                    : null
                                            }
                                        </> : (
                                            <>
                                                <Button
                                                    component='label'
                                                    role={undefined}
                                                    variant='contained'
                                                    tabIndex={-1}
                                                    size='small'
                                                    loading={loading}
                                                    onClick={_handleFileView}
                                                    color='info'
                                                >
                                                    <VisibilityIcon fontSize='small' />
                                                </Button>
                                                {
                                                    handleFileDelete
                                                        ? <Button
                                                            component='label'
                                                            role={undefined}
                                                            variant='contained'
                                                            tabIndex={-1}
                                                            size='small'
                                                            loading={loading}
                                                            onClick={_handleFileDelete}
                                                            color='error'
                                                        >
                                                            <DeleteIcon fontSize='small' />
                                                        </Button>
                                                        : null
                                                }
                                            </>
                                        )
                                }
                            </Box>
                            : null
                    }
                </Box>
                <RichTreeView
                    items={items}
                    // defaultExpandedItems={['1', '1.1']}
                    defaultSelectedItems="1.1"
                    sx={{ height: 'fit-content', flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
                    slots={{ item: CustomTreeItem }}
                    itemChildrenIndentation={24}
                    onSelectedItemsChange={(_event, id) => {
                        if (!id) return
                        const node = findNodeById(items, id)
                        setSelectedItem(node)
                        if (!node) return
                        setIsLeaf(_isLeaf(node))
                    }}
                />
            </Box>
            {
                (selectedItem && open)
                    ? <MediaCardView
                        open={open}
                        setOpen={setOpen}
                        selectedItem={selectedItem}
                    />
                    : null
            }
        </>
    );
}
