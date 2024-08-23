"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import useProductFetch from "@/hooks/productFetch";
import { StarIcon, MinusIcon, AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Badge,
  Flex,
  Heading,
  Text,
  Button,
  Divider,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
  VStack,
  HStack,
  Container,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";

const ProductPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const toast = useToast();
  const [token, setToken] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.800", "gray.100");

  const { product, error, isLoading } = useProductFetch(id);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("access_token"));
    }
  }, []);

  useEffect(() => {
    if (token && product) {
      checkWishlistStatus();
    }
  }, [token, product]);

  const checkWishlistStatus = async () => {
    if (product) {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/wishlist/${product.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsInWishlist(response.data.in_wishlist);
      } catch (error) {
        console.error("Error checking wishlist status:", error);
      }
    }
  };

  const handleWishlistToggle = async () => {
    if (!token) {
      toast({
        title: "Error",
        description: "Please login to manage your wishlist",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("product_id", product.id);
      if (!isInWishlist) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      } else {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/wishlist/${product.id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      setIsInWishlist(!isInWishlist);
      toast({
        title: "Success",
        description: isInWishlist
          ? "Product removed from wishlist"
          : "Product added to wishlist",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating the wishlist",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

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
          {error.message || "An error occurred while fetching the product."}
        </Alert>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box mt={10}>
        <Alert status="info">
          <AlertIcon />
          No product found.
        </Alert>
      </Box>
    );
  }

  let imageUrl = product.images;

  const price = typeof product.price === "number" ? product.price : 0;

  const handleAddToCart = (qty) => {
    if (!token) {
      toast({
        title: "Error",
        description: "Please login to add items to cart",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const cartItem = {
      product_id: product.id,
      quantity: qty,
    };

    const existingCart = JSON.parse(localStorage.getItem("cart")) || {};

    if (!existingCart[product.market_id]) {
      existingCart[product.market_id] = [];
    }

    const existingItemIndex = existingCart[product.market_id].findIndex(
      (item) => item.product_id === product.id
    );

    if (existingItemIndex !== -1) {
      const newQuantity =
        existingCart[product.market_id][existingItemIndex].quantity + qty;

      if (newQuantity > product.stock) {
        toast({
          title: "Error",
          description: "Quantity exceeds available stock",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      existingCart[product.market_id][existingItemIndex].quantity = newQuantity;
      existingCart[product.market_id][existingItemIndex].total_price =
        product.price * newQuantity;
    } else {
      existingCart[product.market_id].push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));

    toast({
      title: "Success",
      description: `Added ${qty} item(s) to cart`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    console.log(`Added ${qty} item(s) to cart for market ${product.market_id}`);
  };

  const handleBuyNow = (qty) => {
    if (!token) {
      toast({
        title: "Error",
        description: "Please login to proceed with purchase",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const checkoutData = {
      [`${product.market_id}`]: [
        {
          product_id: product.id,
          quantity: qty,
        },
      ],
    };

    const encodedData = encodeURIComponent(JSON.stringify(checkoutData));
    router.push(`/checkout?cart=${encodedData}`);
  };

  const incrementQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, product.stock));
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  return (
    <Box bg={bgColor} minH="100vh" py={[8, 12, 16]}>
      <Container maxW="container.xl">
        <Flex direction={{ base: "column", lg: "row" }} gap={[8, 12, 16]}>
          <Box flex={1} position="relative" minH={["300px", "400px", "500px"]}>
            <Image
              src={imageUrl}
              alt={product.product_name}
              layout="fill"
              objectFit="cover"
              priority
            />
          </Box>

          <VStack flex={1} align="start" spacing={6} color={textColor}>
            <Flex alignItems="center" flexWrap="wrap">
              <Heading as="h1" size="2xl" mr={2}>
                {product.product_name}
              </Heading>
              {product.is_premium === 1 && (
                <Badge colorScheme="green" fontSize="md" py={1} px={2}>
                  Premium
                </Badge>
              )}
            </Flex>

            <Text fontSize="lg" fontWeight="medium" color="gray.500">
              {product.category}
            </Text>

            <Heading as="h2" size="xl" color="blue.500">
              Rp{product.price.toLocaleString()}
            </Heading>

            <Text fontSize="md" fontWeight="bold">
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </Text>

            <Divider />

            <HStack spacing={4}>
              <Button
                onClick={() => decrementQuantity()}
                isDisabled={quantity === 1}
                colorScheme="blue"
                variant="outline"
                size="md"
              >
                <MinusIcon />
              </Button>
              <Text
                fontSize="xl"
                fontWeight="bold"
                minW="40px"
                textAlign="center"
              >
                {quantity}
              </Text>
              <Button
                onClick={() => incrementQuantity()}
                isDisabled={quantity === product.stock}
                colorScheme="blue"
                variant="outline"
                size="md"
              >
                <AddIcon />
              </Button>
            </HStack>

            <Flex
              width="full"
              gap={4}
              flexDirection={{ base: "column", sm: "row" }}
            >
              <Button
                colorScheme="orange"
                size="lg"
                flex={1}
                onClick={() => handleAddToCart(quantity)}
              >
                Add to Cart
              </Button>
              <Button
                colorScheme="blue"
                size="lg"
                flex={1}
                onClick={() => handleBuyNow(quantity)}
              >
                Buy Now
              </Button>
              <IconButton
                icon={<StarIcon />}
                onClick={handleWishlistToggle}
                colorScheme={isInWishlist ? "red" : "gray"}
                aria-label={
                  isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"
                }
                size="lg"
                variant={isInWishlist ? "solid" : "outline"}
              />
            </Flex>

            <Divider />

            <VStack align="start" spacing={2} width="full">
              <Text fontSize="lg" fontWeight="semibold">
                Product Description:
              </Text>
              <Text fontSize="md">
                {product.description || "No description available."}
              </Text>
            </VStack>
          </VStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default ProductPage;
