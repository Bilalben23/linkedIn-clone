import { Fragment } from 'react';
import Post from './Post'; // Import the Post component

export default function FeedPosts({ postsFeed }) {
    return (
        <section className='flex flex-col gap-y-3'>
            {
                postsFeed?.pages?.map((group, i) => (
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