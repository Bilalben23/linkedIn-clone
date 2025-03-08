import { IoClose } from "react-icons/io5";
import { Link } from 'react-router-dom'
import { MdOutlineSchedule } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa";
import { useSendConnectionRequest } from "../../hooks/useConnections";
import { useRef } from "react";

const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;
const CONNECT_SOUND_URL = "/assets/sounds/connect.mp3";

export default function SuggestedConnectionCard({ user }) {
    const connectSoundEffect = useRef(null);

    const {
        mutate: sendConnectionRequest,
        isPending,
        data,
        isSuccess
    } = useSendConnectionRequest();

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

    const isConnected = isSuccess && data?.isConnected;


    return (
        <>
            <audio
                ref={connectSoundEffect}
                src={CONNECT_SOUND_URL}
                preload="auto"
            />

            <div className='border border-gray-200 rounded-box relative hover:shadow-md'>
                <div className='absolute top-1 right-1 z-1'>
                    <button type="button" className="btn btn-xs btn-circle btn-neutral !bg-black/50 border-none">
                        <IoClose size={20} />
                    </button>
                </div>
                <Link to={`/profile/${user.username}`} className='relative mb-9 block'>
                    <div className='h-[80px] w-full'>
                        <img src={
                            user.bannerImg
                                ? `${CLOUDINARY_BASE_URL + user.bannerImg}`
                                : "/assets/banner.png"
                        }
                            alt={`${user.name}'s banner`}
                            className="size-full rounded-t-lg"
                        />
                    </div>
                    <div className='absolute rounded-full left-1/2 -translate-x-1/2 -bottom-[40px] size-18'>
                        <img src={user.profilePicture
                            ? `${CLOUDINARY_BASE_URL + user.profilePicture}`
                            : "/assets/avatar.png"
                        }
                            alt={`${user.name}'s profile`}
                            className='size-full rounded-full'
                        />
                    </div>
                </Link>
                <Link to={`/profile/${user.username}`} className="mt-2 block text-center">
                    <p className="text-sm link-hover font-bold">{user.name}</p>
                    <p className="text-xs text-black/70 line-clamp-2">{user.headline}</p>
                </Link>

                <div className="mt-2 p-3">
                    <button
                        type="button"
                        className={`btn ${isConnected ? "btn-neutral" : "btn-primary"} btn-block btn-xs rounded-full btn-outline`}
                        onClick={() => handleSendConnectionRequest(user._id)}
                        disabled={isPending}
                    >
                        {
                            isConnected
                                ? <>
                                    <MdOutlineSchedule size={15} />
                                    pending
                                </> : <>
                                    <FaUserPlus /> connect
                                </>
                        }
                    </button>
                </div>

            </div>
        </>
    )
}
