import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from './useAxios'
import { toast } from 'react-toastify';

export default function useToggleReaction() {
    const axiosInstance = useAxios();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["toggleReaction"],
        mutationFn: async ({ postId, reactionType }) => {
            const { data } = await axiosInstance.post(`/api/v1/reactions/${postId}`, {
                type: reactionType
            })
            return data;
        },
        onSuccess: (_, variables) => {
            const { postId } = variables;
            // invalid and refetch the post feed to update reactions
            queryClient.refetchQueries({ queryKey: ["postsFeed"] });
            queryClient.refetchQueries({ queryKey: ["post", postId] });

        },
        onError: (err) => {
            toast.error(err.message);
            console.log("Error toggling reaction: ", err)
        }
    })
}
