import { useNavigate, useParams } from 'react-router-dom';
import { usePostById } from '../hooks/usePosts';
import PostSkeleton from '../components/skeletons/PostSkeleton';
import PostItem from '../components/postItem/postContent/PostItem';

export default function Post() {
    const { postId } = useParams();
    const { data: post, isLoading, isError, error } = usePostById(postId);
    const navigate = useNavigate();

    return (
        <section className='col-span-1 md:col-span-2 order-first md:order-none'>
            {!isError ? (
                isLoading ? (
                    <PostSkeleton />
                ) : (
                    <PostItem post={post.data} />
                )
            ) : (
                <div className='p-4 text-center'>
                    <p className='text-red-500 mb-4'>Failed to load post: {error?.message || "Something went wrong."}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className='btn btn-primary btn-sm'
                    >
                        Go Back
                    </button>
                </div>
            )}
        </section>
    );
}