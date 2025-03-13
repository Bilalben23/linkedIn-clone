import { FiEdit2 } from "react-icons/fi";
import { formatNumber } from "../../utils/formatNumber";
import { FaUserPlus } from "react-icons/fa";
import { MdOutlineSchedule } from "react-icons/md";
import ProfileHeaderSkelton from "../../components/skeletons/ProfileHeaderSkelton";
import UpdateProfilePictureModal from "./UpdateProfilePictureModal";
import UpdateBannerImageModal from "./UpdateBannerImageModal";

const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;

export default function ProfileHeader({ details, connectionsCount, isMyProfile, isLoading }) {
    const isConnected = false;

    return (
        <div className='border border-gray-300 shadow-xs rounded-box p-0.5 bg-base-100'>
            {
                isLoading
                    ? <ProfileHeaderSkelton />
                    : <div>

                        {/* banner and profile picture */}
                        <div className="relative pb-1 mb-2 select-none">
                            {
                                isMyProfile && <>
                                    <div className="absolute top-2 right-2 z-10">
                                        <div className="dropdown">
                                            <button
                                                type="button"
                                                className="btn btn-xs btn-ghost btn-circle border-0 bg-base-100"
                                                onClick={() => document.getElementById('updateBannerImageModal').showModal()}
                                            >
                                                <FiEdit2 strokeWidth={3} className="text-blue-800" size={15} />
                                            </button>

                                            <UpdateBannerImageModal bannerImage={details.bannerImg} />

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
                                    <img src={details.bannerImg
                                        ? `${CLOUDINARY_BASE_URL + details.bannerImg}`
                                        : "/assets/banner.png"
                                    }
                                        alt={`${details.name}'s banner`}
                                        className="size-full rounded-t-box"
                                    />

                                </div>
                                <div className='absolute rounded-full cursor-pointer left-[5%] -bottom-10 size-32 border-4 border-white' onClick={() => document.getElementById('updateProfilePictureModal').showModal()}>
                                    <img src={details.profilePicture
                                        ? `${CLOUDINARY_BASE_URL + details.profilePicture}`
                                        : "/assets/avatar.png"
                                    }
                                        alt={`${details.name}'s profile`}
                                        className='size-full rounded-full'
                                    />
                                </div>

                                <UpdateProfilePictureModal profilePicture={details.profilePicture} />
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
        </div>
    )
}
