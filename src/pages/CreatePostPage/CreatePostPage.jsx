import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Image,
  useToast,
} from "@chakra-ui/react";

const CreatePostPage = () => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption && !image) {
      toast({
        title: "Error",
        description: "Please add a caption or an image",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("caption", caption);
    if (image) {
      formData.append("img", image);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error("Failed to create post");
      }
      toast({
        title: "Post created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box maxW="600px" mx="auto" mt={8} p={4}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Caption</FormLabel>
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write something..."
            />
          </FormControl>
          <FormControl>
            <FormLabel>Image</FormLabel>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
            {image && (
              <Image
                src={URL.createObjectURL(image)}
                alt="Preview"
                mt={2}
                maxH="300px"
                objectFit="contain"
              />
            )}
          </FormControl>
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isSubmitting}
            loadingText="Creating"
          >
            Create Post
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CreatePostPage;
