import { Link } from "react-router-dom";
import { FaUserPlus, FaSpinner } from "react-icons/fa";
import useSendConnectionRequest from "../../../hooks/useSendConnectionRequest";
import { useRef } from "react";


const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;
const CONNECT_SOUND_URL = "/assets/sounds/connect.mp3";

export default function SuggestedConnectionItem({ user }) {
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
        <div className="flex gap-x-2 border-gray-300 last:border-0 gap-y-2 border-b py-4">
            <Link to={`/profile/${user?.username}`} className="shrink-0">
                <img
                    src={user?.profilePicture
                        ? `${CLOUDINARY_BASE_URL + user?.profilePicture}`
                        : "/assets/avatar.png"}
                    alt={`${user?.name}'s avatar`}
                    className="size-8 rounded-full"
                />
            </Link>
            <div>
                <Link to={`/profile/${user?.username}`}>
                    <p className="text-xs font-bold hover:text-[#0A66C2] hover:underline line-clamp-1">
                        {user?.name}
                    </p>
                    <p className="text-[14px] line-clamp-2">{user?.headline}</p>
                </Link>
                <div className="mt-3">
                    {/* Connection Sound Effect */}
                    <audio
                        ref={connectSoundEffect}
                        src={CONNECT_SOUND_URL}
                        preload="auto"
                    />

                    <button
                        type="button"
                        className="btn btn-xs rounded-full hover:bg-gray-200/50 btn-outline hover:ring-2"
                        onClick={() => handleSendConnectionRequest(user._id)}
                        disabled={isPending}
                    >
                        {
                            isConnected
                                ? <>
                                    <FaSpinner />
                                    pending
                                </> : <>
                                    <FaUserPlus /> connect
                                </>
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}
