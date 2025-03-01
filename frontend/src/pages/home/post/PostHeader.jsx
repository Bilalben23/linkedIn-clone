import { Link } from 'react-router-dom';
import { LuGlobe } from "react-icons/lu";
import { FaEllipsisH, FaSpinner, FaUserPlus } from 'react-icons/fa';
import { IoClose } from "react-icons/io5";
import { timeAgo } from "../../../utils/timeAgo";
import useSendConnectionRequest from '../../../hooks/useSendConnectionRequest';
import { useRef } from 'react';

const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;
const CONNECT_SOUND_URL = "/assets/sounds/connect.mp3";

export default function PostHeader({ post }) {
    const connectSoundEffect = useRef(null);
    const { mutate: sendConnectionRequest, isPending } = useSendConnectionRequest("postsFeed");

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

    const isConnected = post.isConnected;

    return (
        <>
            {/* Connection actions */}
            {
                !isConnected && (
                    <div className='border-b mb-3 pb-2 border-gray-300 justify-end flex items-center gap-x-1 mx-3'>
                        <button type="button" className='btn btn-xs btn-ghost btn-circle border-0'>
                            <FaEllipsisH size={15} />
                        </button>
                        <button type="button" className='btn btn-xs btn-ghost btn-circle border-0'>
                            <IoClose size={20} />
                        </button>
                    </div>
                )
            }

            <div className='flex justify-between gap-x-5 px-4'>
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
                        <p className='font-black hover:text-[#0A66C2] hover:link-hover text-sm line-clamp-1'>{post.author.name}</p>
                        <p className='text-[13px] line-clamp-1 text-gray-700'>{post.author.headline}</p>
                        <p className='text-[12px] flex items-center gap-x-1 text-gray-700'>
                            <span>{timeAgo(post.createdAt)}</span>
                            <span>•</span>
                            <span><LuGlobe /></span>
                        </p>
                    </div>
                </Link>

                {/* Connection Request Button */}
                {isConnected ? (
                    <div className='flex items-center gap-x-1'>
                        <button type="button" className='btn btn-xs btn-ghost btn-circle'>
                            <FaEllipsisH size={15} />
                        </button>
                        <button type="button" className='btn btn-xs btn-ghost btn-circle'>
                            <IoClose size={20} />
                        </button>
                    </div>
                ) : (
                    <div>
                        {/* Connection Sound Effect */}
                        <audio
                            ref={connectSoundEffect}
                            src={CONNECT_SOUND_URL}
                            preload="auto"
                        />

                        <button
                            type='button'
                            className='btn text-[#0A66C2] btn-xs font-bold hover:bg-blue-50 border-none btn-ghost'
                            onClick={() => handleSendConnectionRequest(post.author._id)}
                            disabled={isPending}
                        >
                            {post.connectionStatus === "pending" ? (
                                <>
                                    <FaSpinner /> pending
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
};
