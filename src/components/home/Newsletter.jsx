import { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Input,
  Button,
  VStack,
  useToast,
  Flex
} from '@chakra-ui/react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted email:', email);
    toast({
      title: 'Subscribed!',
      description: "You've successfully subscribed to our newsletter.",
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    setEmail('');
  };

  return (
    <Box bg="gray.100" py={12}>
      <VStack
        maxW="container.md"
        mx="auto"
        spacing={6}
        align="center"
        px={4}
      >
        <Heading as="h2" size="xl" textAlign="center">
          Subscribe to Our Newsletter
        </Heading>
        <Text fontSize="lg" textAlign="center">
          Stay updated with our latest eco-friendly products and sustainability tips!
        </Text>
        <Box as="form" onSubmit={handleSubmit} width="100%">
          <Flex direction={{ base: 'column', md: 'row' }}>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              bg="white"
              mr={{ md: 2 }}
              mb={{ base: 2, md: 0 }}
            />
            <Button type="submit" colorScheme="green">
              Subscribe
            </Button>
          </Flex>
        </Box>
      </VStack>
    </Box>
  );
}