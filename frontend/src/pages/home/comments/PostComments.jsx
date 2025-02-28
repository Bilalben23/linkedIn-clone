import CommentInput from './commentInput';
import useComments from "../../../hooks/useComments";
import { Fragment } from 'react';
import CommentItem from './CommentItem';
import { TbArrowsDiagonal2 } from "react-icons/tb";
import { ClipLoader } from "react-spinners";


export default function PostComments({ postId }) {
    const { data: comments, fetchNextPage, isFetchingNextPage, hasNextPage, } = useComments(postId);

    return (
        <section className='px-4 mt-5'>
            <CommentInput />
            <div className='mt-6 flex flex-col gap-y-4'>
                {
                    comments?.pages?.map((group, i) => (
                        <Fragment key={i}>
                            {
                                group.data.map((comment) => {
                                    return <CommentItem
                                        key={comment._id}
                                        postId={postId}
                                        comment={comment}
                                    />
                                })
                            }
                        </Fragment>
                    ))
                }

                {/* Load more button */}
                {
                    hasNextPage && (
                        isFetchingNextPage
                            ? <div className='flex items-center justify-center'>
                                <ClipLoader size={30} color='#6a7282' />
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
        </section>
    )
}
