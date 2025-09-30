import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import useUserProfileStore from "../store/userProfileStore";
import useShowToast from "./useShowToast";

const useFollowUser = (userId) => {
	const [isUpdating, setIsUpdating] = useState(false);
	const [isFollowing, setIsFollowing] = useState(false);
	const authUser = useAuthStore((state) => state.user);
	const setAuthUser = useAuthStore((state) => state.setUser);
	const { userProfile, setUserProfile } = useUserProfileStore();
	const showToast = useShowToast();

	const handleFollowUser = async () => {
		if (!userId) return;
		setIsUpdating(true);
		try {
			const token = useAuthStore.getState().token;
			const res = await fetch(`/api/users/follow/${userId}`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message);

			if (isFollowing) {
				// unfollow
				setAuthUser({
					...authUser,
					following: authUser.following.filter((id) => id !== userId),
				});
				if (userProfile)
					setUserProfile({
						...userProfile,
						followers: userProfile.followers.filter((id) => id !== authUser._id),
					});
				setIsFollowing(false);
			} else {
				// follow
				setAuthUser({
					...authUser,
					following: [...authUser.following, userId],
				});

				if (userProfile)
					setUserProfile({
						...userProfile,
						followers: [...userProfile.followers, authUser._id],
					});
				setIsFollowing(true);
			}
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setIsUpdating(false);
		}
	};

	useEffect(() => {
		if (authUser) {
			const isFollowing = authUser.following.includes(userId);
			setIsFollowing(isFollowing);
		}
	}, [authUser, userId]);

	return { isUpdating, isFollowing, handleFollowUser };
};

export default useFollowUser;
