import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from './useAxios'
import { toast } from 'react-toastify';

export default function useSendConnectionRequest(sendFrom = "suggestedConnections") {
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
