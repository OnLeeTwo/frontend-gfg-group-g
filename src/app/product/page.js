"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  VStack,
  Heading,
  Text,
  Input,
  Button,
  Select,
  SimpleGrid,
  Card,
  CardBody,
  Image,
  Stack,
  Badge,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Spinner,
  Alert,
  AlertIcon,
  Link,
} from "@chakra-ui/react";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: [],
    location: [],
    priceMin: "",
    priceMax: "",
  });
  const [sortOption, setSortOption] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products?name=&page=1&per_page=20`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch products");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = (category) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter((c) => c !== category)
        : [...prev.category, category],
    }));
  };

  const handlePriceFilter = () => {
    // This function will be called when the Apply button is clicked
    console.log("Applying price filter:", filters.priceMin, filters.priceMax);
  };

  const handleSort = (option) => {
    setSortOption(option);
    // Implement sorting logic here
  };

  const filteredProducts = products
    .filter(
      (product) =>
        (filters.category.length === 0 ||
          filters.category.includes(product.category)) &&
        (filters.priceMin === "" ||
          product.price >= Number(filters.priceMin)) &&
        (filters.priceMax === "" || product.price <= Number(filters.priceMax))
    )
    .sort((a, b) => {
      if (sortOption === "price-asc") return a.price - b.price;
      if (sortOption === "price-desc") return b.price - a.price;
      return 0; // Default or 'relevance' sorting
    });

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  const SidebarContent = () => (
    <VStack align="stretch" spacing={6}>
      <Box>
        <Heading size="md" mb={2}>
          Filter
        </Heading>
      </Box>

      <Box>
        <Heading size="sm" mb={2}>
          Category
        </Heading>
        <VStack align="stretch">
          {[...new Set(products.map((p) => p.category))].map((category) => (
            <Checkbox
              key={category}
              onChange={() => handleCategoryFilter(category)}
              isChecked={filters.category.includes(category)}
            >
              {category}
            </Checkbox>
          ))}
        </VStack>
      </Box>

      <Box>
        <Heading size="sm" mb={2}>
          Price
        </Heading>
        <Flex>
          <Input
            placeholder="Min"
            type="number"
            mr={2}
            value={filters.priceMin}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, priceMin: e.target.value }))
            }
          />
          <Input
            placeholder="Max"
            type="number"
            value={filters.priceMax}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, priceMax: e.target.value }))
            }
          />
        </Flex>
        <Button mt={2} onClick={handlePriceFilter}>
          Apply
        </Button>
      </Box>
    </VStack>
  );

  return (
    <Box>
      <Flex direction={{ base: "column", md: "row" }}>
        {/* Sidebar for medium screens and up */}
        <Box
          display={{ base: "none", md: "block" }}
          width={{ md: "250px" }}
          p={4}
          borderRight="1px"
          borderColor="gray.200"
        >
          <SidebarContent />
        </Box>

        {/* Main Content */}
        <Box flex={1} p={4}>
          <Flex
            direction={{ base: "column", sm: "row" }}
            justify="space-between"
            align="center"
            mb={4}
          >
            <Text mb={{ base: 2, sm: 0 }}>
              Showing {filteredProducts.length} products
            </Text>
            <Flex align="center">
              {/* Filter button for small screens */}
              <Button
                display={{ base: "block", md: "none" }}
                onClick={onOpen}
                mr={2}
              >
                Filters
              </Button>
              <Select
                placeholder="Sort by"
                onChange={(e) => handleSort(e.target.value)}
                value={sortOption}
              >
                <option value="relevance">Most Relevant</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </Select>
            </Flex>
          </Flex>

          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
            spacing={6}
            width="full"
          >
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                passHref
                style={{ textDecoration: "none" }}
              >
                <Card
                  height="100%"
                  maxW="sm"
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  cursor="pointer"
                  _hover={{ boxShadow: "lg" }}
                  display="flex"
                  flexDirection="column"
                >
                  <Box height="200px" overflow="hidden">
                    <Image
                      src={product.images}
                      alt={product.product_name}
                      objectFit="cover"
                      width="100%"
                      height="100%"
                    />
                  </Box>
                  <CardBody flex="1" display="flex" flexDirection="column">
                    <Stack spacing="3" flex="1">
                      <Heading size="sm" noOfLines={2}>
                        {product.product_name}
                      </Heading>
                      <Text fontWeight="bold">
                        Rp{product.price.toLocaleString()}
                      </Text>
                      <Flex align="center" mt="auto">
                        <Badge
                          colorScheme={product.is_premium ? "yellow" : "gray"}
                          mr={1}
                        >
                          {product.is_premium ? "Premium" : "Standard"}
                        </Badge>
                        <Text fontSize="sm">Stock: {product.stock}</Text>
                      </Flex>
                      <Text fontSize="sm" noOfLines={1}>
                        {product.category}
                      </Text>
                    </Stack>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </SimpleGrid>
        </Box>
      </Flex>

      {/* Drawer for filters on small screens */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Filters</DrawerHeader>
            <DrawerBody>
              <SidebarContent />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Box>
  );
};

export default ProductPage;
