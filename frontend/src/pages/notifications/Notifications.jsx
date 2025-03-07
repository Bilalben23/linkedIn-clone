import { useEffect, useRef } from 'react';
import { useFetchNotifications, useMarkAllNotificationsAsRead } from '../../hooks/useNotifications';
import { useSearchParams } from 'react-router-dom';
import NotificationSidebar from './NotificationSidebar';
import NotificationContent from './NotificationContent';
import NotificationFooter from './NotificationFooter';
import NotificationFilters from './NotificationFilters';
import { FaArrowUp } from 'react-icons/fa';
import { motion } from "framer-motion"


export default function Notifications() {
    const [searchParams, setSearchParams] = useSearchParams();
    const filter = searchParams.get("filter") || "all";
    const lastNotificationRef = useRef(null);
    const { mutate: markAllNotificationsAsRead } = useMarkAllNotificationsAsRead()

    const {
        data: notifications,
        isLoading,
        isStale,
        isError,
        error,
        isPending,
        refetch,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage

    } = useFetchNotifications(filter);

    const updateSearchParam = (filter) => setSearchParams({ filter });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const refetchNotifications = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        refetch();
    }

    useEffect(() => {
        return () => {
            markAllNotificationsAsRead();
        }
    }, [])

    console.log(notifications);


    useEffect(() => {
        if (!hasNextPage) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isFetchingNextPage) {
                    fetchNextPage();
                }
            }, {
            threshold: 0.1
        })

        if (lastNotificationRef.current) {
            observer.observe(lastNotificationRef.current);
        }

        return () => {
            if (lastNotificationRef.current) observer.unobserve(lastNotificationRef.current);
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);


    return (
        <section className='grid grid-cols-1 items-start md:grid-cols-4 mt-3 gap-4'>
            <NotificationSidebar />

            <section className='col-span-1 md:col-span-2 order-first md:order-none'>
                <NotificationFilters
                    filter={filter}
                    updateSearchParam={updateSearchParam}
                    isLoading={isLoading}
                />

                {
                    (isStale && !isLoading && !isPending) && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="sticky z-1 top-15 flex -my-2.5 justify-center"
                        >
                            <button
                                type="button"
                                className="btn btn-primary shadow-gray-500 shadow-md rounded-full btn-xs"
                                onClick={refetchNotifications}
                                disabled={isPending}
                                aria-label="Fetch new notifications"
                            >
                                <FaArrowUp /> New Notifications
                            </button>
                        </motion.div>
                    )
                }

                <NotificationContent
                    notifications={notifications}
                    isLoading={isLoading}
                    isError={isError}
                    error={error}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    lastNotificationRef={lastNotificationRef}
                />

            </section>

            <NotificationFooter />
        </section>
    );
}
