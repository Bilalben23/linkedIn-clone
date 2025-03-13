import { useRef, useState } from 'react';
import { IoClose } from "react-icons/io5";
import { LuCloudUpload, LuTrash2 } from "react-icons/lu";
import { toast } from 'react-toastify';
import { useUpdateProfile } from '../../hooks/useUserProfile';
import readFileAsDataURL from '../../utils/readFileAsDataURL';
import useAuth from '../../hooks/useAuth';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;

export default function UpdateProfilePictureModal({ profilePicture }) {
    const { mutate: updateProfile, isPending } = useUpdateProfile();
    const dialogFormRef = useRef();
    const { updateProfileDetails } = useAuth();

    const [newProfilePicture, setNewProfilePicture] = useState(null);
    const [newProfilePicturePreview, setNewProfilePicturePreview] = useState(null);

    const handleNewProfilePictureChange = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (file.size > MAX_FILE_SIZE) {
            toast.error("File size is too large. Max 10MB.");
            return;
        }

        setNewProfilePicture(file);
        try {
            const preview = await readFileAsDataURL(file);
            setNewProfilePicturePreview(preview);
        } catch (error) {
            console.error("Error generating preview:", error);
        }
    };

    const handleSavingNewProfilePicture = () => {
        if (!newProfilePicture) return;

        const formData = new FormData();
        formData.append("profilePicture", newProfilePicture);

        updateProfile(formData, {
            onSuccess: (data) => {
                updateProfileDetails("profilePicture", data.data?.profilePicture);
                setNewProfilePicture(null);
                setNewProfilePicturePreview(null);
                dialogFormRef.current?.submit();
                toast.success("Profile picture updated successfully");
            },
            onError: (err) => {
                toast.error(err.response?.data?.message || "Something went wrong!");
            }
        });
    };


    const handleDeleteProfilePicture = () => {
        if (!confirm("Are you sure you want to delete this profile picture?")) return;

        updateProfile({ profilePicture: null }, {
            onSuccess: () => {
                dialogFormRef.current?.submit();
                toast.success("Profile picture deleted successfully");
            },
            onError: (err) => {
                toast.error(err.response?.data?.message || "Something went wrong!");
            }
        });
    };

    return (
        <dialog id="updateProfilePictureModal" className="modal">
            <div className="modal-box !p-0 bg-gray-900 text-white">
                <div className='flex items-center justify-between p-4'>
                    <h1 className='font-bold text-lg'>Profile Picture</h1>
                    <form method="dialog" ref={dialogFormRef}>
                        <button type='submit' className='btn btn-sm btn-circle btn-ghost border-none'>
                            <IoClose size={30} />
                        </button>
                    </form>
                </div>

                <div className='flex items-center justify-center mt-2 border-b px-4 pb-4 border-gray-700'>
                    <img
                        src={newProfilePicturePreview || (profilePicture ? `${CLOUDINARY_BASE_URL}${profilePicture}` : "/assets/avatar.png")}
                        alt='Profile picture'
                        className='rounded-full size-52'
                    />
                </div>

                <div className='flex items-center gap-x-4 justify-end p-4'>
                    {newProfilePicture ? (
                        <button
                            type='button'
                            className='btn btn-sm disabled:!bg-gray-100'
                            onClick={handleSavingNewProfilePicture}
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <img src="/assets/loading-spinner.gif" alt="Loading Spinner" className='size-4' />
                                    Saving...
                                </>
                            ) : "Save"}
                        </button>
                    ) : (
                        <>
                            <input
                                type="file"
                                className="hidden"
                                name="profilePicture"
                                id="profilePicture"
                                accept="image/*"
                                aria-label="Upload a profile picture"
                                onChange={handleNewProfilePictureChange}
                                disabled={isPending}
                            />
                            <label htmlFor='profilePicture' role="button" className='btn btn-sm disabled:!bg-gray-400'>
                                <LuCloudUpload size={20} />
                                Upload photo
                            </label>
                            <button
                                type="button"
                                className='btn btn-sm btn-error disabled:!bg-error/30'
                                onClick={handleDeleteProfilePicture}
                                disabled={isPending}
                            >
                                <LuTrash2 size={20} />
                                {isPending ? "Deleting" : "Delete"}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </dialog>
    );
}
