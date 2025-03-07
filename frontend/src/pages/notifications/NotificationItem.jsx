import { Link, useSearchParams } from 'react-router-dom';
import { timeAgo } from "../../utils/timeAgo";
import { useDeleteNotification, useMarksAsRead } from '../../hooks/useNotifications';
import NotificationDropdown from './NotificationDropdown';

const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;

export default function NotificationItem({ notification, lastNotificationRef }) {
    const [searchParams] = useSearchParams();
    const filter = searchParams.get("filter") || "all";
    console.log(notification);

    const { mutate: markNotificationAsRead } = useMarksAsRead(filter);
    const { mutate: deleteNotification, isPending: isDeleting } = useDeleteNotification();

    const handleMarkAsRead = () => markNotificationAsRead(notification._id);
    const handleDelete = () => deleteNotification(notification._id);

    const isCommentOrReaction = notification.type === "comment" || notification.type === "reaction";
    const isNewPost = notification.type === "newPost";

    return (
        <div
            ref={lastNotificationRef}
            onClick={handleMarkAsRead}
            className={`px-4 py-3 border-b border-gray-300 flex gap-x-2 cursor-pointer relative ${notification.read ? "hover:bg-base-200" : "bg-[#378fe933] hover:bg-[#C3DDF8] before:absolute before:left-1.5 before:top-1/2 before:-translate-y-1/2 before:size-1 before:rounded-full before:bg-blue-500"}`}>

            <Link to={`/profile/${notification.triggeredBy.username}`} className='shrink-0 self-start relative'>
                <img
                    src={notification.triggeredBy.profilePicture ? `${CLOUDINARY_BASE_URL + notification.triggeredBy.profilePicture}` : '/assets/avatar.png'}
                    alt={`${notification.triggeredBy.name}'s avatar`}
                    className='size-10 rounded-full'
                />
            </Link>

            <Link to={`/post/${notification.relatedPost._id}`} className='flex-1'>
                <p className='text-xs mb-0.5 line-clamp-3'>
                    <span className='font-extrabold'>{notification.triggeredBy.name}</span>
                    {isCommentOrReaction && (
                        <span> and {notification.type === "comment" ? notification.commentsCount - 1 : notification.reactionsCount - 1} others {notification.type === "comment" ? "commented" : "reacted"} on your post.</span>
                    )}

                    {isNewPost && <span className=''> posted: {notification.relatedPost.content}</span>}
                </p>

                {isCommentOrReaction && (
                    <div className='border-[1.5px] mt-1 border-gray-300 rounded-box'>
                        <div className='flex gap-x-2 p-1 bg-[#378fe9]/2 items-center'>
                            {notification.relatedPost.image && (
                                <img
                                    src={CLOUDINARY_BASE_URL + notification.relatedPost.image}
                                    alt="Post"
                                    className='w-16 h-12'
                                />
                            )}
                            {notification.relatedPost.content && (
                                <p className='text-black/70 line-clamp-2 text-xs'>{notification.relatedPost.content}</p>
                            )}
                        </div>
                    </div>
                )}
                {
                    isCommentOrReaction && <div className='flex mt-1 items-center gap-x-1.5 text-[12px] text-black/70 font-extralight'>
                        <p>{notification.reactionsCount} reactions</p>
                        <p className='size-[3px] bg-black/70 rounded-full shrink-0'></p>
                        <p>{notification.commentsCount} comments</p>
                    </div>
                }

            </Link>

            <div className='shrink-0 self-start flex flex-col gap-y-0.5 items-center' onClick={(e) => e.stopPropagation()}>
                <p className='text-[12px] text-black/70'>{timeAgo(notification.createdAt)}</p>
                <NotificationDropdown onDelete={handleDelete} isDeleting={isDeleting} />
            </div>
        </div>
    );
}
