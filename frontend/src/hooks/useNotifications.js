import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import useAxios from "./useAxios";


// Fetch notifications with infinite scrolling
export function useFetchNotifications() {
    const axiosInstance = useAxios();

    return useInfiniteQuery({
        queryKey: ['notifications'],
        queryFn: async ({ pageParam }) => {
            const { data } = await axiosInstance.get(`/api/v1/notifications?page=${pageParam}`);
            return data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.pagination.hasNextPage ? lastPage.pagination.nextPage : undefined,
        staleTime: 5 * 60 * 100
    })
}


// Mark notification as read
export function useMarksAsRead() {
    const axiosInstance = useAxios();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFnKey: ["markAsRead"],
        mutationFn: async (notificationId) => {
            const { data } = await axiosInstance.patch(`/api/v1/notifications/${notificationId}/read`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
    })
}