import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from './useAxios'


// fetch comments (infinite scrolling)
export const useFetchComments = (postId) => {
    const axiosInstance = useAxios();

    return useInfiniteQuery({
        queryKey: ["comments", postId],
        queryFn: async ({ pageParam }) => {
            const { data } = await axiosInstance.get(`/api/v1/comments/${postId}?page=${pageParam}`);
            return data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.pagination.hasNextPage ? lastPage.pagination.nextPage : undefined,
        enabled: !!postId,
        staleTime: 1000 * 60 * 5
    })
}


// Add Comment 
export const useAddComment = (postId) => {
    const axiosInstance = useAxios();
    const queryClient = useQueryClient();

    return useMutation({
        mutateKey: ["addComment"],
        mutationFn: async (newComment) => {
            const { data } = await axiosInstance.post(`/api/v1/comments/${postId}`, {
                content: newComment
            })
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", postId] });

            // ✅ Update posts feed cache (increment commentsCount)
            queryClient.setQueryData(['postsFeed'], oldData => {
                if (!oldData) return oldData;

                return {
                    ...oldData,
                    pages: oldData.pages.map(page => ({
                        ...page,
                        data: page.data.map(post =>
                            post._id === postId
                                ? { ...post, commentsCount: post.commentsCount + 1 }
                                : post
                        )
                    }))
                };
            });
        }
    })
}


// Delete Comment
export const useDeleteComment = (postId) => {
    const axiosInstance = useAxios();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["deleteComment"],
        mutationFn: async (commentId) => {
            const { data } = await axiosInstance.delete(`/api/v1/comments/${commentId}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", postId] });

            // ✅ Update posts feed cache (decrement commentsCount)
            queryClient.setQueryData(['postsFeed'], oldData => {
                if (!oldData) return oldData;

                return {
                    ...oldData,
                    pages: oldData.pages.map(page => ({
                        ...page,
                        data: page.data.map(post =>
                            post._id === postId
                                ? { ...post, commentsCount: post.commentsCount - 1 }
                                : post
                        )
                    }))
                };
            });
        }
    })
}