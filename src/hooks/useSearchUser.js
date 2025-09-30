import { useState } from "react";
import useShowToast from "./useShowToast";

const useSearchUser = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [user, setUser] = useState(null);
	const showToast = useShowToast();

	const getUserProfile = async (username) => {
		setIsLoading(true);
		setUser(null);
		try {
			const res = await fetch(`/api/users/profile/${username}`);
			const data = await res.json();
			if (!res.ok) throw new Error(data.message);
			setUser(data.user);
		} catch (error) {
			showToast("Error", error.message, "error");
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	};

	return { isLoading, getUserProfile, user, setUser };
};

export default useSearchUser;
