import { useState } from 'react';
import { FaRegCommentDots } from 'react-icons/fa';
import { motion, AnimatePresence } from "framer-motion";
import { REACTIONS_ARRAY, REACTIONS_OBJECT } from '../../../utils/constants';
import { RiRepeatLine } from "react-icons/ri";
import { TbSend } from "react-icons/tb";
import useToggleReaction from '../../../hooks/useToggleReaction';

const PostFooter = ({ post }) => {
    const [showReactions, setShowReactions] = useState(false);
    const [hoveredReaction, setHoveredReaction] = useState(null);

    const toggleReaction = useToggleReaction();
    const handleReaction = (reactionType) => {
        setShowReactions(false);
        toggleReaction.mutate({ postId: post._id, reactionType });
    };

    return (
        <div className='mt-3 px-3'>
            {/* Reactions Count and Comments/Reposts */}
            <div className={`border-b border-gray-300 mb-1 flex items-center text-xs py-0.5 ${post.reactions.reactionsCount !== 0 ? "justify-between" : "justify-end"}`}>
                {
                    post.reactions.reactionsCount !== 0 && (
                        <div>
                            <button type="button" className='cursor-pointer'>
                                <span className='flex items-center gap-x-1'>
                                    <span className='flex items-center -space-x-[7px]'>
                                        {REACTIONS_ARRAY.map(({ name, icon }) => (
                                            post.reactions.uniqueReactions.includes(name) && (
                                                <img
                                                    key={name}
                                                    src={icon}
                                                    alt={name}
                                                    className='size-4 rounded-full'
                                                />
                                            )
                                        ))}
                                    </span>
                                    <span className='text-gray-700 hover:underline hover:text-[#0A66C2]'>
                                        {post.reactions.hasReacted && post.reactions.reactionsCount !== 1
                                            ? `You and ${post.reactions.reactionsCount - 1} other${post.reactions.reactionsCount - 1 !== 1 ? "s" : ""}`
                                            : post.reactions.reactionsCount}
                                    </span>
                                </span>
                            </button>
                        </div>
                    )
                }
                {
                    (post.commentsCount !== 0 || post.repostsCount !== 0) && (
                        <div className="flex items-center gap-x-1">
                            {
                                post.commentsCount !== 0 && (
                                    <button type="button" className="cursor-pointer hover:text-[#0A66C2] hover:underline">
                                        {post.commentsCount} comment{post.commentsCount !== 1 ? "s" : ""}
                                    </button>
                                )
                            }

                            {(post.commentsCount !== 0 && post.repostsCount !== 0) && <span>•</span>}

                            {post.repostsCount !== 0 && (
                                <button type="button" className="cursor-pointer hover:text-[#0A66C2] hover:underline">
                                    {post.repostsCount} Repost{post.repostsCount !== 1 ? "s" : ""}
                                </button>
                            )}
                        </div>
                    )
                }
            </div>

            {/* Reaction, Comment, Repost, and Send Buttons */}
            <div className='flex items-center justify-between gap-x-1'>
                {/* Reaction Button and Panel */}
                <div
                    className="relative flex-1"
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
                    <button
                        type="button"
                        className="btn w-full btn-sm btn-ghost hover:bg-gray-200/50 border-0 text-gray-700 font-bold flex items-center gap-x-1"
                        onClick={() => handleReaction(post.reactions.hasReacted ? post.reactions.userReactionType : "like")}
                    >
                        <img
                            src={
                                post.reactions.hasReacted
                                    ? REACTIONS_OBJECT[post.reactions.userReactionType].icon
                                    : "/assets/icons/like-outline.svg"
                            }
                            alt={post.reactions.hasReacted ? post.reactions.userReactionType : "like-outline"}
                            className="size-4"
                        />
                        <span
                            className='capitalize'
                            style={{
                                color: post.reactions.hasReacted ? REACTIONS_OBJECT[post.reactions.userReactionType].color : "inherit",
                            }}
                        >
                            {post.reactions.hasReacted ? post.reactions.userReactionType : "Like"}
                        </span>
                    </button>
                </div>

                {/* Comment Button */}
                <button type='button' className='btn flex-1 btn-bold btn-sm hover:bg-gray-200/50 btn-ghost border-0 text-gray-700 font-bold'>
                    <FaRegCommentDots size={18} /> Comment
                </button>
                {/* Repost Button */}
                <button type='button' className='btn flex-1 btn-sm btn-ghost hover:bg-gray-200/50 border-0 text-gray-700 font-bold'>
                    <RiRepeatLine size={18} /> Repost
                </button>
                {/* Send Button */}
                <button type='button' className='btn flex-1 hover:bg-gray-200/50 btn-sm btn-ghost border-0 text-gray-700 font-bold'>
                    <TbSend size={18} /> Send
                </button>
            </div>
        </div>
    );
};

export default PostFooter;