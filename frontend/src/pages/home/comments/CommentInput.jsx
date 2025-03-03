import useAuth from '../../../hooks/useAuth';
import { FiImage } from "react-icons/fi";
import { FaRegFaceSmile } from "react-icons/fa6";
import { useRef, useState } from 'react';
import { useAddComment } from '../../../hooks/useComments';
import { toast } from 'react-toastify';

const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;

export default function CommentInput({ postId }) {
    const { authState: { user } } = useAuth();
    const [comment, setComment] = useState("");
    const commentBoxRef = useRef(null);
    const { mutate: addComment, isPending } = useAddComment(postId);

    const handleInput = (e) => {
        const content = e.currentTarget.innerText.trim();
        setComment(content);
    };

    const resetCommentBox = () => {
        setComment("");
        if (commentBoxRef.current) {
            commentBoxRef.current.innerText = "";
        }
    }

    const handleAddComment = () => {
        addComment(comment, {
            onSuccess: () => {
                resetCommentBox();
            },
            onError: () => {
                toast.error("Failed to comment")
            }
        });
    }

    return (
        <>
            <div className='flex gap-x-2'>
                <div className='shrink-0'>
                    <img
                        src={user?.profilePicture
                            ? `${CLOUDINARY_BASE_URL + user.profilePicture}`
                            : "/assets/avatar.png"}
                        alt={`${user.username}'s avatar`}
                        className='size-9 rounded-full'
                    />
                </div>
                <div className='relative w-full text-xs'>
                    <div
                        ref={commentBoxRef}
                        className={`w-full border relative border-gray-500 rounded-3xl p-2.5 focus:outline-gray-500 ${comment.trim().length === 0 ? "before:content-['Add_a_comment'] before:absolute before:left-3 before:text-gray-500" : ""
                            }`}
                        role='textbox'
                        contentEditable="true"
                        suppressContentEditableWarning={true}
                        onInput={handleInput}
                        dir='auto'
                    ></div>
                    {/* Wrap icons and button in a flex container */}
                    <div className={`flex items-center justify-between mt-0 ${comment.trim().length === 0 ? 'absolute top-0.5 right-1' : ''}`}>
                        <div className='flex items-center gap-x-1'>
                            <button type='button' className='btn btn-ghost btn-sm btn-circle border-0 hover:bg-gray-200/50'>
                                <FaRegFaceSmile size={22} />
                            </button>
                            <button type='button' className='btn btn-sm btn-circle border-0 btn-ghost hover:bg-gray-200/50'>
                                <FiImage size={22} />
                            </button>
                        </div>
                        {comment.trim().length !== 0 && (
                            <div>
                                <button
                                    type="button"
                                    className='btn btn-primary rounded-full btn-xs'
                                    disabled={comment.trim().length === 0 || isPending}
                                    onClick={handleAddComment}
                                >
                                    Comment
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {
                isPending && <div className="relative flex gap-x-2 mt-6 before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-transparent before:via-white/80 before:to-white/90">
                    <div className='shrink-0'>
                        <img
                            src={user.profilePicture
                                ? `${CLOUDINARY_BASE_URL + user.profilePicture}`
                                : "/assets/avatar.png"}
                            alt={`${user.username}'s avatar`}
                            className='size-9 rounded-full'
                        />
                    </div>
                    <div>
                        <p className='font-bold text-xs'>{user.name}</p>
                        <p className='text-[12px] line-clamp-1'>{user.headline}</p>
                        <div className='mt-2'>
                            <img
                                src="/assets/loading-spinner.gif"
                                alt="loading-spinner"
                                className='size-7'
                            />
                        </div>
                    </div>
                </div>
            }

        </>
    );
}