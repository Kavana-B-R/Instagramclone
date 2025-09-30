import { useState } from "react";
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";
import usePostStore from "../store/postStore";

const usePostComment = () => {
	const [isCommenting, setIsCommenting] = useState(false);
	const showToast = useShowToast();
	const authUser = useAuthStore((state) => state.user);
	const addComment = usePostStore((state) => state.addComment);

	const handlePostComment = async (postId, comment) => {
		if (isCommenting) return;
		if (!authUser) return showToast("Error", "You must be logged in to comment", "error");
		setIsCommenting(true);
		const token = useAuthStore.getState().token;
		try {
			const res = await fetch(`/api/posts/${postId}/comment`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
				body: JSON.stringify({ comment }),
				credentials: 'include',
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message);

			// Update local store
			const newComment = data.comments[data.comments.length - 1];
			addComment(postId, newComment);
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setIsCommenting(false);
		}
	};

	return { isCommenting, handlePostComment };
};

export default usePostComment;
