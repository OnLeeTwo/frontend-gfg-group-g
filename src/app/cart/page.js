"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Image,
  Text,
  Button,
  VStack,
  HStack,
  useToast,
  Container,
  Checkbox,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import useFetchProduct from "@/hooks/productFetch.js";

const CartItem = ({
  item,
  onRemove,
  onQuantityChange,
  isSelected,
  onToggleSelect,
}) => {
  const productId = item.product_id;
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) setToken(storedToken);
  }, []);

  const { product, error, isLoading } = useFetchProduct(productId, token);

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

  return (
    <Box
      bg="white"
      p={4}
      borderRadius="md"
      mb={2}
      cursor="pointer"
      onClick={onToggleSelect}
      borderWidth="1px"
      borderColor={isSelected ? "blue.500" : "gray.200"}
    >
      <Flex align="center">
        <Checkbox
          isChecked={isSelected}
          onChange={onToggleSelect}
          mr={4}
          pointerEvents="none"
        />
        <Image
          src={product.images}
          alt={product.product_name}
          boxSize="100px"
          objectFit="cover"
          mr={4}
        />
        <VStack align="start" flex={1}>
          <Text fontWeight="bold">{product.product_name}</Text>
          <Text>Category: {product.category}</Text>
          <HStack>
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onQuantityChange(item.quantity - 1);
              }}
            >
              -
            </Button>
            <Text>{item.quantity}</Text>
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onQuantityChange(item.quantity + 1);
              }}
            >
              +
            </Button>
          </HStack>
        </VStack>
        <VStack align="end">
          <Text fontWeight="bold">Rp{product.price.toFixed(2)}</Text>
          <Button
            leftIcon={<DeleteIcon />}
            colorScheme="red"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            Remove
          </Button>
        </VStack>
      </Flex>
    </Box>
  );
};

const CartPage = () => {
  const [cart, setCart] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "{}");
    setCart(storedCart);
    setSelectedItems(
      Object.entries(storedCart).flatMap(([marketId, items]) =>
        items.map((item) => ({
          marketId,
          productId: item.product_id,
          selected: false,
        }))
      )
    );
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const updateQuantity = (marketId, productId, newQuantity) => {
    const newCart = { ...cart };
    const item = newCart[marketId].find(
      (item) => item.product_id === productId
    );
    if (item) {
      item.quantity = Math.max(1, newQuantity);
      updateCart(newCart);
    }
  };

  const removeItem = (marketId, productId) => {
    const newCart = { ...cart };
    newCart[marketId] = newCart[marketId].filter(
      (item) => item.product_id !== productId
    );
    if (newCart[marketId].length === 0) {
      delete newCart[marketId];
    }
    updateCart(newCart);
    setSelectedItems((prev) =>
      prev.filter(
        (item) => item.productId !== productId || item.marketId !== marketId
      )
    );
    toast({
      title: "Item removed",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const toggleSelectItem = (marketId, productId) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.marketId === marketId
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };

  const handleCheckout = () => {
    const itemsToCheckout = selectedItems
      .filter((item) => item.selected)
      .map((selectedItem) => {
        const marketItems = cart[selectedItem.marketId];
        return marketItems.find(
          (item) => item.product_id === selectedItem.productId
        );
      });

    if (itemsToCheckout.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one item to checkout.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    console.log("Items to checkout:", itemsToCheckout);
    // Proceed with checkout logic here
  };

  const totalAmount = selectedItems
    .filter((item) => item.selected)
    .reduce((acc, selectedItem) => {
      const marketItems = cart[selectedItem.marketId];
      const item = marketItems.find(
        (marketItem) => marketItem.product_id === selectedItem.productId
      );
      return acc + item.quantity * item.price;
    }, 0);

  return (
    <Container maxW="container.xl" py={10}>
      <Flex direction={{ base: "column", md: "row" }} gap={6}>
        <Box flex={3}>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Cart - {Object.values(cart).flat().length} items
          </Text>
          {Object.entries(cart).map(([marketId, items]) => (
            <Box key={marketId} mb={6} bg="gray.100" p={4} borderRadius="md">
              <Text fontSize="lg" fontWeight="semibold" mb={2}>
                Market: {marketId}
              </Text>
              {items.map((item) => (
                <CartItem
                  key={`${marketId}-${item.product_id}`}
                  item={item}
                  onRemove={() => removeItem(marketId, item.product_id)}
                  onQuantityChange={(newQuantity) =>
                    updateQuantity(marketId, item.product_id, newQuantity)
                  }
                  isSelected={selectedItems.find(
                    (selected) =>
                      selected.productId === item.product_id &&
                      selected.marketId === marketId &&
                      selected.selected
                  )}
                  onToggleSelect={() =>
                    toggleSelectItem(marketId, item.product_id)
                  }
                />
              ))}
            </Box>
          ))}
        </Box>
        <Box flex={1}>
          <Box bg="gray.100" p={4} borderRadius="md">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Summary
            </Text>
            <Text mb={2}>Total: Rp{totalAmount.toFixed(2)}</Text>
            <Button colorScheme="blue" width="full" onClick={handleCheckout}>
              GO TO CHECKOUT
            </Button>
          </Box>
        </Box>
      </Flex>
    </Container>
  );
};

export default CartPage;
