import { useState } from 'react'
import { FaEllipsisH } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { REACTIONS_ARRAY } from '../../../utils/constants';
import { timeAgo } from '../../../utils/timeAgo';
import useAuth from '../../../hooks/useAuth';

const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;

export default function CommentItem({ comment, postId }) {
    const [showReactions, setShowReactions] = useState(false);
    const [hoveredReaction, setHoveredReaction] = useState(null);
    const { authState: { user } } = useAuth()

    const isEdited = new Date(comment.createdAt).getTime() !== new Date(comment.updatedAt).getTime();
    const formattedTimeAgo = timeAgo(comment.createdAt);

    const isCommentAuthorPostAuthor = comment.user._id?.toString() === postId.toString();
    const isMyCommentButNotPostAuthor = comment.user._id?.toString() === user._id?.toString() && !isCommentAuthorPostAuthor;

    return (
        <div className='flex flex-col gap-y-2'>
            <div className='flex justify-between items-start gap-x-2'>
                <Link to={`/profile/${comment.user.username}`} className='flex gap-x-2 flex-1'>
                    <div className='shrink-0'>
                        <img
                            src={comment.user.profilePicture
                                ? `${CLOUDINARY_BASE_URL + comment.user.profilePicture}`
                                : "/assets/avatar.png"}
                            alt={`${comment.user.username}'s avatar`}
                            className='size-9 rounded-full'
                        />
                    </div>
                    <div>
                        <div to={`/profile/${comment.user.username}`} >
                            <div className='flex items-center gap-x-0.5'>
                                <p className='font-bold text-xs'>{comment.user.name}</p>
                                {
                                    isMyCommentButNotPostAuthor && <>
                                        <span className="text-gray-500 text-[12px]">•</span>
                                        <span className='text-gray-500 text-[12px]'>You</span>
                                    </>
                                }
                                {
                                    isCommentAuthorPostAuthor && <p className='badge ml-2 font-bold badge-xs !rounded-sm bg-slate-600 text-white'>Author</p>
                                }

                            </div>
                            <p className='text-[12px] line-clamp-1'>{comment.user.headline}</p>
                        </div>
                    </div>
                </Link>
                <div className='flex items-center gap-x-1 text-gray-500'>
                    <p className='text-[12px]'>{isEdited && "(edited)"} {formattedTimeAgo}</p>
                    <button type='button' className='btn btn-xs btn-ghost btn-circle border-0 hover:bg-gray-200/50'>
                        <FaEllipsisH />
                    </button>
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
