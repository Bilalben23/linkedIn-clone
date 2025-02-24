import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth'
import useAxios from './useAxios';
import toast from 'react-hot-toast';

export default function useLogout() {
    const { logout } = useAuth();
    const axiosInstance = useAxios();
    const navigate = useNavigate();

    const signOut = async () => {
        try {
            const { data } = await axiosInstance.get("/api/v1/auth/logout");
            if (data.success) {
                logout();
                toast.success("Logout successfully")
                navigate("/signin", { replace: true });
            }
        } catch (err) {
            console.error(err);
        }
    }

    return signOut;
}
