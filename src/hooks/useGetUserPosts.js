import { useEffect, useState } from "react";
import usePostStore from "../store/postStore";
import useShowToast from "./useShowToast";
import useUserProfileStore from "../store/userProfileStore";

const useGetUserPosts = () => {
	const [isLoading, setIsLoading] = useState(true);
	const { posts, setPosts } = usePostStore();
	const showToast = useShowToast();
	const userProfile = useUserProfileStore((state) => state.userProfile);

	useEffect(() => {
		const getPosts = async () => {
			if (!userProfile) return;
			setIsLoading(true);
			setPosts([]);

			try {
				const res = await fetch(`/api/posts/user/${userProfile.username}`);
				const data = await res.json();
				if (!res.ok) throw new Error(data.message);

				setPosts(data);
			} catch (error) {
				showToast("Error", error.message, "error");
				setPosts([]);
			} finally {
				setIsLoading(false);
			}
		};

		getPosts();
	}, [setPosts, userProfile, showToast]);

	return { isLoading, posts };
};

export default useGetUserPosts;
