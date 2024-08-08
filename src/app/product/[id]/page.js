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
} from "@chakra-ui/react";

const ProductPage = () => {
  const { id } = useParams(); // Get dynamic route parameter
  const [token, setToken] = useState(null);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
  let imageProvider = process.env.NEXT_PUBLIC_IMAGE_PROVIDER;

  if (imageUrl) {
    const parts = imageUrl.split("/");
    const lastPart = parts[parts.length - 1];
    imageUrl = `${imageProvider}/${lastPart}`;
  }

  const price = typeof product.price === "number" ? product.price : 0;

  return (
    <Box maxW="md" mx="auto" mt={10}>
      <Box position="relative" mb={4}>
        <Image
          src={imageUrl}
          alt="Product Image"
          width={400}
          height={400}
          layout="responsive"
          objectFit="cover"
        />
      </Box>
      <Heading as="h1" size="xl" mb={2}>
        {product.product_name}
      </Heading>
      <Text fontSize="md" mb={4}>
        {product.category}
      </Text>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold">
          {product.stock} in stock
        </Text>
        <Heading as="h2" size="xl">
          Rp{price.toLocaleString()}
        </Heading>
      </Flex>
      <Stack direction="row" spacing={4} mb={4}>
        <Button colorScheme="orange" flex="1">
          Add to Cart
        </Button>
        <Button colorScheme="blue" flex="1">
          Buy Now
        </Button>
      </Stack>
    </Box>
  );
};

export default ProductPage;
