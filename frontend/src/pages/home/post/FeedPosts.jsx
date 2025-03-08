import PostItem from './PostItem';
import PostSkeleton from '../../../components/skeletons/PostSkeleton';

export default function FeedPosts({ postsFeed, isLoading, isError, error, lastPostRef }) {

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
    );
}