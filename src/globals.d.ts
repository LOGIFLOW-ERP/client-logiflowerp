import { FileDTO } from "logiflowerp-sdk";

declare global {
    type FileType = 'image' | 'pdf' | 'doc' | 'video' | 'folder' | 'pinned' | 'trash';

    interface ExtendedTreeItemProps {
        fileType?: FileType;
        id: string;
        label: string;
        file?: FileDTO;
    }

    const __APP_VERSION__: string;
}

export { }
