"use client";

import {
  Alert,
  AlertIcon,
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  Button,
  Image,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Newsletter from "@/components/home/Newsletter";
import PromoBanner from "@/components/home/PromoBanner";
import BannerCarousel from "@/components/home/BannerCarousel";
import ProductWishlistCard from "@/components/profile/ProductWishlistCard";
import { useRouter } from "next/navigation";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products?page=1&per_page=5`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      if (data.success) {
        setFeaturedProducts(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch products");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box px={{ base: 4, md: 0 }}>
      <BannerCarousel />

      <Container maxW={{ base: "95%", md: "90%", lg: "container.xl" }} py={8}>
        <Heading as="h2" size="xl" mb={6}>
          Featured Products
        </Heading>

        {isLoading ? (
          <Flex justify="center" align="center" h="200px">
            <Spinner size="lg" />
          </Flex>
        ) : error ? (
          <Box mt={10}>
            <Alert status="error">
              <AlertIcon />
              {error || "An error occurred while fetching product data."}
            </Alert>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
            {featuredProducts.map((product) => (
              <ProductWishlistCard
                key={product.id}
                id={product.id}
                name={product.product_name}
                images={product.images}
                price={product.price}
                stock={product.stock}
              />
            ))}
          </SimpleGrid>
        )}

        <Box mt={12}>
          <Button colorScheme="green" size={{ base: "md", md: "lg" }}>
            View All Products
          </Button>
        </Box>
      </Container>

      <PromoBanner />

      <Container maxW="container.xl" py={12}>
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          spacing={{ base: 4, md: 8 }}
          alignItems="center"
        >
          <Box>
            <Heading as="h2" size={{ base: "lg", md: "xl" }} mb={4}>
              About SucoMart
            </Heading>
            <Text fontSize={{ base: "md", md: "lg" }} mb={4}>
              SucoMart is your one-stop shop for sustainable and eco-friendly
              products. We believe in making a positive impact on the
              environment while providing high-quality, ethically sourced goods.
            </Text>
            <Button
              colorScheme="teal"
              size={{ base: "md", md: "lg" }}
              onClick={() => router.push("/about")}
            >
              Learn More
            </Button>
          </Box>
          <Box>
            <Image
              src="banner/banner-4.png"
              alt="Sustainable shopping"
              borderRadius="md"
              w="100%"
              h="auto"
            />
          </Box>
        </SimpleGrid>
      </Container>

      <Newsletter />
    </Box>
  );
}
