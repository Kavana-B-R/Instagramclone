import { useEffect, useState } from "react";
import useShowToast from "./useShowToast";
import useUserProfileStore from "../store/userProfileStore";

const useGetUserProfileByUsername = (username) => {
	const [isLoading, setIsLoading] = useState(true);
	const showToast = useShowToast();
	const { userProfile, setUserProfile } = useUserProfileStore();

	useEffect(() => {
		const getUserProfile = async () => {
			setIsLoading(true);
			try {
				const res = await fetch(`/api/users/profile/${username}`);
				const data = await res.json();
				if (!res.ok) throw new Error(data.message);

				setUserProfile(data);
			} catch (error) {
				showToast("Error", error.message, "error");
				setUserProfile(null);
			} finally {
				setIsLoading(false);
			}
		};

		getUserProfile();
	}, [setUserProfile, username, showToast]);

	return { isLoading, userProfile };
};

export default useGetUserProfileByUsername;
