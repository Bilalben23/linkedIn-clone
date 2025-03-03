import { useMemo, useState } from 'react'
import { FaEllipsisH } from 'react-icons/fa';
import { FiTrash2, FiEdit2, FiLink, FiFlag, FiEyeOff } from "react-icons/fi";
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { REACTIONS_ARRAY } from '../../../utils/constants';
import { timeAgo } from '../../../utils/timeAgo';
import useAuth from '../../../hooks/useAuth';
import { useDeleteComment } from '../../../hooks/useComments';
import { toast } from 'react-toastify';

const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;


export default function CommentItem({ comment, postId, postAuthorId }) {
    const [showReactions, setShowReactions] = useState(false);
    const [hoveredReaction, setHoveredReaction] = useState(null);
    const { authState: { user } } = useAuth()

    const isEdited = new Date(comment.createdAt).getTime() !== new Date(comment.updatedAt).getTime();
    const formattedTimeAgo = timeAgo(comment.createdAt);

    const isMyPost = useMemo(() => user?._id?.toString() === postAuthorId?.toString(), [user, postAuthorId]);
    const isMyComment = useMemo(() => user?._id?.toString() === comment?.user?._id?.toString(), [user, comment]);
    const isMyCommentAndMyPost = isMyPost && isMyComment;
    const isMyCommentAndNotMyPost = isMyComment && !isMyPost;

    const { mutate: deleteComment, isPending } = useDeleteComment(postId);

    const handleDeleteComment = () => {
        deleteComment(comment._id, {
            onError: () => {
                toast.error("Failed to delete the comment!")
            }
        });
    }

    return (
        <div className='flex flex-col gap-y-0.5'>
            <div className='flex justify-between items-start gap-x-4'>
                <div className='flex gap-x-2 flex-1'>
                    <Link to={`/profile/${comment.user.username}`} className='shrink-0 block'>
                        <img
                            src={comment.user.profilePicture
                                ? `${CLOUDINARY_BASE_URL + comment.user.profilePicture}`
                                : "/assets/avatar.png"}
                            alt={`${comment.user.username}'s avatar`}
                            className='size-9 rounded-full'
                        />
                    </Link>
                    <div>
                        <Link to={`/profile/${comment.user.username}`} className='block' >
                            <div className='flex items-center gap-x-0.5'>
                                <p className='font-bold text-xs'>{comment.user.name}</p>
                                {
                                    isMyCommentAndNotMyPost && <>
                                        <span className="text-gray-500 text-[12px]">•</span>
                                        <span className='text-gray-500 text-[12px]'>You</span>
                                    </>
                                }
                                {
                                    isMyCommentAndMyPost && <p className='badge ml-2 font-bold badge-xs !rounded-sm bg-slate-600 text-white'>Author</p>
                                }

                            </div>
                            <p className='text-[12px] line-clamp-1'>{comment.user.headline}</p>
                        </Link>
                    </div>
                </div>
                <div className='flex items-center gap-x-1 text-gray-500'>
                    <p className='text-[12px]'>{isEdited && "(edited)"} {formattedTimeAgo}</p>
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className='btn btn-xs btn-ghost btn-circle border-0 hover:bg-gray-200/50'>
                            <FaEllipsisH />
                        </div>
                        <ul tabIndex={0} className="dropdown-content !mt-1 !right-0 menu menu-sm bg-base-100 rounded-box !rounded-tr-none z-[1] text-gray-700 !px-0 w-fit py-1 font-bold shadow-md border border-gray-300">
                            <li>
                                <button type="button" className="rounded-none leading-loose !gap-x-4 whitespace-nowrap tracking-wide">
                                    <FiLink strokeWidth={3} /> Copy link to comment
                                </button>
                            </li>


                            {/* for other users or post author */}
                            {
                                (isMyPost || !isMyComment) && <li>
                                    <button type="button" className="rounded-none gap-x-4 leading-loose whitespace-nowrap tracking-wide">
                                        <FiFlag strokeWidth={3} /> Report
                                    </button>
                                </li>
                            }

                            {/* for other users (not my comment and not the post author ) */}
                            {
                                (!isMyComment && !isMyPost) && <li>
                                    <button type="button" className="rounded-none leading-loose !gap-x-4 whitespace-nowrap tracking-wide">
                                        <FiEyeOff strokeWidth={3} /> I don't want to see this
                                    </button>
                                </li>
                            }

                            {/* for comment owner*/}
                            {
                                isMyComment &&
                                <li>
                                    <button type="button" className="rounded-none leading-loose !gap-x-4 tracking-wide">
                                        <FiEdit2 strokeWidth={3} /> Edit
                                    </button>
                                </li>
                            }

                            {/* for post author or comment owner */}
                            {
                                (isMyComment || isMyPost) && <li>
                                    <button
                                        type="button"
                                        className="rounded-none leading-loose !gap-x-4 tracking-wide "
                                        onClick={handleDeleteComment}
                                        disabled={isPending}
                                    >
                                        <FiTrash2 strokeWidth={3} /> Delete
                                    </button>
                                </li>
                            }
                        </ul>
                    </div>
                </div>
            </div>
            <div className='ml-11'>
                <p className='text-xs'>{comment.content}</p>

                <div className='flex mt-1 items-center gap-x-1.5 text-xs'>
                    <div
                        className="relative w-fit"
                        onMouseEnter={() => setShowReactions(true)}
                        onMouseLeave={() => {
                            setShowReactions(false);
                            setHoveredReaction(null);
                        }}
                    >
                        {/* Animated Reaction Panel */}
                        <AnimatePresence>
                            {showReactions && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                    transition={{ duration: 0.15, ease: "easeOut" }}
                                    className="flex items-center gap-2 absolute shadow-lg bg-white border border-gray-300 py-2 px-3 left-0 -top-16 rounded-full"
                                >
                                    {REACTIONS_ARRAY.map(({ name, icon }, index) => (
                                        <div className="relative flex flex-col items-center" key={name}>
                                            {/* Reaction Label (Appears on Hover) */}
                                            <AnimatePresence>
                                                {hoveredReaction === name && (
                                                    <motion.span
                                                        initial={{ opacity: 0, y: 5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 5 }}
                                                        transition={{ duration: 0.1 }}
                                                        className="absolute -top-8 text-xs bg-black text-white px-2 rounded-full pt-1 pb-0.5 shadow-md"
                                                    >
                                                        {name}
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>

                                            {/* Reaction Icon */}
                                            <motion.button
                                                initial={{ opacity: 0, y: 5, scale: 0.8 }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                    scale: 1,
                                                    transition: { delay: index * 0.05, duration: 0.2 },
                                                }}
                                                exit={{ opacity: 0, y: 5, scale: 0.8 }}
                                                whileHover={{ scale: 1.5 }}
                                                className="w-9 cursor-pointer"
                                                onMouseEnter={() => setHoveredReaction(name)}
                                                onMouseLeave={() => setHoveredReaction(null)}
                                                onClick={() => handleReaction(name)}
                                            >
                                                <img src={icon} alt={name} className="w-9" />
                                            </motion.button>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Reaction Button */}
                        <button type="button" className="btn btn-ghost btn-xs border-0 hover:bg-gray-200/50 text-gray-500 font-bold !px-1 !py-0">Like</button>
                    </div>
                    <div className='w-[0.8px] h-[20px] bg-gray-500'></div>
                    <button type="button" className="btn btn-ghost btn-xs border-0 hover:bg-gray-200/50 text-gray-500 font-bold !px-1 !py-0">Reply</button>
                </div>
            </div>
        </div>
    )
}

// 1. I am the comment owner:
// Copy link to comment.
// edit the comment.
// delete the comment.

// 2. I am the post owner
// copy link to the comment
// delete the comment 
// block the user
// report the comment

// 3. other users comment(I am not the commenter and not the post owner)
// copy link to the comment
// report the comment
// don't want to see this