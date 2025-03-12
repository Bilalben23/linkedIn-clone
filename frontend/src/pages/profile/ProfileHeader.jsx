import { FiEdit2 } from "react-icons/fi";
import { formatNumber } from "../../utils/formatNumber";
import { FaUserPlus } from "react-icons/fa";
import { MdOutlineSchedule } from "react-icons/md";
import { LuCloudUpload, LuTrash2 } from "react-icons/lu";
import { useUpdateProfile } from "../../hooks/useUserProfile";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import readFileAsDataURL from "../../utils/readFileAsDataURL";
import ProfileHeaderSkelton from "../../components/skeletons/ProfileHeaderSkelton";

const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB


export default function ProfileHeader({ details, connectionsCount, isMyProfile, isLoading }) {
    const isConnected = false;

    const { mutate: updateProfile, isPending } = useUpdateProfile()
    const [bannerImg, setBannerImg] = useState(null);
    const [bannerImgPreview, setBannerImgPreview] = useState(null);


    const handleDeleteBannerImage = () => {
        const isConfirmed = confirm("Are you sure you want to delete this banner image?");
        if (!isConfirmed) return;

        updateProfile({ bannerImg: null }, {
            onError: (err) => {
                console.error(err);
                toast.error(err.response?.data?.message || "Something went wrong!");
            }
        })
    }

    const handleBannerImageChange = (e) => {
        const file = e.target.files[0];

        if (file && file.size > MAX_FILE_SIZE) {
            toast.error("File size is too large. Max 10MB.");
            return;
        }
        setBannerImg(file);
    }

    const handleSavingBannerImage = () => {
        const formData = new FormData();
        formData.append("bannerImg", bannerImg);
        updateProfile(formData, {
            onSuccess: () => {
                setBannerImg(null);
                setBannerImgPreview(null);
                toast.success("Banner image updated successfully")
            },
            onError: (err) => {
                toast.error(err.response?.data?.message || "Something went wrong!")
            }
        })
    }
    useEffect(() => {
        if (bannerImg) {
            readFileAsDataURL(bannerImg)
                .then(setBannerImgPreview)
                .catch(console.error);
        } else {
            setBannerImgPreview(null);
        }
    }, [bannerImg]);


    return (
        <div className='border border-gray-300 shadow-xs rounded-box p-0.5 bg-base-100'>
            {
                !isLoading
                    ? <ProfileHeaderSkelton />
                    : <div>

                        {/* banner and profile picture */}
                        <div className="relative pb-1 mb-2 select-none">
                            {
                                isMyProfile && <>
                                    <div className="absolute top-2 right-2 z-10">
                                        <div className="dropdown">
                                            <div role="button" tabIndex={0} className="btn btn-xs btn-ghost btn-circle border-0 bg-base-100"
                                                title="Edit banner image">
                                                <FiEdit2 strokeWidth={3} className="text-blue-800" size={15} />
                                            </div>

                                            <ul tabIndex={0} className='dropdown-content flex gap-y-0.5 flex-col !mt-1 !right-0 z-[1]'>

                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    name="bannerImg"
                                                    id="bannerImg"
                                                    accept="image/*"
                                                    aria-label="Upload an banner image"
                                                    onChange={handleBannerImageChange}
                                                />

                                                <li className="tooltip tooltip-left" data-tip="upload new">
                                                    <label htmlFor="bannerImg" role="button" className="btn btn-xs btn-circle btn-success">
                                                        <LuCloudUpload className="size-3.5" />
                                                    </label>
                                                </li>
                                                {
                                                    details.bannerImg && <li className="tooltip tooltip-left" data-tip="delete">
                                                        <button
                                                            type="button"
                                                            className="btn btn-xs btn-circle btn-error"
                                                            onClick={handleDeleteBannerImage}
                                                            disabled={isPending}
                                                        >
                                                            <LuTrash2 className="size-3.5" />
                                                        </button>
                                                    </li>
                                                }
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-0 right-2 z-1">
                                        <button type="button" className="btn btn-sm btn-circle border-0 btn-ghost">
                                            <FiEdit2 strokeWidth={3} size={20} />
                                        </button>
                                    </div>
                                </>
                            }

                            <div className='relative mb-10'>

                                <div className='h-[220px] w-full relative'>
                                    <img src={
                                        bannerImgPreview || (details.bannerImg
                                            ? `${CLOUDINARY_BASE_URL + details.bannerImg}`
                                            : "/assets/banner.png")
                                    }
                                        alt={`${details.name}'s banner`}
                                        className="size-full rounded-t-lg"
                                    />

                                    {
                                        bannerImgPreview && <div className="absolute bottom-2 right-2 z-10">
                                            <button type="button"
                                                className="btn btn-xs btn-warning rounded-full"
                                                onClick={handleSavingBannerImage}
                                                disabled={isPending}
                                            >
                                                {
                                                    isPending ? <>
                                                        <img
                                                            src="/assets/loading-spinner.gif"
                                                            alt="loading-spinner"
                                                            className="size-3"
                                                        />
                                                        Saving...
                                                    </> : "Save"
                                                }
                                            </button>
                                        </div>
                                    }
                                </div>
                                <div className='absolute rounded-full left-[5%] -bottom-10 size-32 border-4 border-white'>
                                    <img src={details.profilePicture
                                        ? `${CLOUDINARY_BASE_URL + details.profilePicture}`
                                        : "/assets/avatar.png"
                                    }
                                        alt={`${details.name}'s profile`}
                                        className='size-full rounded-full'
                                    />
                                </div>
                            </div>
                        </div>

                        {/* profile details */}
                        <div className="pb-4 px-5">

                            <p className="font-black text-xl">{details.name}</p>
                            <p className="text-sm w-3/4">{details.headline}</p>
                            <div className="flex text-xs items-center gap-x-1.5 mt-1 flex-wrap">
                                <p className="text-black/60">{details.location}</p>
                                <span className="size-0.5 rounded-full bg-black"></span>
                                <button className="text-primary font-bold cursor-pointer link-hover">Contact info</button>
                            </div>
                            <button className="text-primary cursor-pointer font-bold link-hover text-xs">{formatNumber(connectionsCount)} connection{connectionsCount === 1 ? "" : "s"}</button>

                            <div className="flex items-center gap-x-2 mt-2">
                                {
                                    isMyProfile
                                        ? <>
                                            <button type="button" className="btn btn-xs font-black rounded-full btn-primary">Open to</button>
                                            <button type="button" className="btn btn-xs rounded-full btn-outline font-black btn-primary">Add profile section</button>
                                            <button type="button" className="btn btn-xs rounded-full btn-primary btn-outline font-black">Open to</button>
                                        </>
                                        :
                                        <button
                                            type="button"
                                            className="btn btn-xs rounded-full btn-primary btn-outline"
                                        // onClick={() => handleSendConnectionRequest(user._id)}
                                        // disabled={isPending}
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
                                }

                                <button type="button" className="btn btn-xs rounded-full btn-neutral btn-outline">More</button>
                            </div>
                        </div>
                    </div>
            }
        </div >
    )
}
