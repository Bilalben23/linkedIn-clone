import NotificationSkeleton from "../../components/skeletons/NotificationSkeleton";
import NotificationItem from "./NotificationItem";

export default function NotificationContent({ notifications, isLoading, isError, error, hasNextPage, isFetchingNextPage, lastNotificationRef }) {

    return (
        <div className='flex mt-3 flex-col overflow-hidden bg-white rounded-box shadow-xs border border-gray-300'>
            {
                isLoading
                    ? Array.from({ length: 8 }).map((_, index) => <NotificationSkeleton
                        id={index}
                        key={index}
                    />)
                    : notifications?.pages?.map((group) => {
                        return group.data.map((notification, index, array) => {
                            return <NotificationItem
                                key={notification._id}
                                notification={notification}
                                lastNotificationRef={index === array.length - 1 ? lastNotificationRef : null}
                            />
                        })
                    })
            }

            {/* loading indicator */}
            {
                hasNextPage && isFetchingNextPage && (
                    <div className='flex items-center justify-center mt-2 py-4'>
                        <img
                            src="/assets/loading-spinner.gif"
                            alt="Loading spinner"
                            className='size-6'
                        />
                    </div>
                )
            }
        </div>
    );
};
