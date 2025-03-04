import { useState } from "react";
import { useFormik } from "formik";
import useCreatePost from '../../../hooks/useCreatePost';
import { FaCaretDown, FaRegCalendarAlt, FaCertificate, FaBriefcase, FaRegFileAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { FaRegFaceSmile } from "react-icons/fa6";
import { LuPlus } from "react-icons/lu";
import { TbPhoto } from "react-icons/tb";
import { MdBarChart, MdContactPage, MdOutlineSchedule } from "react-icons/md";
import { BsPlayBtnFill } from "react-icons/bs";
import { AnimatePresence, motion } from "framer-motion";

const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;

export default function CreatePostModal({ user }) {
    const [showMoreOptions, setShowMoreOptions] = useState(false);


    const { mutate: createPostMutation } = useCreatePost();

    const onSubmit = (values, actions) => {
        // Handle form submission
    }

    const { errors, values, handleSubmit, isSubmitting } = useFormik({
        initialValues: {
            content: "",
            image: "",
            imagePreview: ""
        },
        onSubmit
    });


    return (
        <dialog id="createPost_modal" className="modal border !w-full">
            <div className="modal-box scrollbar-thin !max-w-[60%] !w-full px-0 py-3">
                <div className="flex justify-between px-4">
                    <div className="flex items-center gap-x-3">
                        <div>
                            <img
                                src={
                                    user?.profilePicture
                                        ? `${CLOUDINARY_BASE_URL + user.profilePicture}`
                                        : "/assets/avatar.png"
                                }
                                alt={`${user.name}'s avatar`}
                                className='size-12 rounded-full'
                            />
                        </div>
                        <div>
                            <p className="text-xl font-bold flex items-center gap-x-2">
                                <span>{user.name}</span>
                                <span className="text-gray-700">
                                    <FaCaretDown />
                                </span>
                            </p>
                            <p className="text-xs">Post to anyone</p>
                        </div>
                    </div>

                    <div className="modal-action mt-0">
                        <form method="dialog">
                            <button type="submit" className='btn btn-sm text-gray-700 btn-ghost btn-circle border-0'>
                                <IoClose size={30} />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-4 px-5">
                    <textarea
                        name="content"
                        placeholder="What do you want to talk about?"
                        className="w-full h-52 pr-3 py-2 focus:outline-0 resize-none scrollbar-thin"
                        autoFocus
                    ></textarea>
                </div>

                <div className="flex flex-col gap-y-2 px-4 pb-2 border-b border-gray-300">
                    <div>
                        <button type='button' className='btn btn-ghost btn-sm btn-circle border-0 hover:bg-gray-200/50'>
                            <FaRegFaceSmile size={22} />
                        </button>
                    </div>
                    <div className="flex items-center gap-x-3">
                        <div className="tooltip before:!text-xs after:!hidden before:!shadow-md before:!z-50 before:border before:border-gray-100 before:!px-2 before:!left-7 before:!py-1.5 before:!rounded-md before:!bg-base-100 before:!text-black" data-tip="Add a video">
                            <button type='button' className='p-2 cursor-pointer rounded-full'>
                                <BsPlayBtnFill size={22} className="text-gray-600" />
                            </button>
                        </div>
                        <div className="tooltip before:!text-xs after:!hidden before:!shadow-md before:!z-50 before:border before:border-gray-100 before:!px-2 before:!py-1.5 before:!bg-base-100 before:!rounded-md before:!text-black" data-tip="Add a photo">
                            <button type='button' className='p-2 cursor-pointer rounded-full'>
                                <TbPhoto size={25} className="text-gray-600" />
                            </button>
                        </div>
                        <div className="tooltip before:!text-xs after:!hidden before:!shadow-md before:!z-50 before:border before:border-gray-100 before:!px-2 before:!py-1.5 before:!bg-base-100 before:!rounded-md before:!text-black" data-tip="Create an event">
                            <button type='button' className='p-2 cursor-pointer rounded-full'>
                                <FaRegCalendarAlt size={22} className="text-gray-600" />
                            </button>
                        </div>

                        {
                            !showMoreOptions
                                ? <div className="tooltip before:!text-xs after:!hidden before:!shadow-md before:!z-50 before:!rounded-md before:border before:border-gray-100 before:!px-2 before:!py-1.5 before:!bg-base-100 before:!text-black" data-tip="More">
                                    <button type='button' className='p-2 cursor-pointer rounded-full' onClick={() => setShowMoreOptions(true)}>
                                        <LuPlus strokeWidth={2} size={27} className="text-gray-600" />
                                    </button>
                                </div>
                                :
                                <AnimatePresence>
                                    <>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.3, delay: 0.1 }}
                                            className="tooltip before:!text-xs after:!hidden before:!shadow-md before:!z-50 before:border before:border-gray-100 before:!px-2 before:!py-1.5 before:!rounded-md before:!bg-base-100 before:!text-black"
                                            data-tip="Celebrate an occasion">
                                            <button type='button' className='p-2 cursor-pointer rounded-full'>
                                                <FaCertificate size={22} className="text-gray-600" />
                                            </button>
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.3, delay: 0.2 }}
                                            className="tooltip before:!text-xs after:!hidden before:!shadow-md before:!z-50 before:border before:border-gray-100 before:!px-2 before:!py-1.5 before:!rounded-md before:!bg-base-100 before:!text-black"
                                            data-tip="Share that you're hiring">
                                            <button type='button' className='p-2 cursor-pointer rounded-full'>
                                                <FaBriefcase size={22} className="text-gray-600" />
                                            </button>
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.3, delay: 0.3 }}
                                            className="tooltip before:!text-xs after:!hidden before:!shadow-md before:!z-50 before:border before:border-gray-100 before:!px-2 before:!py-1.5 before:!rounded-md before:!bg-base-100 before:!text-black"
                                            data-tip="Create a poll">
                                            <button type='button' className='p-2 cursor-pointer rounded-full'>
                                                <MdBarChart size={22} className="text-gray-600" />
                                            </button>
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.3, delay: 0.4 }}
                                            className="tooltip before:!rounded-md before:!text-xs after:!hidden before:!shadow-md before:!z-50 before:border before:border-gray-100 before:!px-2 before:!py-1.5 before:!bg-base-100 before:!text-black"
                                            data-tip="Add a document">
                                            <button type='button' className='p-2 cursor-pointer rounded-full'>
                                                <FaRegFileAlt size={22} className="text-gray-600" />
                                            </button>
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.3, delay: 0.5 }}
                                            className="tooltip before:!text-xs after:!hidden before:!shadow-md before:!z-50 before:border before:border-gray-100 before:!px-2 before:!py-1.5 before:!bg-base-100 before:!text-black"
                                            data-tip="Find an expert">
                                            <button type='button' className='p-2 cursor-pointer rounded-full'>
                                                <MdContactPage size={22} className="text-gray-600" />
                                            </button>
                                        </motion.div>
                                    </>
                                </AnimatePresence>
                        }
                    </div>
                </div>

                <div className="flex items-center justify-end gap-x-3 px-4 pt-3">
                    <div className="tooltip before:!text-xs after:!hidden before:!shadow-md before:!z-50 before:border before:border-gray-100 before:!px-2 before:!left-7 before:!py-1.5 before:!rounded-md before:!bg-base-100 before:!text-black" data-tip="Schedule for later">
                        <button type='button' className='btn btn-ghost btn-sm btn-circle border-0 hover:bg-gray-200/50'>
                            <MdOutlineSchedule size={25} className="text-gray-600" />
                        </button>
                    </div>
                    <button
                        type="button"
                        className="btn btn-xs !pt-0.5 !font-bold px-4 btn-primary rounded-full disabled:select-none"
                        disabled={true}
                    >Post</button>
                </div>
            </div>
        </dialog>
    );
}