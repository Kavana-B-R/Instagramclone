import { useEffect, useState } from "react";
import useShowToast from "./useShowToast";

const useGetUserProfileById = (userId) => {
	const [isLoading, setIsLoading] = useState(true);
	const [userProfile, setUserProfile] = useState(null);

	const showToast = useShowToast();

	useEffect(() => {
		const getUserProfile = async () => {
			setIsLoading(true);
			setUserProfile(null);
			try {
				const res = await fetch(`/api/users/profile/id/${userId}`);
				const data = await res.json();
				if (!res.ok) throw new Error(data.message);
				setUserProfile(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setIsLoading(false);
			}
		};
		if (userId) getUserProfile();
	}, [showToast, userId]);

	return { isLoading, userProfile, setUserProfile };
};

export default useGetUserProfileById;
