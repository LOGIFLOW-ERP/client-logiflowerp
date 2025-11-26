import { compressImage } from './compressImage'

export async function compressImageSmart(
    file: File,
    minSizeToCompressMB = 2,
    quality = 0.6
): Promise<File> {

    const sizeMB = file.size / (1024 * 1024)

    // Extensiones de imagen permitidas para compresión
    const isImage = file.type.startsWith('image/')

    // Si NO es imagen → NO comprimir
    if (!isImage) {
        return file
    }

    // Si es imagen pero <2MB → NO comprimir
    if (sizeMB < minSizeToCompressMB) {
        return file
    }

    // Comprimir la imagen
    const compressedBlob = await compressImage(file, quality)

    return new File([compressedBlob], file.name, {
        type: 'image/jpeg',
        lastModified: Date.now(),
    })
}
