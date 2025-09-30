import { Box, Flex, Spinner } from "@chakra-ui/react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuthStore from "../../store/authStore";
import Navbar from "../../components/Navbar/Navbar";

// instead of adding the Sidebar component to every page, we can add it only once to the PageLayout component and wrap the children with it. This way, we can have a sidebar on every page except the AuthPage.

const PageLayout = ({ children }) => {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const authUser = useAuthStore((state) => state.user);

	useEffect(() => {
		setUser(authUser);
		setLoading(false);
	}, [authUser]);

	const canRenderSidebar = pathname !== "/auth" && user;
	const canRenderNavbar = !user && !loading && pathname !== "/auth";

	const checkingUserIsAuth = !user && loading;
	if (checkingUserIsAuth) return <PageLayoutSpinner />;

	const handleCreateClick = () => {
		navigate("/create");
	};

	const handleSearchClick = () => {
		navigate("/search");
	};

	return (
		<Flex flexDir={canRenderNavbar ? "column" : "row"}>
			{/* sidebar on the left */}
			{canRenderSidebar ? (
				<Box w={{ base: "70px", md: "240px" }}>
					<Sidebar onCreateClick={handleCreateClick} onSearchClick={handleSearchClick} />
				</Box>
			) : null}
			{/* Navbar */}
			{canRenderNavbar ? <Navbar /> : null}
			{/* the page content on the right */}
			<Box flex={1} w={{ base: "calc(100% - 70px)", md: "calc(100% - 240px)" }} mx={"auto"}>
				{children}
			</Box>
		</Flex>
	);
};

export default PageLayout;

const PageLayoutSpinner = () => {
	return (
		<Flex flexDir='column' h='100vh' alignItems='center' justifyContent='center'>
			<Spinner size='xl' />
		</Flex>
	);
};
