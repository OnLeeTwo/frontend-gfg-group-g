import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  VStack,
  Heading,
  Text,
  Checkbox,
  Input,
  Select,
  SimpleGrid,
  Image,
  Badge,
  Button,
  Spinner,
  Alert,
  AlertIcon,
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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products`
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

  const handleLocationFilter = (location) => {
    // Placeholder for location filter (not in your current data model)
    console.log("Filter by location:", location);
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

  return (
    <Flex>
      {/* Sidebar */}
      <Box width="250px" p={4} borderRight="1px" borderColor="gray.200">
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
              {/* Dynamically generate checkboxes based on unique categories */}
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
      </Box>

      {/* Main Content */}
      <Box flex={1} p={4}>
        <Flex justify="space-between" mb={4}>
          <Text>Showing {filteredProducts.length} products</Text>
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

        <SimpleGrid columns={5} spacing={4}>
          {filteredProducts.map((product) => (
            <Box
              key={product.id}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
            >
              <Image src={product.images} alt={product.product_name} />
              <Box p={3}>
                <Heading size="sm" mb={2}>
                  {product.product_name}
                </Heading>
                <Text fontWeight="bold" mb={2}>
                  Rp{product.price.toLocaleString()}
                </Text>
                <Flex align="center" mb={2}>
                  <Badge
                    colorScheme={product.is_premium ? "yellow" : "gray"}
                    mr={1}
                  >
                    {product.is_premium ? "Premium" : "Standard"}
                  </Badge>
                  <Text fontSize="sm">Stock: {product.stock}</Text>
                </Flex>
                <Text fontSize="sm">{product.category}</Text>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Flex>
  );
};

export default ProductPage;
