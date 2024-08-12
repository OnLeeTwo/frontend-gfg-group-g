"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import axios from "axios";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Stack,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
  VStack,
  HStack,
  Container,
} from "@chakra-ui/react";

const ProductPage = () => {
  const { id } = useParams();
  const toast = useToast();
  const [token, setToken] = useState(null);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("access_token"));
    }
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id || !token) return;

      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/product/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success && response.data.data.length > 0) {
          setProduct(response.data.data[0]);
        } else {
          setProduct(null);
        }
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, token]);

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
      name: product.product_name,
      product_id: product.id,
      quantity: qty,
      price: product.price,
      total_price: qty * product.price,
      market_id: product.market_id,
      description: product.description,
      category: product.category,
      images: imageUrl,
    };

    const existingCart = JSON.parse(localStorage.getItem("cart")) || {};

    if (!existingCart[product.market_id]) {
      existingCart[product.market_id] = [];
    }

    const existingItemIndex = existingCart[product.market_id].findIndex(
      (item) => item.product_id === product.product_id
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
    console.log(`Buying ${qty} item(s) now`);
  };

  const incrementQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, product.stock));
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  return (
    <Container maxW="container.xl" py={10}>
      <Flex direction={{ base: "column", md: "row" }} gap={8}>
        <Box flex={1}>
          <Image
            src={imageUrl}
            alt="Product Image"
            width={500}
            height={500}
            layout="responsive"
            objectFit="cover"
          />
        </Box>

        <VStack flex={1} align="start" spacing={4}>
          <Heading as="h1" size="xl">
            {product.product_name}
          </Heading>
          <Text fontSize="md">{product.category}</Text>
          <Heading as="h2" size="lg">
            Rp{price.toLocaleString()}
          </Heading>
          <Text fontSize="md" fontWeight="bold">
            {product.stock} in stock
          </Text>

          <HStack>
            <Button
              onClick={decrementQuantity}
              isDisabled={quantity === 1}
              colorScheme="blue"
              borderRadius="full"
              size="sm"
            >
              -
            </Button>
            <Text mx={4} fontSize="xl" fontWeight="bold">
              {quantity}
            </Text>
            <Button
              onClick={incrementQuantity}
              isDisabled={quantity === product.stock}
              colorScheme="blue"
              borderRadius="full"
              size="sm"
            >
              +
            </Button>
          </HStack>

          <Stack direction="row" spacing={4} width="full">
            <Button
              colorScheme="orange"
              flex={1}
              onClick={() => handleAddToCart(quantity)}
            >
              Add to Cart
            </Button>
            <Button colorScheme="blue" flex={1}>
              Buy Now
            </Button>
          </Stack>

          <Text fontSize="md">
            Product Description:
            {product.description || "No description available."}
          </Text>
        </VStack>
      </Flex>
    </Container>
  );
};

export default ProductPage;
