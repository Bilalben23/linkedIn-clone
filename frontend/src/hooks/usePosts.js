import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useAxios from './useAxios'

export const usePostsFeed = () => {
    const axiosInstance = useAxios();

    return useInfiniteQuery({
        queryKey: ["postsFeed"],
        queryFn: async ({ pageParam }) => {
            const { data } = await axiosInstance.get(`/api/v1/posts?page=${pageParam}`);
            return data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.pagination.hasNextPage ? lastPage.pagination.nextPage : undefined,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false
    })
}


export const usePostById = (postId) => {
    const axiosInstance = useAxios();
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ["post", postId],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/posts/${postId}`);
            return data;
        },
        enabled: !!postId,
        staleTime: 5 * 60 * 1000,
        initialData: () => {
            const postsFeedData = queryClient.getQueryData(["postsFeed"]);
            if (postsFeedData) {
                // If postsFeed is paginated, flatten all pages and search for the post
                const allPosts = postsFeedData.pages.flatMap(page => page.data);
                return allPosts.find(post => post._id === postId);
            }
            return undefined;
        }
    })
}


export const useCreatePost = () => {
    const axiosInstance = useAxios();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationKey: ["createPost"],
        mutationFn: async (newPostData) => {
            const { data } = await axiosInstance.post("/api/v1/posts", newPostData);
            return data;
        },
        onSuccess: () => {
            queryClient.refetchQueries(["postsFeed"]);
        }
    })

    return mutation;
}


export const useUpdatePost = () => {
    const axiosInstance = useAxios();

    return useMutation({
        mutationKey: ["updatePost"],
        mutationFn: async ({ postId, updatedContent }) => {
            const { data } = await axiosInstance.patch(`/api/v1/posts/${postId}`, {
                content: updatedContent
            })
            return data;
        }
    })
}

export const useDeletePost = (sendFrom = "postsFeed") => {
    const axiosInstance = useAxios();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["deletePost"],
        mutationFn: async (postId) => {
            const { data } = await axiosInstance.delete(`/api/v1/posts/${postId}`);
            return data;
        },
        onSuccess: () => {
            if (sendFrom === "postsFeed") {
                queryClient.refetchQueries({ queryKey: ["postsFeed"] });

            }
        }
    })
}
