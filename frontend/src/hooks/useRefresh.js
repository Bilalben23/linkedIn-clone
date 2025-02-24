import { axiosInstance } from "../utils/axiosInstance";
import useAuth from "./useAuth";

export default function useRefresh() {
    const { login } = useAuth();

    const refresh = async () => {
        try {
            const { data } = await axiosInstance.get("/api/v1/auth/refresh-token");
            login(data.user, data.accessToken);
            return data.accessToken;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    return refresh;
}
