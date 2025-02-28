import { useInfiniteQuery } from '@tanstack/react-query';
import useAxios from './useAxios'

export default function useComments(postId) {
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
