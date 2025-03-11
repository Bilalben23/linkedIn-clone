import { FiEdit2 } from "react-icons/fi";

const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;


export default function ProfileHeader({ details, isLoading }) {

    return (
        <div className='border border-gray-300 shadow-xs rounded-box p-0.5 bg-base-100'>
            {
                isLoading
                    ? <p>Loading...</p>

                    : <div>

                        {/* banner and profile picture */}
                        <div className="relative pb-1 mb-2">
                            <div className="absolute top-2 right-2 z-1">
                                <button type="button" className="btn btn-xs btn-ghost btn-circle border-0 bg-base-100">
                                    <FiEdit2 strokeWidth={3} className="text-blue-800" size={15} />
                                </button>
                            </div>
                            <div className="absolute bottom-0 right-2 z-1">
                                <button type="button" className="btn btn-sm btn-circle border-0 btn-ghost">
                                    <FiEdit2 strokeWidth={3} size={20} />
                                </button>
                            </div>

                            <div className='relative mb-10'>

                                <div className='h-[220px] w-full'>
                                    <img src={
                                        details.bannerImg
                                            ? `${CLOUDINARY_BASE_URL + details.bannerImg}`
                                            : "/assets/banner.png"
                                    }
                                        alt={`${details.name}'s banner`}
                                        className="size-full rounded-t-lg"
                                    />
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
                            <button className="text-primary cursor-pointer font-bold link-hover text-xs">5555 connections</button>

                            <div className="flex items-center gap-x-2 mt-2">
                                <button type="button" className="btn btn-xs font-black rounded-full btn-primary">Open to</button>
                                <button type="button" className="btn btn-xs rounded-full btn-outline font-black btn-primary">Add profile section</button>
                                <button type="button" className="btn btn-xs rounded-full btn-primary btn-outline font-black">Open to</button>
                                <button type="button" className="btn btn-xs rounded-full btn-neutral btn-outline">Open to</button>
                            </div>
                        </div>

                    </div>
            }

        </div>
    )
}
