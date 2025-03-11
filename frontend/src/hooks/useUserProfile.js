import useAxios from "./useAxios"
import { useQuery } from "@tanstack/react-query";

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