import useAxios from "./useAxios"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useFetchProfile = (username) => {
    const axiosInstance = useAxios();

    return useQuery({
        queryKey: ["profile", username],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/users/${username}`);
            return data;
        },
        enabled: !!username
    })
}


export const useUpdateProfile = () => {
    const axiosInstance = useAxios();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["updateProfile"],
        mutationFn: async (updatedData) => {
            const { data } = await axiosInstance.patch("/api/v1/users/profile", updatedData);
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["profile", data.data.username] })
        }
    })
}