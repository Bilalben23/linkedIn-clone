import PostItem from './PostItem';
import PostSkeleton from '../../../components/skeletons/PostSkeleton';

export default function FeedPosts({ postsFeed, isLoading, isError, error, lastPostRef }) {

    if (isError) {
        return (
            <div className="p-5 border border-red-300 rounded-lg text-red-600 bg-red-50 text-sm text-center">
                <p className="font-medium">⚠️ error occurred: {error?.message}</p>
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