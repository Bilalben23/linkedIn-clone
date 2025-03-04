import { Link } from 'react-router-dom';
import { LuGlobe } from "react-icons/lu";
import { FaEllipsisH, FaSpinner, FaUserPlus } from 'react-icons/fa';
import { IoClose } from "react-icons/io5";
import { FiBookmark, FiLink, FiCode, FiFlag, FiEyeOff } from "react-icons/fi";
import { timeAgo } from "../../../utils/timeAgo";
import useSendConnectionRequest from '../../../hooks/useSendConnectionRequest';
import { useRef } from 'react';
import { MdOutlineSchedule } from "react-icons/md";


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
                        <div className="dropdown">
                            <div tabIndex={0} role="button" className='btn btn-xs btn-ghost btn-circle border-0'>
                                <FaEllipsisH size={15} />
                            </div>
                            <ul tabIndex={0} className='dropdown-content !mt-1 !right-0 menu menu-sm bg-base-100 rounded-box !rounded-tr-none z-[1] text-gray-700 w-56 py-1 font-bold shadow-md border border-gray-300 !px-0'>
                                <li>
                                    <button type="button" className="rounded-none px-4 py-3">
                                        <FiBookmark size={20} strokeWidth={3} /> Save
                                    </button>
                                </li>
                                <li>
                                    <button type="button" className="rounded-none py-3 px-4">
                                        <FiLink size={20} strokeWidth={3} />
                                        Copy link to post
                                    </button>
                                </li>
                                <li>
                                    <button type="button" className="rounded-none px-4 py-3">
                                        <FiCode size={20} strokeWidth={3} />
                                        Embed this post
                                    </button>
                                </li>
                                <li>
                                    <button type="button" className="rounded-none px-4 py-3">
                                        <FiEyeOff size={20} strokeWidth={3} />
                                        Not interested
                                    </button>
                                </li>
                                <li>
                                    <button type="button" className="rounded-none px-4 py-3">
                                        <FiFlag size={20} fill='currentColor' strokeWidth={3} />
                                        Report post
                                    </button>
                                </li>
                            </ul>
                        </div>
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
                        <div className="dropdown">
                            <div tabIndex={0} role="button" className='btn btn-xs btn-ghost btn-circle'>
                                <FaEllipsisH size={15} />
                            </div>
                            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                                <li><a>Item 1</a></li>
                                <li><a>Item 2</a></li>
                            </ul>
                        </div>
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
                            className={`btn ${post.connectionStatus === "pending" ? "!cursor-not-allowed" : "text-[#0A66C2] hover:bg-blue-50"} btn-xs font-bold  border-none `}
                            onClick={() => handleSendConnectionRequest(post.author._id)}
                            disabled={isPending || post.connectionStatus === "pending"}
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
};
