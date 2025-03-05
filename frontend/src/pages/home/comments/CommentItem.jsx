import { useEffect, useMemo, useRef, useState } from 'react';
import { FaEllipsisH } from 'react-icons/fa';
import { FiTrash2, FiEdit2, FiLink, FiFlag, FiEyeOff } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { REACTIONS_ARRAY } from '../../../utils/constants';
import { timeAgo } from '../../../utils/timeAgo';
import useAuth from '../../../hooks/useAuth';
import { useDeleteComment, useUpdateComment } from '../../../hooks/useComments';
import { toast } from 'react-toastify';

const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;

export default function CommentItem({ comment, postId, postAuthorId }) {
    const { authState: { user } } = useAuth();
    const [showReactions, setShowReactions] = useState(false);
    const [hoveredReaction, setHoveredReaction] = useState(null);
    const [isCommentEditing, setIsCommentEditing] = useState(false);
    const [editedComment, setEditedComment] = useState(comment.content);
    const contentEditableRef = useRef(null);

    // Memoized values
    const isEdited = useMemo(() => new Date(comment.createdAt).getTime() !== new Date(comment.updatedAt).getTime(), [comment]);
    const formattedTimeAgo = useMemo(() => timeAgo(comment.createdAt), [comment]);
    const isMyPost = useMemo(() => user?._id?.toString() === postAuthorId?.toString(), [user, postAuthorId]);
    const isMyComment = useMemo(() => user?._id?.toString() === comment?.user?._id?.toString(), [user, comment]);
    const isMyCommentAndMyPost = isMyPost && isMyComment;
    const isMyCommentAndNotMyPost = isMyComment && !isMyPost;

    // Mutation hooks
    const { mutate: updateComment, isPending: isUpdatePending } = useUpdateComment(postId);
    const { mutate: deleteComment, isPending: isDeletePending } = useDeleteComment(postId);

    // Handlers
    const handleUpdateComment = () => {
        updateComment(
            { commentId: comment._id, updatedContent: editedComment },
            {
                onSuccess: () => {
                    setIsCommentEditing(false);
                },
                onError: () => {
                    toast.error('Failed to update the comment!');
                },
            }
        );
    };

    const handleDeleteComment = () => {
        deleteComment(comment._id, {
            onError: () => {
                toast.error('Failed to delete the comment!');
            },
        });
    };

    const handleEditClick = () => {
        setIsCommentEditing(true);
    };

    const handleInput = (e) => {
        const content = e.currentTarget.innerText.trim();
        setEditedComment(content);
    };

    const handleReaction = (reactionType) => {
        // Add your reaction logic here
        console.log('Reaction:', reactionType);
    };

    // Focus and cursor placement for editing
    useEffect(() => {
        if (isCommentEditing && contentEditableRef.current) {
            const el = contentEditableRef.current;
            el.focus();

            // Move cursor to the end
            const range = document.createRange();
            const selection = window.getSelection();
            range.selectNodeContents(el);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }, [isCommentEditing]);


    return (
        <div className='flex flex-col gap-y-0.5'>
            {/* Comment Header */}
            <div className='flex justify-between items-start gap-x-4'>
                <div className='flex gap-x-2 flex-1'>
                    <Link to={`/profile/${comment.user.username}`} className='shrink-0 block'>
                        <img
                            src={comment.user.profilePicture
                                ? `${CLOUDINARY_BASE_URL + comment.user.profilePicture}`
                                : '/assets/avatar.png'}
                            alt={`${comment.user.username}'s avatar`}
                            className='size-9 rounded-full'
                        />
                    </Link>
                    <div>
                        <Link to={`/profile/${comment.user.username}`} className='block'>
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
                            <p className='text-[12px] line-clamp-1'>{comment.user.headline}</p>
                        </Link>
                    </div>
                </div>

                {/* Comment Actions */}
                {!isCommentEditing && (
                    <div className='flex items-center gap-x-1 text-gray-500'>
                        <p className='text-[12px]'>{isEdited && '(edited)'} {formattedTimeAgo}</p>
                        <div className='dropdown'>
                            <div tabIndex={0} role='button' className='btn btn-xs btn-ghost btn-circle border-0 hover:bg-gray-200/50'>
                                <FaEllipsisH />
                            </div>
                            <ul tabIndex={0} className='dropdown-content !mt-1 !right-0 menu menu-sm bg-base-100 rounded-box !rounded-tr-none z-[1] text-gray-700 !px-0 w-fit py-1 font-bold shadow-md border border-gray-300'>
                                <li>
                                    <button type='button' className='rounded-none leading-loose !gap-x-4 whitespace-nowrap tracking-wide'>
                                        <FiLink strokeWidth={3} /> Copy link to comment
                                    </button>
                                </li>
                                {(isMyPost || !isMyComment) && (
                                    <li>
                                        <button type='button' className='rounded-none gap-x-4 leading-loose whitespace-nowrap tracking-wide'>
                                            <FiFlag strokeWidth={3} /> Report
                                        </button>
                                    </li>
                                )}
                                {!isMyComment && !isMyPost && (
                                    <li>
                                        <button type='button' className='rounded-none leading-loose !gap-x-4 whitespace-nowrap tracking-wide'>
                                            <FiEyeOff strokeWidth={3} /> I don't want to see this
                                        </button>
                                    </li>
                                )}
                                {isMyComment && (
                                    <li>
                                        <button
                                            type='button'
                                            className='rounded-none leading-loose !gap-x-4 tracking-wide'
                                            onClick={handleEditClick}
                                        >
                                            <FiEdit2 strokeWidth={3} /> Edit
                                        </button>
                                    </li>
                                )}
                                {(isMyComment || isMyPost) && (
                                    <li>
                                        <button
                                            type='button'
                                            className='rounded-none leading-loose !gap-x-4 tracking-wide'
                                            onClick={handleDeleteComment}
                                            disabled={isDeletePending}
                                        >
                                            <FiTrash2 strokeWidth={3} /> Delete
                                        </button>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            {/* Comment Content */}
            <div className='ml-11'>
                {isCommentEditing ? (
                    <>
                        <div
                            ref={contentEditableRef}
                            suppressContentEditableWarning={true}
                            contentEditable={true}
                            className={`text-xs relative break-words border border-gray-500 rounded-full p-2.5 focus:outline-blue-500 ${editedComment.trim().length === 0 ? "before:content-['Add_a_comment'] before:absolute before:left-3 before:text-gray-500" : ""
                                }`}
                            role='textbox'
                            onInput={handleInput}
                        >{comment.content}</div>
                        <div className='mt-2 flex items-center gap-x-2'>
                            <button
                                type='button'
                                className='btn btn-xs rounded-full btn-primary pt-0.5 font-bold'
                                disabled={comment.content === editedComment || isUpdatePending || !editedComment.trim()}
                                onClick={handleUpdateComment}
                            >
                                Save changes
                            </button>
                            <button
                                type='button'
                                className='btn btn-xs rounded-full hover:bg-gray-200/50 pt-0.5 btn-outline hover:ring-2'
                                onClick={() => setIsCommentEditing(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className='text-sm break-words'>{comment.content}</p>
                        <div className='flex mt-1 items-center gap-x-1.5 text-xs'>
                            <div
                                className='relative w-fit'
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
                                            transition={{ duration: 0.15, ease: 'easeOut' }}
                                            className='flex items-center gap-2 absolute shadow-lg bg-white border border-gray-300 py-2 px-3 left-0 -top-16 rounded-full'
                                        >
                                            {REACTIONS_ARRAY.map(({ name, icon }, index) => (
                                                <div className='relative flex flex-col items-center' key={name}>
                                                    {/* Reaction Label (Appears on Hover) */}
                                                    <AnimatePresence>
                                                        {hoveredReaction === name && (
                                                            <motion.span
                                                                initial={{ opacity: 0, y: 5 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: 5 }}
                                                                transition={{ duration: 0.1 }}
                                                                className='absolute -top-8 text-xs bg-black text-white px-2 rounded-full pt-1 pb-0.5 shadow-md'
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
                                                        className='w-9 cursor-pointer'
                                                        onMouseEnter={() => setHoveredReaction(name)}
                                                        onMouseLeave={() => setHoveredReaction(null)}
                                                        onClick={() => handleReaction(name)}
                                                    >
                                                        <img src={icon} alt={name} className='w-9' />
                                                    </motion.button>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Reaction Button */}
                                <button type='button' className='btn btn-ghost btn-xs border-0 hover:bg-gray-200/50 text-gray-500 font-bold !px-1 !py-0'>
                                    Like
                                </button>
                            </div>
                            <div className='w-[0.8px] h-[20px] bg-gray-500'></div>
                            <button type='button' className='btn btn-ghost btn-xs border-0 hover:bg-gray-200/50 text-gray-500 font-bold !px-1 !py-0'>
                                Reply
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}