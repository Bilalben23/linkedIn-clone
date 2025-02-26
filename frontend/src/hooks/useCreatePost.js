import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from './useAxios';
import { toast } from "react-hot-toast";


export default function useCreatePost() {
    const queryClient = useQueryClient();
    const axiosInstance = useAxios();

    const mutation = useMutation({
        mutationKey: ["createPost"],
        mutationFn: async (postData) => {
            const { data } = await axiosInstance.post("/api/v1/posts", postData);
            return data;
        },
        onSuccess: () => {
            // queryClient.invalidateQueries([""]);
            toast.success("Post created successfully")
        },
        onError: (err) => {
            toast.error("Failed to created")

            console.error("Error creating post:", err.response?.data?.message || err.message);
        }
    })

    return mutation;
}
