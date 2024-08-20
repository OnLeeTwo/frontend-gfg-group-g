"use client";

import {
  Heading,
  VStack,
  Box,
  Flex,
  Text,
  Spinner,
  Button,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState, useCallback } from "react";
import ProductWishlistCard from "@/components/profile/ProductWishlistCard";

const UserWishlist = () => {
  const toast = useToast();
  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWishlist = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/wishlist`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setWishlist(data.wishlist);
      } else {
        throw new Error(data.message || "Failed to fetch wishlist");
      }
    } catch (error) {
      setError(error.message);
      toast({
        title: "Error fetching wishlist",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <VStack align="center" justify="center" height="100vh" spacing={4}>
        <Text>Error: {error}</Text>
      </VStack>
    );
  }

  return (
    <VStack align="stretch" spacing={8}>
      <Heading as="h1" size="xl">
        Wishlist
      </Heading>

      {wishlist.length === 0 ? (
        <Text>Your wishlist is empty.</Text>
      ) : (
        <Box>
          <Flex
            direction={{ base: "column", md: "row" }}
            flexWrap="wrap"
            gap={3}
          >
            {wishlist.map((item) => (
              <ProductWishlistCard
                key={item.id}
                id={item.id}
                name={item.name}
                images={item.images}
                stock={item.stock}
                price={item.price}
              />
            ))}
          </Flex>
        </Box>
      )}
    </VStack>
  );
};

export default UserWishlist;
