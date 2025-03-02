import { Fragment } from 'react';
import Post from './Post'; // Import the Post component
import PostSkeleton from '../skeletons/PostSkeleton';

export default function FeedPosts({ postsFeed, isLoading, isError, error }) {

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
                    ? Array.from({ length: 5 }).map((_, index) => <PostSkeleton key={index} />)
                    : postsFeed?.pages?.map((group, i) => (
                        <Fragment key={i}>
                            {
                                group.data.map((post) => (
                                    <Post key={post._id} post={post} />
                                ))
                            }
                        </Fragment>
                    ))
            }
        </section>
    );
}