import { Link, useSearchParams } from 'react-router-dom';
import { FaEllipsisH } from "react-icons/fa";
import { timeAgo } from "../../utils/timeAgo";
import { useMarksAsRead } from '../../hooks/useNotifications';


const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;

export default function NotificationItem({ notification, lastNotificationRef }) {
    const [searchParams] = useSearchParams();
    const filter = searchParams.get("filter") || "all";
    console.log(notification);

    const { mutate: markNotificationAsRead } = useMarksAsRead(filter);

    const handleMarkNotificationAsRead = () => {
        markNotificationAsRead(notification._id);
    }


    return (
        <div className={`px-4 py-3 cursor-pointer border-b border-gray-300 flex gap-x-2 ${notification.read ? "hover:bg-base-200" : "bg-[#378fe933] hover:bg-[#C3DDF8]"}`} ref={lastNotificationRef} onClick={handleMarkNotificationAsRead}>
            {
                (notification.type === "comment" || notification.type === "reaction") && <>
                    <Link to={`/profile/${notification.triggeredBy.username}`} className='shrink-0'>
                        <img
                            src={notification.triggeredBy.profilePicture
                                ? `${CLOUDINARY_BASE_URL + notification.triggeredBy.profilePicture}`
                                : '/assets/avatar.png'}
                            alt={`${notification.triggeredBy.name}'s avatar`}
                            className='size-10 rounded-full'
                        />
                    </Link>

                    <Link to={`/post/${notification.relatedPost._id}`} className='flex-1 mt-1'>
                        <p className='text-xs mb-0.5'>
                            <span className='font-extrabold'>{notification.triggeredBy.name}</span>
                            {
                                notification.type === "comment"
                                    ? <span> and 2 others commented on your post.</span>
                                    : <span> and 2 others reacted on your post.</span>
                            }
                        </p>
                        <div className='border-[1.5px] mt-1 border-gray-300 rounded-box'>
                            {
                                notification.type === "comment" && <p className='p-2 border-b-[1.5px] text-xs border-gray-300'>Insightful</p>
                            }
                            <div className='flex gap-x-2 p-1 bg-[#378fe9]/2 items-center'>
                                {
                                    notification.relatedPost.image && <div className='shrink-0'>
                                        <img
                                            src={CLOUDINARY_BASE_URL + notification.relatedPost.image}
                                            alt="image"
                                            className={`${notification.type === "comment" ? "w-14" : "w-16 h-12"}`}
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

                    <div className='shrink-0 flex mt-1 flex-col gap-y-0.5 items-center'>
                        <p className='text-[12px] text-black/70'>{timeAgo(notification.createdAt)}</p>
                        <button type="button" className='btn btn-circle btn-sm border-0 btn-ghost'>
                            <FaEllipsisH className='text-black/70' />
                        </button>
                    </div>
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
