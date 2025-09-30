import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";

const useLogin = () => {
	const showToast = useShowToast();
	const loginUser = useAuthStore((state) => state.login);

	const login = async (inputs) => {
		if (!inputs.email || !inputs.password) {
			return showToast("Error", "Please fill all the fields", "error");
		}
		try {
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(inputs),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message);

			localStorage.setItem('user-info', JSON.stringify(data.user));
			localStorage.setItem('token', data.token);
			loginUser(data.user, data.token);
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	return { login };
};

export default useLogin;
