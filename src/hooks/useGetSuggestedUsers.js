import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";

const useGetSuggestedUsers = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [suggestedUsers, setSuggestedUsers] = useState([]);
	const authUser = useAuthStore((state) => state.user);
	const showToast = useShowToast();

	useEffect(() => {
		const getSuggestedUsers = async () => {
			setIsLoading(true);
			const token = useAuthStore.getState().token;
			try {
				const res = await fetch('/api/users/suggested', {
					headers: { Authorization: `Bearer ${token}` },
					credentials: 'include',
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.message);

				setSuggestedUsers(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setIsLoading(false);
			}
		};

		if (authUser) getSuggestedUsers();
	}, [authUser, showToast]);

	return { isLoading, suggestedUsers };
};

export default useGetSuggestedUsers;
