import { Avatar, Box, Button, Flex, VStack } from "@chakra-ui/react";
import useFollowUser from "../../hooks/useFollowUser";
import useAuthStore from "../../store/authStore";
import { Link } from "react-router-dom";

const SuggestedUser = ({ user, setUser }) => {
	const { isFollowing, isUpdating, handleFollowUser } = useFollowUser(user.uid);
	const authUser = useAuthStore((state) => state.user);

	const onFollowUser = async () => {
		await handleFollowUser();
		setUser({
			...user,
			followers: isFollowing
				? user.followers.filter((follower) => follower !== authUser.uid)
				: [...user.followers, authUser.uid],
		});
	};

	return (
		<Flex justifyContent={"space-between"} alignItems={"center"} w={"full"}>
			<Flex alignItems={"center"} gap={2}>
				<Link to={`/${user.username}`}>
					<Avatar src={user.profilePicURL} size={"md"} />
				</Link>
				<VStack spacing={2} alignItems={"flex-start"}>
					<Link to={`/${user.username}`}>
						<Box fontSize={12} fontWeight={"bold"}>
							{user.fullName}
						</Box>
					</Link>
					<Box fontSize={11} color={"gray.500"}>
						{user.followers?.length || 0} followers
					</Box>
				</VStack>
			</Flex>
			{authUser.uid !== user.uid && (
					<Button
						fontSize={13}
						bg={isFollowing ? "blue.400" : "transparent"}
						color={isFollowing ? "white" : "blue.400"}
						p={0}
						h={"max-content"}
						fontWeight={"medium"}
						cursor={"pointer"}
						_hover={{ bg: isFollowing ? "blue.500" : "transparent", color: "white" }}
						onClick={onFollowUser}
						isLoading={isUpdating}
					>
						{isFollowing ? "Following" : "Follow"}
					</Button>
			)}
		</Flex>
	);
};

export default SuggestedUser;
