import CommentInput from "./CommentInput";
import { useFetchComments } from "../../../hooks/useComments";
import { Fragment } from 'react';
import CommentItem from './CommentItem';
import { TbArrowsDiagonal2 } from "react-icons/tb";

export default function PostComments({ postId, postAuthorId }) {
    const {
        data: comments,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
        isLoading,
        isError,
        error
    } = useFetchComments(postId);

    return (
        <section className='px-4 mt-5'>
            <CommentInput postId={postId} />
            {
                !isError
                    ? !isLoading && <div className='mt-6 flex flex-col gap-y-4'>
                        {
                            comments?.pages?.map((group, i) => (
                                <Fragment key={i}>
                                    {
                                        group.data.map((comment) => {
                                            return <CommentItem
                                                key={comment._id}
                                                postId={postId}
                                                postAuthorId={postAuthorId}
                                                comment={comment}
                                            />
                                        })
                                    }
                                </Fragment>
                            ))
                        }
                        {
                            hasNextPage && (
                                isFetchingNextPage
                                    ? <div className='flex items-center justify-center'>
                                        <img
                                            src="/assets/loading-spinner.gif"
                                            alt="loading-spinner"
                                            className='size-6'
                                        />
                                    </div>
                                    : <div className='flex items-center gap-x-1'>
                                        <button
                                            type='button'
                                            className='btn btn-circle btn-sm border-0 bg-[#EAE6DF] shadow-xs'
                                            onClick={fetchNextPage}
                                        >
                                            <TbArrowsDiagonal2 size={18} strokeWidth={2.5} />
                                        </button>
                                        <button
                                            type='button'
                                            className='btn btn-ghost font-bold border-0 btn-xs hover:bg-gray-200/50'
                                            onClick={fetchNextPage}
                                        >
                                            Load more comments
                                        </button>
                                    </div>
                            )
                        }
                    </div>
                    : <div className='mt-6 text-sm text-red-500 text-center'>
                        <p>⚠️ Failed to load comments. Please try again.</p>
                        <p>{error?.message}</p>
                    </div>
            }

        </section>
    )
}
