import { useEffect, useRef, useState } from 'react';
import PostItem from '../../components/postItem/postContent/PostItem'
import PostSkeleton from '../../components/skeletons/PostSkeleton';
import { usePostsFeed } from '../../hooks/usePosts';
import { FaArrowUp } from 'react-icons/fa';
import { motion } from "framer-motion";
import SortDropdown from "./SortDropdown";
import PostCreation from "./postCreation/PostCreation";
import useAuth from '../../hooks/useAuth';


export default function Home() {
    const { authState } = useAuth();
    const lastPostRef = useRef(null);
    const handleSortChange = (option) => setSortOption(option);
    const [sortOption, setSortOption] = useState("top");

    const {
        data: postsFeed,
        fetchNextPage,
        isLoading,
        isError,
        error,
        isPending,
        isStale,
        refetch,
        isFetchingNextPage,
        hasNextPage
    } = usePostsFeed();


    const refetchPostsFeed = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        refetch();
    }

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


    if (isError) {
        return (
            <div className="p-5 border border-red-400 rounded-lg bg-red-50 text-red-700 text-sm text-center shadow-sm">
                <p className="font-semibold flex items-center justify-center gap-2">
                    <span className="text-lg">⚠️</span> Something went wrong
                </p>
                <p className="mt-1 text-xs text-red-600">{error?.message || "We couldn't load the posts. Please try again."}</p>
            </div>
        );
    }


    return (
        <section className='col-span-1 md:col-span-2 order-first md:order-none'>
            <PostCreation user={authState.user} />

            <SortDropdown
                handleSortChange={handleSortChange}
                sortOption={sortOption}
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
                            onClick={refetchPostsFeed}
                            aria-label="Fetch new posts"
                        >
                            <FaArrowUp /> New Posts
                        </button>
                    </motion.div>
                )
            }
            <section className='flex flex-col gap-y-3'>
                {
                    isLoading
                        ? Array.from({ length: 20 }).map((_, index) => <PostSkeleton key={index} />)
                        : postsFeed?.pages?.map((group) => {
                            return group.data.map((post, index, array) => {
                                return <PostItem
                                    key={post._id}
                                    post={post}
                                    lastPostRef={index === array.length - 1 ? lastPostRef : null}
                                />
                            })
                        })
                }
            </section>

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
    );
}