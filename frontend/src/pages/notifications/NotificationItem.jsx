import { Link } from 'react-router-dom';
import { FaEllipsisH } from "react-icons/fa";
import { timeAgo } from "../../utils/timeAgo";


const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;

export default function NotificationItem({ notification, lastNotificationRef }) {
    console.log(notification);

    return (
        <div className={`px-4 py-3 cursor-pointer border-b border-gray-300 flex gap-x-2 ${!notification.read ? "hover:bg-base-200" : "bg-[#378fe933] hover:bg-[#C3DDF8]"}`} ref={lastNotificationRef}>
            {
                notification.type === "comment" && <>

                    <Link to={`/profile/${notification.triggeredBy.username}`} className='shrink-0'>
                        <img
                            src={notification.triggeredBy.profilePicture
                                ? `${CLOUDINARY_BASE_URL + notification.triggeredBy.profilePicture}`
                                : '/assets/avatar.png'}
                            alt={`${notification.triggeredBy.name}'s avatar`}
                            className='size-10 rounded-full'
                        />
                    </Link>

                    <Link to="#" className='flex-1 mt-2'>
                        <p className='text-xs mb-0.5'>
                            <span className='font-extrabold'>{notification.triggeredBy.name}</span>
                            <span> and 2 others commented on your post.</span>
                        </p>
                        <div className='border-[1.5px] mt-1 border-gray-300 rounded-box'>
                            <p className='p-2 border-b-[1.5px] text-xs border-gray-300'>Insightful</p>
                            <div className='flex gap-x-2 p-1 bg-[#378fe9]/2'>
                                {
                                    notification.relatedPost.image && <div className='shrink-0'>
                                        <img
                                            src={CLOUDINARY_BASE_URL + notification.relatedPost.image}
                                            alt="image"
                                            className='w-14'
                                        />
                                    </div>
                                }
                                {
                                    notification.relatedPost.content && <div className='flex-1'>
                                        <p className='text-black/70 line-clamp-2 text-xs'>{notification.relatedPost.content}</p>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className='flex mt-1 items-center gap-x-1.5 text-[12px] text-black/70 font-extralight'>
                            <p>22 reactions</p>
                            <p className='size-[3px] bg-black/70 rounded-full shrink-0'></p>
                            <p>12 comments</p>
                        </div>
                    </Link>

                    <div className='shrink-0 flex mt-2 flex-col gap-y-0.5 items-center'>
                        <p className='text-[12px] text-black/70'>{timeAgo(notification.createdAt)}</p>
                        <button type="button" className='btn btn-circle btn-sm border-0 btn-ghost'>
                            <FaEllipsisH className='text-black/70' />
                        </button>
                    </div>

                </>
            }
            {
                notification.type === "reaction" && <>
                    reaction notification
                </>
            }
            {
                notification.type === "newPost" && <>
                    new post notification
                </>
            }
        </div>
    )
}
