import { X } from 'lucide-react'
import { useEffect } from 'react'

export default function ImageLightbox({ imageUrl, onClose }) {
    // 避免背景滾動
    useEffect(() => {
        if (!imageUrl) return

        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = ''
        }
    }, [imageUrl])

    if (!imageUrl) return null

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-8 backdrop-blur-sm transition-opacity duration-300"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-2 transition-all z-[110]"
                aria-label="關閉預覽"
            >
                <X className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
            <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
                <img
                    src={imageUrl}
                    alt="放大圖片"
                    className="max-w-full max-h-full object-contain rounded-md shadow-2xl pointer-events-none"
                    onClick={(e) => e.stopPropagation()} // 防止點擊圖片時關閉
                />
            </div>
        </div>
    )
}
