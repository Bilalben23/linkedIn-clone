import { useRef, useState } from 'react';
import { IoClose } from "react-icons/io5";
import { LuCloudUpload, LuTrash2 } from "react-icons/lu";
import { toast } from 'react-toastify';
import { useUpdateProfile } from '../../hooks/useUserProfile';
import readFileAsDataURL from '../../utils/readFileAsDataURL';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;

export default function UpdateBannerImageModal({ bannerImage }) {
    const { mutate: updateProfile, isPending } = useUpdateProfile();
    const dialogFormRef = useRef();

    const [newBannerImage, setNewBannerImage] = useState(null);
    const [newBannerImagePreview, setNewBannerImagePreview] = useState(null);

    const handleNewBannerImageChange = (e) => {
        const file = e.target.files[0];

        if (file && file.size > MAX_FILE_SIZE) {
            toast.error("File size is too large. Max 10MB.");
            return;
        }

        setNewBannerImage(file);

        // Update preview immediately
        readFileAsDataURL(file)
            .then(setNewBannerImagePreview)
            .catch(console.error);
    };

    const handleSavingNewBannerImage = () => {
        const formData = new FormData();
        formData.append("bannerImg", newBannerImage);
        updateProfile(formData, {
            onSuccess: () => {
                setNewBannerImage(null);
                setNewBannerImagePreview(null);
                dialogFormRef.current?.submit();
                toast.success("Banner image updated successfully");
            },
            onError: (err) => {
                toast.error(err.response?.data?.message || "Something went wrong!");
            }
        });
    };

    const handleDeleteBannerImage = () => {
        const isConfirmed = confirm("Are you sure you want to delete this banner image?");
        if (!isConfirmed) return;

        updateProfile({ bannerImg: null }, {
            onSuccess: () => {
                dialogFormRef.current?.submit();
            },
            onError: (err) => {
                toast.error(err.response?.data?.message || "Something went wrong!");
            }
        });
    };

    return (
        <dialog id="updateBannerImageModal" className="modal">
            <div className="modal-box !p-0 bg-gray-900 text-white">
                <div className='flex items-center justify-between p-4'>
                    <h1 className='font-bold text-lg'>Banner Image</h1>
                    <form method="dialog" ref={dialogFormRef}>
                        <button type='submit' className='btn btn-sm btn-circle btn-ghost border-none'>
                            <IoClose size={30} />
                        </button>
                    </form>
                </div>

                <div className='flex items-center justify-center mt-2 border-b px-4 pb-4 border-gray-700'>
                    <img
                        src={newBannerImagePreview || (
                            bannerImage
                                ? `${CLOUDINARY_BASE_URL}${bannerImage}`
                                : "/assets/banner.png"
                        )}
                        alt='Banner Image'
                        className='rounded-lg w-full h-40'
                    />
                </div>

                <div className='flex items-center gap-x-4 justify-end p-4'>
                    {newBannerImage ? (
                        <button type='button'
                            className='btn btn-sm disabled:!bg-gray-100'
                            onClick={handleSavingNewBannerImage}
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <img src="/assets/loading-spinner.gif"
                                        alt="Loading Spinner"
                                        className='size-4'
                                    />
                                    Saving...
                                </>
                            ) : "Save"}
                        </button>
                    ) : (
                        <>
                            <input
                                type="file"
                                className="hidden"
                                name="bannerImage"
                                id="bannerImage"
                                accept="image/*"
                                aria-label="Upload a banner image"
                                onChange={handleNewBannerImageChange}
                                disabled={isPending} // Prevent uploading while saving/deleting
                            />

                            <label
                                htmlFor='bannerImage'
                                role="button"
                                className='btn btn-sm disabled:!bg-gray-400'
                            >
                                <LuCloudUpload size={20} />
                                Upload photo
                            </label>

                            <button type="button"
                                className='btn btn-sm btn-error disabled:!bg-error/30'
                                onClick={handleDeleteBannerImage}
                                disabled={isPending}
                            >
                                <LuTrash2 size={20} />
                                {isPending ? "Deleting..." : "Delete"}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </dialog>
    );
}
