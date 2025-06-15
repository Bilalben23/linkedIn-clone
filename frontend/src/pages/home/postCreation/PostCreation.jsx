import { Link } from 'react-router-dom';
import { FiImage } from "react-icons/fi";
import { BsPlayBtnFill } from "react-icons/bs";
import { RiArticleFill } from "react-icons/ri";
import CreatePostModal from './CreatePostModal'; // Import the new modal component

const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;

export default function PostCreation({ user }) {

    return (
        <section>
            <div className='border bg-base-100 sm:rounded-box shadow-xs border-gray-300 px-4 pt-4 pb-2 flex flex-col gap-y-5'>
                <div className='flex items-center gap-x-3'>
                    <Link to={`/profile/${user.username}`} className='flex-none'>
                        <img
                            src={
                                user?.profilePicture
                                    ? `${CLOUDINARY_BASE_URL + user.profilePicture}`
                                    : "/assets/avatar.png"
                            }
                            alt={`${user.name}'s avatar`}
                            className='size-10 rounded-full'
                        />
                    </Link>

                    <div className='w-full'>
                        <button
                            className='btn !justify-start !border-gray-400 btn-outline rounded-full btn-block'
                            onClick={() => document.getElementById('createPost_modal').showModal()}
                        >
                            <span>Start a post</span>
                        </button>

                        <CreatePostModal user={user} />
                    </div>
                </div>

                <div className='flex justify-between items-center'>
                    <button
                        type="button" className='btn flex-col !gap-y-0 sm:flex-row h-12 sm:h-8 btn-ghost'
                    >
                        <FiImage className="text-[#378fe9] size-5" />
                        <span>Photo</span>
                    </button>
                    <button type="button" className='btn flex-col h-12 sm:h-8 sm:flex-row !gap-y-0 btn-ghost'>
                        <BsPlayBtnFill className="text-[#5f9b41] size-5" />
                        <span>Video</span>
                    </button>
                    <button type="button" className='btn h-12 sm:h-8 gap-y-0 flex-col sm:flex-row btn-ghost'>
                        <RiArticleFill className="text-[#e06847] size-5" />
                        <span>Write article</span>
                    </button>
                </div>
            </div>
        </section>
    );
}