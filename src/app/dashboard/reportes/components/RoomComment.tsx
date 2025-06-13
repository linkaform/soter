import React from 'react'
import Image from "next/image";

interface RoomCommentProps {
    falla: string
    comment: string
    room: string
    images: CommentImage[]
}

interface CommentImage {
    name: string
    url: string
}

const RoomComment = ({ falla, comment, room, images }: RoomCommentProps) => {
    return (
        <div className="flex flex-col gap-4 mx-8 mt-4">
            <div className="flex justify-between">
                <div className="font-semibold text-2xl">{falla ?? ''}</div>
                <div className="flex flex-col items-end">
                    <div className="font-semibold"></div>
                    <div className="font-semibold">{room ?? ''}</div>
                </div>
            </div>
            <div className="text-gray-600">{comment}</div>
            <div className="grid grid-cols-8 gap-4">
                {images?.map((image, idx) => (
                    <div key={idx}>
                        <Image
                            width={200}
                            height={200}
                            src={image.url}
                            alt="Imagen"
                            className="w-full h-full object-contain bg-gray-200 rounded-lg"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RoomComment