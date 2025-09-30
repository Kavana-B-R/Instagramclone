import { useState } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import useUserProfileStore from "../store/userProfileStore";

const useEditProfile = () => {
	const [isUpdating, setIsUpdating] = useState(false);

	const authUser = useAuthStore((state) => state.user);
	const setAuthUser = useAuthStore((state) => state.setUser);
	const setUserProfile = useUserProfileStore((state) => state.setUserProfile);

	const showToast = useShowToast();

	const editProfile = async (inputs, selectedFile) => {
		if (isUpdating || !authUser) return;
		setIsUpdating(true);

		try {
			let formData = new FormData();
			formData.append('username', inputs.username);
			formData.append('fullName', inputs.fullName);
			formData.append('bio', inputs.bio);
			if (selectedFile) {
				formData.append('profilePic', selectedFile);
			}

			const res = await fetch('/api/users/update', {
				method: 'PUT',
				body: formData,
				credentials: 'include',
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message);

			localStorage.setItem("user-info", JSON.stringify(data));
			setAuthUser(data);
			setUserProfile(data);
			showToast("Success", "Profile updated successfully", "success");
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setIsUpdating(false);
		}
	};

	return { editProfile, isUpdating };
};

export default useEditProfile;
