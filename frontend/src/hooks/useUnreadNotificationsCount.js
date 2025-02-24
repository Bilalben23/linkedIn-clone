import { useQuery } from "@tanstack/react-query";
import useAxios from "./useAxios";


export default function useUnreadNotificationsCount() {
    const axiosInstance = useAxios();

    const { data: unreadCount = 0 } = useQuery({
        queryKey: ["unreadNotificationsCount"],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/api/v1/notifications/unread-count");
            return data.unreadCount;
        },
        staleTime: 10000,
        refetchInterval: 30000
    })

    return { unreadCount }
}
