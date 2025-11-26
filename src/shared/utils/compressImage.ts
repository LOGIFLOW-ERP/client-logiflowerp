export function compressImage(file: File, quality = 0.7): Promise<Blob> {
    return new Promise(resolve => {
        const reader = new FileReader()
        reader.onload = (e) => {
            const img = new Image()
            img.onload = () => {
                const canvas = document.createElement('canvas')
                canvas.width = img.width
                canvas.height = img.height

                const ctx = canvas.getContext('2d')
                if (!ctx) return resolve(file)

                ctx.drawImage(img, 0, 0)

                canvas.toBlob(
                    (blob) => {
                        if (!blob) return resolve(file)
                        resolve(blob)
                    },
                    'image/jpeg',
                    quality
                )
            }
            img.src = e.target?.result as string
        }
        reader.readAsDataURL(file)
    })
}
