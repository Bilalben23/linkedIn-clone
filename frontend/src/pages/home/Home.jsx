import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import usePostsFeed from '../../hooks/usePostsFeed';
import Sidebar from './Sidebar';
import PostCreation from './PostCreation';
import SortDropdown from './SortDropdown';
import FeedPosts from './post/FeedPosts';
import SuggestedConnections from './SuggestedConnections/SuggestedConnections';

export default function Home() {
    const [sortOption, setSortOption] = useState("top");
    const handleSortChange = (option) => setSortOption(option);

    const { authState } = useAuth();
    const {
        data: postsFeed,
        fetchNextPage,
        fetchPreviousPage,
        isLoading,
        isError,
        error,
        isFetchingNextPage,
        hasNextPage,
        hasPreviousPage
    } = usePostsFeed();


    return (
        <section className='grid grid-cols-1 items-start md:grid-cols-4 mt-3 gap-x-4'>
            <Sidebar user={authState.user} />

            <section className='col-span-1 md:col-span-2 order-first md:order-none'>
                <PostCreation user={authState.user} />

                <SortDropdown
                    handleSortChange={handleSortChange}
                    sortOption={sortOption} />

                <FeedPosts
                    postsFeed={postsFeed}
                    isLoading={isLoading}
                    isError={isError}
                    error={error}
                />
            </section>

            <SuggestedConnections />
        </section>
    )
}
