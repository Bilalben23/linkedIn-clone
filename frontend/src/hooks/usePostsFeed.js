import { useInfiniteQuery } from '@tanstack/react-query'
import useAxios from './useAxios'

export default function usePostsFeed() {
    const axiosInstance = useAxios();

    return useInfiniteQuery({
        queryKey: ["postsFeed"],
        queryFn: async ({ pageParam }) => {
            const { data } = await axiosInstance.get(`/api/v1/posts?page=${pageParam}`);
            return data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.pagination.hasNextPage ? lastPage.pagination.nextPage : undefined,
        staleTime: 1000 * 60 * 5
    })
}
