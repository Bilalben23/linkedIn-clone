import { Link } from 'react-router-dom';
import { FiImage } from "react-icons/fi";
import { BsPlayBtnFill } from "react-icons/bs";
import { RiArticleFill } from "react-icons/ri";
import CreatePostModal from './CreatePostModal'; // Import the new modal component

const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;

export default function PostCreation({ user }) {

    return (
        <section>
            <div className='border bg-base-100 rounded-box shadow-xs border-gray-300 px-4 pt-4 pb-2 flex flex-col gap-y-5'>
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
                            Start a post
                        </button>

                        <CreatePostModal user={user} />
                    </div>
                </div>

                <div className='flex justify-between items-center'>
                    <button
                        type="button" className='btn btn-ghost'
                    >
                        <FiImage className="text-[#378fe9] size-5" />
                        Photo
                    </button>
                    <button type="button" className='btn btn-ghost'>
                        <BsPlayBtnFill className="text-[#5f9b41] size-5" />
                        Video
                    </button>
                    <button type="button" className='btn btn-ghost'>
                        <RiArticleFill className="text-[#e06847] size-5" />
                        Write article
                    </button>
                </div>
            </div>
        </section>
    );
}