import { useEffect, useState } from "react";
import usePostStore from "../store/postStore";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";

const useGetFeedPosts = () => {
	const [isLoading, setIsLoading] = useState(true);
	const { posts, setPosts } = usePostStore();
	const authUser = useAuthStore((state) => state.user);
	const token = useAuthStore((state) => state.token);
	const showToast = useShowToast();

	useEffect(() => {
		const getFeedPosts = async () => {
			setIsLoading(true);
			if (!authUser.following || authUser.following.length === 0) {
				setIsLoading(false);
				setPosts([]);
				return;
			}
			try {
				const res = await fetch('/api/posts/feed', {
					headers: { Authorization: `Bearer ${token}` },
					credentials: 'include',
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.message);

				setPosts(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setIsLoading(false);
			}
		};

		if (authUser && token) getFeedPosts();
	}, [authUser, token, showToast, setPosts]);

	return { isLoading, posts };
};

export default useGetFeedPosts;
