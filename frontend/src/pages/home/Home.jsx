import { useEffect, useRef, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { usePostsFeed } from '../../hooks/usePosts';
import Sidebar from './Sidebar';
import PostCreation from './postCreation/PostCreation';
import SortDropdown from './SortDropdown';
import FeedPosts from './post/FeedPosts';
import SuggestedConnections from './SuggestedConnections/SuggestedConnections';
import { FaArrowUp } from 'react-icons/fa';
import { motion } from "framer-motion";


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
        isStale,
        refetch,
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


    const refetchPostsFeed = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        refetch();
    }


    return (
        <section className='grid grid-cols-1 items-start md:grid-cols-4 mt-3 gap-x-4'>
            <Sidebar user={authState.user} />

            <section className='col-span-1 md:col-span-2 order-first md:order-none'>
                <PostCreation user={authState.user} />

                <SortDropdown
                    handleSortChange={handleSortChange}
                    sortOption={sortOption}
                />
                {
                    isStale && (
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
                                onClick={refetchPostsFeed}
                                disabled={isLoading}
                                aria-label="Fetch new posts"
                            >
                                <FaArrowUp /> New Posts
                            </button>
                        </motion.div>
                    )
                }

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
                                alt="Loading spinner"
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
