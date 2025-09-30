import { useState } from "react";
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";

const useLogout = () => {
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const showToast = useShowToast();
	const logoutUser = useAuthStore((state) => state.logout);

	const handleLogout = async () => {
		setIsLoggingOut(true);
		try {
			await fetch('/api/auth/logout', {
				method: 'POST',
				credentials: 'include',
			});
			logoutUser();
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setIsLoggingOut(false);
		}
	};

	return { handleLogout, isLoggingOut };
};

export default useLogout;
