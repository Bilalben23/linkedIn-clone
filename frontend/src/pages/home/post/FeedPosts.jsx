import { useState, Fragment } from 'react';
import { formatDistanceToNow } from "date-fns";
import PostHeader from './PostHeader';
import PostContent from './PostContent';
import PostFooter from './PostFooter';
import { FaEllipsisH } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';


export default function FeedPosts({ postsFeed }) {
    return (
        <section className='flex flex-col gap-y-3'>
            {
                postsFeed?.pages?.map((group, i) => {
                    return <Fragment key={i}>
                        {
                            group.data.map(post => {
                                return <div key={post._id} className='bg-base-100 rounded-lg shadow-2xs border border-gray-300 py-2'>
                                    {/* Post Header */}
                                    <PostHeader post={post} />

                                    {/* Post content (body) */}
                                    <PostContent post={post} />

                                    {/* post footer */}
                                    <PostFooter post={post} />
                                </div>
                            })
                        }
                    </Fragment>
                })
            }
        </section>
    );
}