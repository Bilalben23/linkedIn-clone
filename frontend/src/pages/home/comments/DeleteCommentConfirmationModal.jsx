import React from 'react'
import { Link } from 'react-router-dom'

const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;

export default function DeleteCommentConfirmationModal({ comment, setIsConfirmCommentDeletion, isEdited, formattedTimeAgo, dialogFormRef, isDeleting, isMyPost, isMyCommentAndNotMyPost, isMyCommentAndMyPost }) {
    return (
        <dialog id="delete_comment_confirmation_modal" className="modal">
            <div className="modal-box !p-0 md:!max-w-[90%] !w-full">
                <div className='p-4 border-b border-gray-200'>
                    <h3 className="font-bold text-lg">Are you sure you want to delete your comment?</h3>
                </div>

                <div className="p-4 flex gap-y-2 flex-col">
                    <div className='flex justify-between'>
                        <Link to={`/profile/${comment.user.username}`} className='flex gap-x-2'>
                            <div className='shrink-0 block'>
                                <img
                                    src={comment.user.profilePicture
                                        ? `${CLOUDINARY_BASE_URL + comment.user.profilePicture}`
                                        : '/assets/avatar.png'}
                                    alt={`${comment.user.username}'s avatar`}
                                    className='size-10 rounded-full'
                                />
                            </div>
                            <div>
                                <div className='flex items-center gap-x-0.5'>
                                    <p className='font-bold text-xs'>{comment.user.name}</p>
                                    {isMyCommentAndNotMyPost && (
                                        <>
                                            <span className='text-gray-500 text-[12px]'>•</span>
                                            <span className='text-gray-500 text-[12px]'>You</span>
                                        </>
                                    )}
                                    {isMyCommentAndMyPost && (
                                        <p className='badge ml-2 font-bold badge-xs !rounded-sm bg-slate-600 text-white'>Author</p>
                                    )}
                                </div>
                                <p className='text-xs text-black/60'>{comment.user.headline}</p>
                            </div>
                        </Link>
                        <div>
                            <p className='text-xs text-black/60'>{isEdited && '(edited)'} {formattedTimeAgo}</p>
                        </div>
                    </div>
                    <div className={`ml-5 ${!isMyPost ? "border-l-2 border-black/20" : ""}`}>
                        <p className='text-xs pl-6.5 line-clamp-5 break-words'>{comment.content}</p>
                    </div>
                </div>

                <div className='p-4 border-t border-gray-200'>
                    <p className='font-bold text-sm text-black/50'>All likes and replies on this comment will also be removed.</p>
                </div>

                <div className="modal-action !mt-0 p-4 border-t border-gray-200">
                    <form method="dialog" ref={dialogFormRef}>
                        <button className="btn btn-sm rounded-full btn-outline font-bold" >Cancel</button>
                    </form>
                    <button
                        className="btn btn-sm rounded-full btn-primary font-bold"
                        onClick={() => setIsConfirmCommentDeletion(true)}
                        disabled={isDeleting}
                    >
                        {
                            isDeleting && <img
                                src='/assets/loading-spinner.gif'
                                alt='Loading spinner'
                                className="w-3"
                            />
                        }
                        Delete
                    </button>
                </div>
            </div>
        </dialog >
    )
}