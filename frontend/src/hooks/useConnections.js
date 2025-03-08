import { useMutation, useQueryClient, useQuery, keepPreviousData } from '@tanstack/react-query';
import useAxios from './useAxios';
import { toast } from 'react-toastify';

export function usePendingRequestsCount() {
    const axiosInstance = useAxios();

    const { data: pendingRequestsCount = 0 } = useQuery({
        queryKey: ["pendingRequestsCount"],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/api/v1/connections/pending/count");
            return data.pendingRequestsCount;
        },
        staleTime: 10000,
        refetchInterval: 30000
    })

    return { pendingRequestsCount };
}


export const usePendingRequests = (page = 1) => {
    const axiosInstance = useAxios();

    return useQuery({
        queryKey: ["pendingRequests", page],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/api/v1/connections/pending", {
                params: {
                    page
                }
            });
            return data;
        },
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5
    });
}


export function useSendConnectionRequest(sendFrom = "suggestedConnections") {
    const axiosInstance = useAxios();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["sendConnectionRequest"],
        mutationFn: async (userId) => {
            const { data } = await axiosInstance.post(`/api/v1/connections/${userId}`);
            return data;
        },
        onSuccess: (data) => {
            if (sendFrom === "suggestedConnections") {
                queryClient.invalidateQueries({ queryKey: ["suggestedConnections"], refetchType: "none" });
            } else if (sendFrom === "postsFeed") {
                queryClient.invalidateQueries({ queryKey: ["postsFeed"] });
                queryClient.invalidateQueries({ queryKey: ["suggestedConnections"] });
            }

            if (data.isConnected) {
                toast.success(data.message, {
                    position: "bottom-left"
                })
            }
        },
        onError: (error) => {
            console.error(error);
            toast.error(error.message || "Something went wrong", {
                position: "bottom-left"
            });
        }
    })
}


export function useSuggestedConnections() {
    const axiosInstance = useAxios();

    return useQuery({
        queryKey: ["suggestedConnections"],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/api/v1/users/suggestions");
            return data.data;
        }
    })
}


