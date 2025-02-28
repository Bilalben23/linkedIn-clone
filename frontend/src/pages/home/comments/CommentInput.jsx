import useAuth from '../../../hooks/useAuth';
import { FiImage } from "react-icons/fi";
import { FaRegFaceSmile } from "react-icons/fa6";

const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;


export default function CommentInput() {
    const { authState: { user } } = useAuth();


    return (
        <div className='flex gap-x-2'>
            <div className='shrink-0'>
                <img src={user.profilePicture
                    ? `${CLOUDINARY_BASE_URL + user.profilePicture}`
                    : "/assets/avatar.png"}
                    alt={`${user.username}'s avatar`}
                    className='size-9 rounded-full'
                />
            </div>
            <div className='relative w-full text-xs'>
                <div
                    className='w-full border border-gray-500 rounded-3xl p-2.5 focus:outline-gray-500'
                    role='textbox'
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                ></div>
                <span className='text-gray-500 absolute top-2.5 left-3'>Add a comment...</span>
                <div className='flex items-center absolute top-0.5 right-1'>
                    <button type='button' className='btn btn-ghost btn-sm btn-circle border-0 hover:bg-gray-200/50'>
                        <FaRegFaceSmile size={22} />
                    </button>
                    <button type='button' className='btn btn-sm btn-circle border-0 btn-ghost hover:bg-gray-200/50'>
                        <FiImage size={22} />
                    </button>
                </div>
            </div>
        </div>
    )
}
