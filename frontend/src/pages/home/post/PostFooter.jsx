import { FaRegCommentDots } from 'react-icons/fa';
import { motion, AnimatePresence } from "framer-motion";
import { REACTIONS } from '../../../utils/constants';
import { RiRepeatLine } from "react-icons/ri";
import { TbSend } from "react-icons/tb";
import { useState } from 'react';


const PostFooter = ({ post }) => {
    const [showReactions, setShowReactions] = useState(false);
    const [hoveredReaction, setHoveredReaction] = useState(null);




    return (
        <div className='mt-3 px-3'>
            <div className={`border-b border-gray-300 mb-2 flex items-center text-xs py-1 ${post.reactions.reactionsCount !== 0 ? "justify-between" : "justify-end"}`}>
                {
                    post.reactions.reactionsCount !== 0 && <div>
                        <button
                            type="button"
                            className='cursor-pointer'
                        >
                            {
                                post.reactions.hasReacted
                                    ? <span className='flex items-center gap-x-1'>
                                        <span className='flex items-center -space-x-[7px]'>
                                            {
                                                REACTIONS.map(({ name, icon }) => {
                                                    return post.reactions.uniqueReactions.includes(name) ? <img
                                                        key={name}
                                                        src={icon}
                                                        alt={name}
                                                        className='size-4 rounded-full'
                                                    /> : null
                                                })
                                            }
                                        </span>
                                        <span className='text-gray-700 hover:underline hover:text-blue-500'>
                                            You and {post.reactions.reactionsCount - 1} other{post.reactions.reactionsCount !== 1 ? "s" : ""}
                                        </span>
                                    </span>

                                    : `${post.reactions.reactionsCount}`
                            }
                        </button>
                    </div>
                }
                <div className='flex items-center gap-x-1'>
                    <button
                        type="button"
                        className='cursor-pointer hover:text-blue-700 hover:underline'
                    >7 comments</button>
                    <span>•</span>
                    <button
                        type="button"
                        className='cursor-pointer hover:text-blue-700 hover:underline'
                    >7 Reposts</button>
                </div>
            </div>

            <div className='flex items-center justify-between gap-x-1 relative'>
                <div
                    className="relative"
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
                                {REACTIONS.map(({ name, icon }, index) => (
                                    <div className="relative flex flex-col items-center" key={name}>
                                        {/* Reaction Label (Appears on Hover) */}
                                        <AnimatePresence>
                                            {hoveredReaction === name && (
                                                <motion.span
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 5 }}
                                                    transition={{ duration: 0.1 }}
                                                    className="absolute -top-8 text-xs bg-black text-white px-2  rounded-full pt-1 pb-0.5 shadow-md"
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
                                        >
                                            <img src={icon} alt={name} className="w-9" />
                                        </motion.button>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Like Button */}
                    <button
                        type="button"
                        className="btn btn-sm btn-ghost px-6 text-gray-700 font-black flex items-center gap-x-1"
                    >
                        <img src="/assets/icons/like-outline.svg" alt="Like" className="size-4" />
                        <span>Like</span>
                    </button>
                </div>

                <button type='button' className='btn btn-sm btn-ghost px-6 text-gray-700 font-black'>
                    <FaRegCommentDots size={18} /> Comment
                </button>
                <button type='button' className='btn btn-sm btn-ghost px-6 text-gray-700 font-black'>
                    <RiRepeatLine size={18} /> Repost
                </button>
                <button type='button' className='btn btn-sm btn-ghost px-6 text-gray-700 font-black'>
                    <TbSend size={18} /> Send
                </button>
            </div>
        </div>
    );
};

export default PostFooter;