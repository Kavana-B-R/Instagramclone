import { useState } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";

const useLikePost = (post) => {
	const [isUpdating, setIsUpdating] = useState(false);
	const authUser = useAuthStore((state) => state.user);
	const [likes, setLikes] = useState(post.likes.length);
	const [isLiked, setIsLiked] = useState(post.likes.includes(authUser?._id));
	const showToast = useShowToast();

	const handleLikePost = async () => {
		if (isUpdating) return;
		if (!authUser) return showToast("Error", "You must be logged in to like a post", "error");
		setIsUpdating(true);

		try {
			const res = await fetch(`/api/posts/${post._id}/like`, {
				method: 'POST',
				credentials: 'include',
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message);

			setIsLiked(!isLiked);
			isLiked ? setLikes(likes - 1) : setLikes(likes + 1);
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setIsUpdating(false);
		}
	};

	return { isLiked, likes, handleLikePost, isUpdating };
};

export default useLikePost;
