import { Flex, Image, Text } from "@chakra-ui/react";
import useShowToast from "../../hooks/useShowToast";

const GoogleAuth = ({ prefix }) => {
	const showToast = useShowToast();

	const handleGoogleAuth = () => {
		showToast("Info", "Google authentication is not available in this version", "info");
	};

	return (
		<Flex alignItems={"center"} justifyContent={"center"} cursor={"pointer"} onClick={handleGoogleAuth}>
			<Image src='/google.png' w={5} alt='Google logo' />
			<Text mx='2' color={"blue.500"}>
				{prefix} with Google
			</Text>
		</Flex>
	);
};

export default GoogleAuth;
