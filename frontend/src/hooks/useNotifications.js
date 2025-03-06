import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import useAxios from "./useAxios";


// Fetch notifications with infinite scrolling
export function useFetchNotifications(filter) {
    const axiosInstance = useAxios();

    return useInfiniteQuery({
        queryKey: ['notifications', filter],
        queryFn: async ({ pageParam }) => {
            const { data } = await axiosInstance.get(`/api/v1/notifications`, {
                params: {
                    page: pageParam,
                    filter: "all"
                }
            });
            return data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.pagination.hasNextPage ? lastPage.pagination.nextPage : undefined,
        staleTime: 1000 * 10
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