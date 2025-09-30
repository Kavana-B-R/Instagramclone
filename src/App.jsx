import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import AuthPage from "./pages/AuthPage/AuthPage";
import PageLayout from "./Layouts/PageLayout/PageLayout";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import CreatePostPage from "./pages/CreatePostPage/CreatePostPage";
import SearchPage from "./pages/SearchPage/SearchPage";
import { useState, useEffect } from "react";
import useAuthStore from "./store/authStore";

function App() {
	const [authUser, setAuthUser] = useState(null);
	const user = useAuthStore((state) => state.user);

	useEffect(() => {
		setAuthUser(user);
	}, [user]);

	return (
		<PageLayout>
			<Routes>
				<Route path='/' element={authUser ? <HomePage /> : <Navigate to='/auth' />} />
				<Route path='/auth' element={!authUser ? <AuthPage /> : <Navigate to='/' />} />
				<Route path='/:username' element={<ProfilePage />} />
				<Route path='/create' element={<CreatePostPage />} />
				<Route path='/search' element={<SearchPage />} />
			</Routes>
		</PageLayout>
	);
}

export default App;
