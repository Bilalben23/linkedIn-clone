import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
                    filter
                }
            });
            return data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.pagination.hasNextPage ? lastPage.pagination.nextPage : undefined,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false
    })
}


// Mark notification as read
export function useMarksAsRead(filter) {
    const axiosInstance = useAxios();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFnKey: ["markAsRead"],
        mutationFn: async (notificationId) => {
            const { data } = await axiosInstance.patch(`/api/v1/notifications/${notificationId}/read`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications", filter] });
            queryClient.invalidateQueries({ queryKey: ["unreadNotificationsCount"] });
        }
    })
}


// count unread notifications
export function useUnreadNotificationsCount() {
    const axiosInstance = useAxios();

    return useQuery({
        queryKey: ["unreadNotificationsCount"],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/api/v1/notifications/unread-count");
            return data.unreadCount;
        },
        staleTime: 10000,
        refetchInterval: 30000
    })
}


// delete notification
export function useDeleteNotification() {
    const axiosInstance = useAxios();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFnKey: ["deleteNotification"],
        mutationFn: async (notificationId) => {
            const { data } = await axiosInstance.delete(`/api/v1/notifications/${notificationId}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            queryClient.invalidateQueries({ queryKey: ["unreadNotificationsCount"] });
        }
    })
}