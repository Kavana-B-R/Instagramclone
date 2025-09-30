import { create } from "zustand";

const useAuthStore = create((set) => ({
	user: JSON.parse(localStorage.getItem("user-info")),
	token: localStorage.getItem("token"),
	login: (user, token) => {
		localStorage.setItem("user-info", JSON.stringify(user));
		localStorage.setItem("token", token);
		set({ user, token });
	},
	logout: () => {
		localStorage.removeItem("user-info");
		localStorage.removeItem("token");
		set({ user: null, token: null });
	},
	setUser: (user) => {
		localStorage.setItem("user-info", JSON.stringify(user));
		set({ user });
	},
}));

export default useAuthStore;
