import { useState } from 'react';
import PostHeader from './PostHeader';
import PostContent from './PostContent';
import PostFooter from './PostFooter';
import PostComments from '../comments/PostComments';

export default function PostItem({ post, lastPostRef }) {
    const [showComments, setShowComments] = useState(false);

    return (
        <div className='bg-base-100 rounded-box shadow-2xs border border-gray-300 py-2' ref={lastPostRef} >
            {/* Post Header */}
            <PostHeader post={post} />

            {/* Post content (body) */}
            <PostContent post={post} />

            {/* Post footer */}
            <PostFooter
                post={post}
                setShowComments={setShowComments}
            />

            {/* Post comments section */}
            {showComments && <PostComments
                postId={post._id}
                postAuthorId={post.author._id}
            />}
        </div>
    );
};