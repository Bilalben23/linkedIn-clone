import { useQuery } from '@tanstack/react-query';
import useAxios from './useAxios';

export default function usePendingRequestsCount() {
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

