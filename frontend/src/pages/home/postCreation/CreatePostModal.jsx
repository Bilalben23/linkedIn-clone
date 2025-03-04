import { useEffect, useRef, useState } from "react";
import { useCreatePost } from '../../../hooks/usePosts';
import { FaCaretDown, FaRegCalendarAlt, FaRegSmile, FaPencilAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { LuPlus } from "react-icons/lu";
import { TbPhoto } from "react-icons/tb";
import { MdOutlineSchedule } from "react-icons/md";
import { BsPlayBtnFill } from "react-icons/bs";
import { toast } from "react-toastify";
import Tooltip from "./Tooltip";
import readFileAsDataURL from "../../../utils/readFileAsDataURL";
import MoreOptions from "./MoreOptions";

const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;
const CONNECT_SOUND_URL = "/assets/sounds/connect.mp3";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB


export default function CreatePostModal({ user }) {
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const [postContent, setPostContent] = useState("");
    const [postImage, setPostImage] = useState(null);
    const [postImagePreview, setPostImagePreview] = useState(null);
    const dialogForm = useRef(null);
    const connectSoundEffect = useRef(null);

    // Handle post content change
    const handlePostContentChange = (e) => {
        setPostContent(e.target.value);
    };

    // Handle image change
    const handleImageChange = async (e) => {
        const file = e.target.files[0];

        if (file && file.size > MAX_FILE_SIZE) {
            toast.error("File size is too large. Max 10MB.");
            return;
        }

        setPostImage(file);
    };

    useEffect(() => {
        if (postImage) {
            readFileAsDataURL(postImage)
                .then(setPostImagePreview)
                .catch(console.error);
        } else {
            setPostImagePreview(null);
        }
    }, [postImage]);


    // Handle post creation
    const { mutate: createPostMutation, isPending } = useCreatePost();
    const handleCreatePostClick = () => {
        if (!postImage && !postContent.trim()) {
            toast.error("Post cannot be empty!");
            return;
        }

        const formData = new FormData();
        if (postImage) formData.append("image", postImage);
        if (postContent.trim()) formData.append("content", postContent.trim());

        createPostMutation(formData, {
            onSuccess: () => {
                setPostContent("");
                setPostImage(null);
                setPostImagePreview(null);
                dialogForm.current?.submit();
                if (connectSoundEffect.current) {
                    connectSoundEffect.current.volume = 1.0;
                    connectSoundEffect.current.play().catch((err) => {
                        console.error("Audio play error:", err);
                    });
                }
                toast.success("Post created successfully");
            },
            onError: (err) => {
                toast.error(`Failed to create post: ${err.message || "Something went wrong"}`);
            },
        });
    };

    return (
        <dialog id="createPost_modal" className="modal border !w-full">
            <audio ref={connectSoundEffect} src={CONNECT_SOUND_URL} preload="auto" />
            <div className="modal-box scrollbar-thin !max-w-[60%] !w-full px-0 py-3">
                {/* Header */}
                <div className="flex justify-between px-4">
                    <div className="flex items-center gap-x-3">
                        <img
                            src={user?.profilePicture ? `${CLOUDINARY_BASE_URL + user.profilePicture}` : "/assets/avatar.png"}
                            alt={`${user.name}'s avatar`}
                            className="size-12 rounded-full"
                        />
                        <div>
                            <p className="text-xl font-bold flex items-center gap-x-2">
                                <span>{user.name}</span>
                                <span className="text-gray-700"><FaCaretDown /></span>
                            </p>
                            <p className="text-xs">Post to anyone</p>
                        </div>
                    </div>
                    <form method="dialog" ref={dialogForm}>
                        <button type="submit" className="btn btn-sm text-gray-700 btn-ghost btn-circle border-0">
                            <IoClose size={30} />
                        </button>
                    </form>
                </div>

                {/* Post Content */}
                <div className="mt-4 max-h-60 overflow-y-auto mb-2 scrollbar-thin pl-5 pr-2">
                    <textarea
                        name="content"
                        aria-label="Post Content"
                        placeholder="What do you want to talk about?"
                        className={`w-full ${postImagePreview && postContent.length < 10 ? "h-14" : "h-52"} transition-[height] duration-500 pr-3 pt-2 focus:outline-0 resize-none`}
                        onChange={handlePostContentChange}
                        value={postContent}
                    />
                    {
                        postImagePreview && (
                            <div className="mt-2 flex flex-col gap-y-2">
                                <div className="self-end flex items-center gap-x-2">
                                    <button type="button" className="btn btn-circle btn-neutral btn-xs" disabled>
                                        <FaPencilAlt />
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-circle btn-neutral btn-xs"
                                        onClick={() => {
                                            setPostImage(null);
                                            setPostImagePreview(null);
                                        }}
                                    >
                                        <IoClose size={20} />
                                    </button>
                                </div>
                                <img src={postImagePreview} alt="Post preview" className="w-full" />
                            </div>
                        )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-y-1 pb-2 px-4 border-b border-gray-300">
                    <div>
                        <button type="button" className="btn btn-ghost btn-sm btn-circle border-0 hover:bg-gray-200/50">
                            <FaRegSmile size={22} className="text-gray-600" />
                        </button>
                    </div>
                    {
                        !postImagePreview && (
                            <div className="flex items-center gap-x-3">
                                <Tooltip tip="Add a video">
                                    <button type="button" className="p-2 cursor-pointer rounded-full">
                                        <BsPlayBtnFill size={22} className="text-gray-600" />
                                    </button>
                                </Tooltip>
                                <Tooltip tip="Add a photo">
                                    <label htmlFor="postImage" role="button" className="p-2 block cursor-pointer rounded-full">
                                        <TbPhoto size={25} className="text-gray-600" />
                                    </label>
                                    <input
                                        type="file"
                                        id="postImage"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                        aria-label="Upload an image"
                                    />
                                </Tooltip>
                                <Tooltip tip="Create an event">
                                    <button type="button" className="p-2 cursor-pointer rounded-full">
                                        <FaRegCalendarAlt size={22} className="text-gray-600" />
                                    </button>
                                </Tooltip>
                                {!showMoreOptions ? (
                                    <Tooltip tip="More">
                                        <button
                                            type="button"
                                            className="p-2 cursor-pointer rounded-full"
                                            onClick={() => setShowMoreOptions(true)}>
                                            <LuPlus strokeWidth={2} size={27} className="text-gray-600" />
                                        </button>
                                    </Tooltip>
                                ) : (
                                    <MoreOptions />
                                )}
                            </div>
                        )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-x-3 px-4 pt-3">
                    <Tooltip tip="Schedule for later">
                        <button type="button" className="btn btn-ghost btn-sm btn-circle border-0 hover:bg-gray-200/50">
                            <MdOutlineSchedule size={25} className="text-gray-600" />
                        </button>
                    </Tooltip>
                    <button
                        type="button"
                        className="btn btn-xs !pt-0.5 !font-bold px-4 btn-primary rounded-full disabled:select-none"
                        onClick={handleCreatePostClick}
                        disabled={(postContent.trim().length === 0 && !postImagePreview) || isPending}
                    >
                        {
                            isPending ? <img
                                src="/assets/loading-spinner.gif"
                                alt="Loading-spinner"
                                className="w-3"
                            /> : "Post"
                        }
                    </button>
                </div>
            </div>
        </dialog>
    )
}