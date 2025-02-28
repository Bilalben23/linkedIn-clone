import { FaMapMarkerAlt, FaBookmark } from "react-icons/fa";
import { Link } from "react-router-dom";

const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;


export default function Sidebar({ user }) {
    return (
        <section className="md:flex-col md:gap-y-2 hidden md:flex">

            <Link to={`/profile/${user.username}`} className='bg-base-100 rounded-md shadow border border-gray-200 overflow-hidden'>
                <div className='relative mb-9'>
                    <div className='h-[85px] w-full'>
                        <img src={
                            user.bannerImg
                                ? `${CLOUDINARY_BASE_URL + user.bannerImg}`
                                : "/assets/banner.png"
                        }
                            alt={`${user.name}'s banner`}
                            className="size-full rounded-t-lg"
                        />
                    </div>
                    <div className='absolute rounded-full left-[5%] -bottom-10 size-16 border-2 border-white'>
                        <img src={user.profilePicture
                            ? `${CLOUDINARY_BASE_URL + user.profilePicture}`
                            : "/assets/avatar.png"
                        }
                            alt={`${user.name}'s profile`}
                            className='size-full rounded-full'
                        />
                    </div>
                </div>
                <div className='fle flex-col space-y-1 p-3'>
                    <p className='font-black tracking-wide text-lg line-clamp-1'>{user.name}</p>
                    <p className='text-sm line-clamp-2 font-light'>{user.headline}</p>
                    <p className='text-sm text-gray-600 line-clamp-2 font-light flex items-center gap-x-1'>
                        <FaMapMarkerAlt size={14} />
                        <span>{user.location}</span>
                    </p>
                </div>
            </Link>

            <div className="p-4 bg-base-100 rounded-lg shadow border border-gray-200 flex flex-col gap-y-2">
                <Link to="#" className="flex items-center justify-between group font-semibold">
                    <p className="text-sm group-hover:underline">Profile Views</p>
                    <p className="text-sm text-[#0A66C2] group-hover:underline">222</p>
                </Link>
                <Link to="#" className="flex items-center justify-between group font-semibold">
                    <p className="text-sm group-hover:underline">Post Impressions</p>
                    <p className="text-sm text-[#0A66C2] group-hover:underline">1991</p>
                </Link>
            </div>
            <div className="p-4 bg-base-100 rounded-lg shadow border border-gray-200 flex flex-col gap-y-2">
                <Link to="#" className="text-sm font-semibold flex items-center gap-x-2 group">
                    <FaBookmark fill="#000000" />
                    <span className="group-hover:underline">Saved Item</span>
                </Link>
            </div>

        </section>
    )
}
