"use client";

import React, { useEffect, useState } from "react";
import { useLogout } from "@/hooks/auth";
import useFetchUser from "@/hooks/userFetch";
import {
  Box,
  Flex,
  VStack,
  Heading,
  Text,
  Avatar,
  Button,
  Link,
  Container,
  Grid,
  GridItem,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

const UserProfile = () => {
  const logout = useLogout();
  const toast = useToast();
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("access_token"));
    }
  }, []);

  const handleUserUpdate = () => {};

  const { user, error, isLoading } = useFetchUser(token);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="80vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box mt={10}>
        <Alert status="error">
          <AlertIcon />
          {error.message || "An error occurred while fetching user data."}
        </Alert>
      </Box>
    );
  }

  return (
    <Container maxW="container.xl" py={5}>
      <Grid templateColumns={{ base: "1fr", md: "250px 1fr" }} gap={6}>
        <GridItem as="nav">
          <VStack align="stretch" spacing={3} position="sticky" top="20px">
            <Link href="/account">Account Main</Link>
            <Link href="/orders">Order History</Link>
            <Link href="/wishlist">My Wishlist</Link>
            <Button
              onClick={logout}
              className="text-gray-700 hover:text-blue-500"
            >
              Logout
            </Button>
          </VStack>
        </GridItem>

        <GridItem>
          <VStack align="stretch" spacing={8}>
            <Heading as="h1" size="xl">
              Account Main
            </Heading>

            <Flex>
              <Image
                src={
                  user.profile_picture
                    ? user.profile_picture
                    : "/default_placeholder_user.png"
                }
                alt="Profile Picture"
                width={125}
                height={125}
                layout="responsive"
                objectFit="cover"
              />
              <Box>
                <Heading as="h2" size="md">
                  {user.name ? user.name : "Mr. Anonymous"}
                </Heading>
                <Text>
                  Email: {user.email ? user.email : "No email provided"}
                </Text>
                <Text></Text>
              </Box>
            </Flex>

            <Box>
              <Heading as="h3" size="md" mb={4}>
                Addresses
              </Heading>
              <VStack align="stretch" spacing={4}>
                {/* Address components would go here */}
                <Button alignSelf="flex-start">+ Add New Address</Button>
              </VStack>
            </Box>

            <Box>
              <Heading as="h3" size="md" mb={4}>
                Your Orders
              </Heading>
              {/* Order components would go here */}
            </Box>
          </VStack>
        </GridItem>
      </Grid>
    </Container>
  );
};

export default UserProfile;
