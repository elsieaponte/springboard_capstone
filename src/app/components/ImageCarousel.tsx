"use client";
import { useState } from "react";

export default function ImageCarousel({ images }: { images: any[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) {
        return <p>No images available.</p>
    }

    const prevImage = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    const nextImage = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    const currentImage = images[currentIndex]

    return (
        <div className="relative p-4 max-w-3xl mx-auto rounded">
            {/* park name */}
            <h3
                className="text-center font-semibold mb-2">
                {currentImage.title}
            </h3>

            <div className="relative flex justify-center items-center">
                {/* left arrow */}
                <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 text-black px-3 py-1 rounded-full text-xl hover:bg-white transition"
                    aria-label="Previous Image">
                    ←
                </button>

                {/* image */}
                <img
                    src={currentImage.url}
                    alt={currentImage.altText || "Park Image"}
                    className="rounded w-auto h-[400px] object-cover border border-[rgba(72,51,11,1)] shadow" />

                {/* right arrow */}
                <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 text-black px-3 py-1 rounded-full text-xl hover:bg-white transition"
                    aria-label="Next Image">
                    →
                </button>
            </div>

            {/* Credit */}
            <p className="text-sm text-gray-600 mt-2 text-left">
                Credit: {currentImage.credit}
            </p>
        </div>
    )
}