import * as React from "react";
import { useState } from "react";
import RoomComment from "./RoomComment";
import { Separator } from "@/components/ui/separator";

const PAGE_SIZE = 10;

interface Comment {
    falla: string;
    comment: string;
    room: string;
    images: { name: string; url: string }[];
}

interface HotelCommentsProps {
    hotel: string;
    comments: Comment[];
}

const HotelComments: React.FC<HotelCommentsProps> = ({ hotel, comments }) => {
    const [page, setPage] = useState(1);
    // Filtra solo los comentarios con imágenes
    const commentsWithImages = comments.filter(comment => Array.isArray(comment.images) && comment.images.length > 0);
    const commentsToShow = commentsWithImages.slice(0, page * PAGE_SIZE);

    return (
        <div>
            <div className="font-bold text-2xl my-6">{hotel}</div>
            {commentsWithImages.length === 0 ? (
                <div className="text-center text-gray-500 my-8">
                    No hay comentarios para este hotel.
                </div>
            ) : (
                <>
                    {commentsToShow.map((comment, cidx) => (
                        <div key={cidx}>
                            <RoomComment
                                hotel={hotel}
                                falla={comment.falla}
                                comment={comment.comment}
                                room={comment.room}
                                images={comment.images}
                            />
                            <Separator className="mt-8" />
                        </div>
                    ))}
                    {commentsToShow.length < commentsWithImages.length && (
                        <div className="flex justify-center my-4">
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                                onClick={() => setPage(page + 1)}
                            >
                                Ver más
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default HotelComments;