import NotificationSkeleton from "../../components/skeletons/NotificationSkeleton";
import NotificationItem from "./NotificationItem";

export default function NotificationContent({ notifications, isLoading, isError, error, hasNextPage, isFetchingNextPage, lastNotificationRef }) {

    if (isError) {
        return (
            <div className="p-5 border border-red-400 rounded-lg bg-red-50 text-red-700 text-sm text-center shadow-sm mt-4">
                <p className="font-semibold flex items-center justify-center gap-2">
                    <span className="text-lg">⚠️</span> Oops! Something went wrong
                </p>
                <p className="mt-1 text-xs text-red-600">
                    We couldn't load your notifications. Please refresh the page or try again later.
                </p>
                {error?.message && (
                    <p className="text-xs text-red-600 mt-2">
                        Error: {error.message}
                    </p>
                )}
            </div>
        );
    }

    const noNotifications = !isLoading && notifications?.pages?.[0]?.data?.length === 0;

    if (noNotifications) {
        return (
            <div className="p-4 bg-base-100 rounded-box border border-gray-300 shadow-sm mt-3 text-center">
                <h4 className="text-sm font-medium text-gray-800">No notifications yet</h4>
                <p className="text-xs mt-0.5 text-gray-500">
                    You don't have any notifications at the moment.
                </p>
            </div>
        );
    }

    return (
        <div className='flex mt-3 overflow-x-hidden flex-col bg-white rounded-box shadow-xs border border-gray-300'>
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
