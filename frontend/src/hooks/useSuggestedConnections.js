import { useQuery } from '@tanstack/react-query';
import useAxios from './useAxios'

export default function useSuggestedConnections() {
    const axiosInstance = useAxios();

    return useQuery({
        queryKey: ["suggestedConnections"],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/api/v1/users/suggestions");
            return data;
        }
    })
}
