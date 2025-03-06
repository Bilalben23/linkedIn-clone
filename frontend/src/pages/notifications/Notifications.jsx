import { useEffect, useRef } from 'react';
import useAuth from '../../hooks/useAuth';
import { useFetchNotifications } from '../../hooks/useNotifications';
import { useSearchParams } from 'react-router-dom';
import NotificationSidebar from './NotificationSidebar';
import NotificationContent from './NotificationContent';
import NotificationFooter from './NotificationFooter';
import NotificationFilters from './NotificationFilters';

export default function Notifications() {
    const { authState: { user } } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const filter = searchParams.get("filter") || "all";
    const lastNotificationRef = useRef(null);

    const {
        data: notifications,
        isLoading,
        isStale,
        isError,
        error,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage

    } = useFetchNotifications(filter);

    const updateSearchParam = (filter) => setSearchParams({ filter });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);



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
        <section className='grid grid-cols-1 items-start md:grid-cols-4 mt-3 gap-x-4'>
            <NotificationSidebar />

            <section className='col-span-1 md:col-span-2 order-first md:order-none'>
                <NotificationFilters
                    filter={filter}
                    updateSearchParam={updateSearchParam}
                    isLoading={isLoading}
                />

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
