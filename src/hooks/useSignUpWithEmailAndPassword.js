import { useState } from "react";
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";

const useSignUpWithEmailAndPassword = () => {
	const [loading, setLoading] = useState(false);
	const showToast = useShowToast();
	const loginUser = useAuthStore((state) => state.login);

	const signup = async (inputs) => {
		if (!inputs.email || !inputs.password || !inputs.username) {
			showToast("Error", "Please fill all the fields", "error");
			return;
		}
		setLoading(true);
		try {
			const res = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(inputs),
				credentials: 'include',
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message);

			// For now, no default follows, can add later
			localStorage.setItem('token', data.token);
			loginUser(data.user, data.token);
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setLoading(false);
		}
	};

	return { loading, signup };
};

export default useSignUpWithEmailAndPassword;
