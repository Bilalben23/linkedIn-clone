import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from './useAxios'
import { toast } from 'react-toastify';

export default function useToggleReaction() {
    const axiosInstance = useAxios();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ postId, reactionType }) => {
            const { data } = await axiosInstance.post(`/api/v1/reactions/${postId}`, {
                type: reactionType
            })
            return data;
        },
        onSuccess: () => {
            // invalid and refetch the post feed to update reactions
            queryClient.invalidateQueries({ queryKey: ["postsFeed"] });
        },
        onError: (err) => {
            toast.error(err.message);
            console.log("Error toggling reaction: ", err)
        }
    })
}
