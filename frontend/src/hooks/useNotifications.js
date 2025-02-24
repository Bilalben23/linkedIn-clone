import { useInfiniteQuery } from "@tanstack/react-query";
import useAxios from "./useAxios";


export default function useNotifications() {
    const axiosInstance = useAxios();

    return useInfiniteQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/notifications?page=${pageParam}`);
            return data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.pagination.hasNextPage ? lastPage.pagination.nextPage : undefined
    })
}
