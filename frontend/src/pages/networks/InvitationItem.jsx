import { Link } from 'react-router-dom';
import { useAcceptConnectionRequest, useRejectConnectionRequest } from '../../hooks/useConnections';
import { toast } from 'react-toastify';
import { IoClose } from "react-icons/io5";
import { FaCheck } from 'react-icons/fa';

const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;

export default function InvitationItem({ user, connectSoundEffect }) {
    const { mutate: acceptRequest, isPending: isAccepting } = useAcceptConnectionRequest();
    const { mutate: rejectRequest, isPending: isRejecting } = useRejectConnectionRequest();

    const handleAcceptRequest = () => {
        acceptRequest(user._id, {
            onSuccess: () => {
                if (connectSoundEffect.current) {
                    connectSoundEffect.current.volume = 1.0;
                    connectSoundEffect.current.play().catch((err) => {
                        console.error("Audio play error:", err);
                    });
                }
            },
            onError: (err) => {
                toast.error(err.response?.data?.message || "Something went wrong!");
            }
        })
    };

    const handleRejectRequest = () => rejectRequest(user._id, {
        onError: (err) => {
            toast.error(err.response?.data?.message || "Something went wrong!");
        }
    });

    return (
        <>

            <div className='flex items-center justify-between p-3 border-b border-gray-300 gap-x-3'>
                <Link to={`/profile/${user.username}`} className='shrink-0 block'>
                    <img
                        src={user.profilePicture
                            ? `${CLOUDINARY_BASE_URL + user.profilePicture}`
                            : '/assets/avatar.png'}
                        alt={`${user.username}'s avatar`}
                        className='size-14 rounded-full'
                    />
                </Link>
                <div className='flex-1'>
                    <p className='text-sm mb-1'>
                        <Link to={`/profile/${user.username}`} className='font-semibold link-hover'>{user.name}</Link>
                        <span> is inviting you to connect</span>
                    </p>
                    <p className='text-black/70 line-clamp-1 text-xs'>{user.headline}</p>
                </div>
                <div className='shrink-0 flex items-center gap-x-1 sm:gap-x-3'>
                    <button
                        type="button"
                        className='btn btn-ghost btn-sm  text-black/80 !border-none'
                        aria-label="Ignore request"
                        onClick={handleRejectRequest}
                        disabled={isRejecting}
                    >
                        {
                            isRejecting && <img
                                src='/assets/loading-spinner.gif'
                                alt='Loading spinner'
                                className="w-3"
                            />
                        }
                        <span className="hidden sm:inline">Ignore</span>
                        <IoClose size={20} className="sm:hidden" />
                    </button>
                    <button
                        type="button"
                        className='btn btn-primary btn-sm btn-outline rounded-full'
                        aria-label="Accept request"
                        onClick={handleAcceptRequest}
                        disabled={isAccepting}
                    >
                        {
                            isAccepting && <img
                                src='/assets/loading-spinner.gif'
                                alt='Loading spinner'
                                className="w-3"
                            />
                        }
                        <span className='hidden sm:inline'>Accept</span>
                        <FaCheck className="sm:hidden" />
                    </button>
                </div>
            </div>
        </>
    )
}
