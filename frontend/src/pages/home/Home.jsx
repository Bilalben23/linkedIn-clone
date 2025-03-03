import { useEffect, useRef, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import usePostsFeed from '../../hooks/usePostsFeed';
import Sidebar from './Sidebar';
import PostCreation from './PostCreation';
import SortDropdown from './SortDropdown';
import FeedPosts from './post/FeedPosts';
import SuggestedConnections from './SuggestedConnections/SuggestedConnections';

export default function Home() {
    const [sortOption, setSortOption] = useState("top");
    const { authState } = useAuth();
    const lastPostRef = useRef(null);
    const handleSortChange = (option) => setSortOption(option);

    const {
        data: postsFeed,
        fetchNextPage,
        isLoading,
        isError,
        error,
        isFetchingNextPage,
        hasNextPage
    } = usePostsFeed();


    useEffect(() => {
        if (!hasNextPage) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isFetchingNextPage) {
                    fetchNextPage();
                }
            }, {
            threshold: 0.5
        })

        if (lastPostRef.current) {
            observer.observe(lastPostRef.current);
        }

        return () => {
            if (lastPostRef.current) observer.unobserve(lastPostRef.current);
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);


    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    return (
        <section className='grid grid-cols-1 items-start md:grid-cols-4 mt-3 gap-x-4'>
            <Sidebar user={authState.user} />

            <section className='col-span-1 md:col-span-2 order-first md:order-none'>
                <PostCreation user={authState.user} />

                <SortDropdown
                    handleSortChange={handleSortChange}
                    sortOption={sortOption}
                />

                <FeedPosts
                    postsFeed={postsFeed}
                    isLoading={isLoading}
                    isError={isError}
                    error={error}
                    lastPostRef={lastPostRef}
                />

                {/* loading indicator */}
                {
                    hasNextPage && isFetchingNextPage && (
                        <div className='flex items-center justify-center mt-1.5'>
                            <img
                                src="/assets/loading-spinner.gif"
                                alt="loading-spinner"
                                className='size-9'
                            />
                        </div>
                    )
                }
            </section>

            <SuggestedConnections />
        </section>
    )
}
