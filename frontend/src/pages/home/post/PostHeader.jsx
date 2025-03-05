import { Link } from 'react-router-dom';
import { LuGlobe } from "react-icons/lu";
import { FaUserPlus } from 'react-icons/fa';
import { IoClose } from "react-icons/io5";
import { timeAgo } from "../../../utils/timeAgo";
import useSendConnectionRequest from '../../../hooks/useSendConnectionRequest';
import { useEffect, useRef, useState } from 'react';
import { MdOutlineSchedule } from "react-icons/md";
import useAuth from '../../../hooks/useAuth';
import PostActionsDropdown from './PostActionsDropdown';
import { useDeletePost } from '../../../hooks/usePosts';
import { toast } from 'react-toastify';
import DeletePostConfirmationModal from './DeletePostConfirmationModal';

const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;
const CONNECT_SOUND_URL = "/assets/sounds/connect.mp3";

export default function PostHeader({ post }) {
    const connectSoundEffect = useRef(null);
    const { authState: { user } } = useAuth();
    const isMyPost = user._id.toString() === post.author._id.toString();
    const [isConfirmPostDeletion, setIsConfirmPostDeletion] = useState(false);
    const { mutate: deletePost, isPending: isDeleting } = useDeletePost()
    const { mutate: sendConnectionRequest, isPending: isSending } = useSendConnectionRequest("postsFeed");
    const dialogFormRef = useRef(null);
    const isConnected = post.isConnected;


    const handleSendConnectionRequest = (userId) => {
        sendConnectionRequest(userId, {
            onSuccess: (data) => {
                if (data.isConnected && connectSoundEffect.current) {
                    connectSoundEffect.current.volume = 1.0;
                    connectSoundEffect.current.play().catch((err) => {
                        console.error("Audio play error:", err);
                    });
                }
            }
        });
    };


    // Dropdown handlers
    const handleSave = () => console.log("Save post");
    const handleCopyLink = () => console.log("Copy link to post");
    const handleEmbed = () => console.log("Embed this post");
    const handleNotInterested = () => console.log("Not interested");
    const handleReport = () => console.log("Report post");
    const handleFeature = () => console.log("Feature on top of profile");
    const handleEdit = () => console.log("Edit post");

    const handleDelete = () => document.getElementById('deleteConfirmationModal').showModal();

    useEffect(() => {
        if (isConfirmPostDeletion) {
            deletePost(post._id, {
                onSuccess: () => {
                    dialogFormRef.current?.submit();
                    toast.success("Post deleted successfully");
                },
                onError: (err) => {
                    toast.error(`Failed to delete post: ${err.message || "Something went wrong"}`);
                },
            })
        }
    }, [isConfirmPostDeletion, post._id])

    return (
        <>
            {/* Delete Confirmation Modal */}
            <DeletePostConfirmationModal
                setIsConfirmPostDeletion={setIsConfirmPostDeletion}
                isDeleting={isDeleting}
                dialogFormRef={dialogFormRef}
            />

            {/* Connection actions */}
            {!isConnected && !isMyPost && (
                <div className='border-b mb-3 pb-2 border-gray-300 justify-end flex items-center gap-x-1 mx-3'>
                    <PostActionsDropdown
                        isMyPost={isMyPost}
                        onSave={handleSave}
                        onCopyLink={handleCopyLink}
                        onEmbed={handleEmbed}
                        onNotInterested={handleNotInterested}
                        onReport={handleReport}
                    />
                    <button type="button" className='btn btn-xs btn-ghost btn-circle border-0'>
                        <IoClose size={20} />
                    </button>
                </div>
            )}

            <div className='flex justify-between items-start gap-x-5 px-4'>
                {/* User Profile */}
                <Link to={`/profile/${post.author.username}`} className='flex items-center gap-x-2.5'>
                    <div className='shrink-0'>
                        <img
                            src={
                                post.author.profilePicture
                                    ? `${CLOUDINARY_BASE_URL + post.author.profilePicture}`
                                    : "/assets/avatar.png"
                            }
                            alt={`${post.author.name}'s avatar`}
                            className='size-11 rounded-full'
                        />
                    </div>
                    <div className='flex flex-col items-start'>
                        {isMyPost ? (
                            <div className='flex items-center gap-x-1'>
                                <span className='font-black hover:text-[#0A66C2] hover:link-hover text-sm line-clamp-1'>{post.author.name} </span>
                                <span className='text-gray-500 text-[12px]'>•</span>
                                <span className='text-gray-500 text-[12px]'>You</span>
                            </div>
                        ) : (
                            <p className='font-black hover:text-[#0A66C2] hover:link-hover text-sm line-clamp-1'>{post.author.name} </p>
                        )}
                        <p className='text-[13px] line-clamp-1 text-gray-700'>{post.author.headline}</p>
                        <p className='text-[12px] flex items-center gap-x-1 text-gray-700'>
                            <span>{timeAgo(post.createdAt)}</span>
                            <span>•</span>
                            <span><LuGlobe /></span>
                        </p>
                    </div>
                </Link>

                {/* Connection Request Button */}
                {isConnected || isMyPost ? (
                    <div className='flex items-center gap-x-1'>
                        <PostActionsDropdown
                            isMyPost={isMyPost}
                            onSave={handleSave}
                            onCopyLink={handleCopyLink}
                            onEmbed={handleEmbed}
                            onNotInterested={handleNotInterested}
                            onReport={handleReport}
                            onFeature={handleFeature}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                        <button type="button" className='btn btn-xs btn-ghost btn-circle'>
                            <IoClose size={20} />
                        </button>
                    </div>
                ) : (
                    <div>
                        <audio
                            ref={connectSoundEffect}
                            src={CONNECT_SOUND_URL}
                            preload="auto"
                        />
                        <button
                            type='button'
                            className={`btn ${post.connectionStatus === "pending" ? "!cursor-not-allowed" : "text-[#0A66C2] hover:bg-blue-50"} btn-xs font-bold  border-none `}
                            onClick={() => handleSendConnectionRequest(post.author._id)}
                            disabled={isSending || post.connectionStatus === "pending"}
                        >
                            {post.connectionStatus === "pending" ? (
                                <>
                                    <MdOutlineSchedule size={15} /> pending
                                </>
                            ) : (
                                <>
                                    <FaUserPlus /> connect
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}