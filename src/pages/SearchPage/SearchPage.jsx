import { useEffect, useState } from "react";
import {
  Box,
  Input,
  VStack,
  Text,
  Image,
  Spinner,
  Flex,
  Avatar,
  Link,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUrl";

const SearchPage = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostsAndUsers = async () => {
      setLoading(true);
      try {
        const postsRes = await fetch("/api/posts/all");
        const postsData = await postsRes.json();
        setPosts(postsData);

        const usersRes = await fetch("/api/users/all");
        const usersData = await usersRes.json();
        setUsers(usersData);
        setFilteredUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch posts or users", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPostsAndUsers();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  return (
    <Box maxW="800px" mx="auto" mt={8} p={4}>
      <Input
        placeholder="Search users"
        mb={4}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {loading ? (
        <Flex justify="center" mt={10}>
          <Spinner size="xl" />
        </Flex>
      ) : (
        <>
          <Text fontSize="xl" mb={4}>
            Users
          </Text>
          <VStack spacing={3} align="stretch" mb={8}>
            {filteredUsers.length === 0 ? (
              <Text>No users found</Text>
            ) : (
              filteredUsers.map((user) => (
                <Flex key={user._id} align="center" gap={3}>
                  <Avatar src={user?.profilePicURL || ''} name={user?.username || ''} />
                  <Link as={RouterLink} to={`/${user?.username || ''}`} fontWeight="bold">
                    {user?.username || ''}
                  </Link>
                </Flex>
              ))
            )}
          </VStack>
          <Text fontSize="xl" mb={4}>
            Posts
          </Text>
          <VStack spacing={6} align="stretch">
            {posts.length === 0 ? (
              <Text>No posts available</Text>
            ) : (
              posts.map((post) => (
                <Box key={post._id} borderWidth="1px" borderRadius="md" p={4}>
                  <Flex align="center" gap={3} mb={2}>
                    <Avatar src={post?.createdBy?.profilePicURL || ''} name={post?.createdBy?.username || ''} size="sm" />
                    <Link as={RouterLink} to={`/${post?.createdBy?.username || ''}`} fontWeight="bold">
                      {post?.createdBy?.username || ''}
                    </Link>
                  </Flex>
                  <Text mb={2}>{post?.caption || ''}</Text>
                  {post?.imgURL && (
                    <Image
                      src={getImageUrl(post.imgURL)}
                      alt="Post image"
                      maxH="400px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                  )}
                </Box>
              ))
            )}
          </VStack>
        </>
      )}
    </Box>
  );
};

export default SearchPage;
