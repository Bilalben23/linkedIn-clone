import React, { useEffect } from 'react';
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
    const { data: notifications, isLoading, isStale, isError, error } = useFetchNotifications();

    const updateSearchParam = (filter) => setSearchParams({ filter });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <section className='grid grid-cols-1 items-start md:grid-cols-4 mt-3 gap-x-4'>
            <NotificationSidebar />

            <section className='col-span-1 md:col-span-2 order-first md:order-none'>
                <NotificationFilters
                    filter={filter}
                    updateSearchParam={updateSearchParam}
                />

                <NotificationContent />

            </section>

            <NotificationFooter />
        </section>
    );
}
