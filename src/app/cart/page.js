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
  Divider,
  useToast,
  Container,
  Checkbox,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

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
      item.total_price = item.quantity * item.price;
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
      prev.filter((item) => item.productId !== productId)
    );
    toast({
      title: "Item removed",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const calculateTotal = () => {
    return selectedItems
      .filter((item) => item.selected)
      .reduce((total, selectedItem) => {
        const marketItems = cart[selectedItem.marketId];
        const item = marketItems.find(
          (item) => item.product_id === selectedItem.productId
        );
        return total + item.total_price;
      }, 0);
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
    // Proceed with checkout logic here, using `itemsToCheckout`.
  };

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
                <Box
                  key={item.product_id}
                  bg="white"
                  p={4}
                  borderRadius="md"
                  mb={2}
                  cursor="pointer"
                  onClick={() => toggleSelectItem(marketId, item.product_id)}
                  borderWidth={
                    selectedItems.find(
                      (selected) =>
                        selected.productId === item.product_id &&
                        selected.marketId === marketId &&
                        selected.selected
                    )
                      ? "1px"
                      : "1px"
                  }
                  borderColor={
                    selectedItems.find(
                      (selected) =>
                        selected.productId === item.product_id &&
                        selected.marketId === marketId &&
                        selected.selected
                    )
                      ? "blue.500"
                      : "gray.200"
                  }
                >
                  <Flex align="center">
                    <Checkbox
                      isChecked={
                        selectedItems.find(
                          (selected) =>
                            selected.productId === item.product_id &&
                            selected.marketId === marketId
                        )?.selected
                      }
                      onChange={(e) =>
                        toggleSelectItem(marketId, item.product_id)
                      }
                      mr={4}
                      pointerEvents="none"
                    />
                    <Image
                      src={item.images}
                      alt={item.name}
                      boxSize="100px"
                      objectFit="cover"
                      mr={4}
                    />
                    <VStack align="start" flex={1}>
                      <Text fontWeight="bold">{item.name}</Text>
                      <Text>Category: {item.category}</Text>
                      <HStack>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(
                              marketId,
                              item.product_id,
                              item.quantity - 1
                            );
                          }}
                        >
                          -
                        </Button>
                        <Text>{item.quantity}</Text>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(
                              marketId,
                              item.product_id,
                              item.quantity + 1
                            );
                          }}
                        >
                          +
                        </Button>
                      </HStack>
                    </VStack>
                    <VStack align="end">
                      <Text fontWeight="bold">Rp{item.price.toFixed(2)}</Text>
                      <Button
                        leftIcon={<DeleteIcon />}
                        colorScheme="red"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(marketId, item.product_id);
                        }}
                      >
                        Remove
                      </Button>
                    </VStack>
                  </Flex>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
        <Box flex={1}>
          <Box bg="gray.100" p={4} borderRadius="md">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Summary
            </Text>
            <Flex justify="space-between" mb={2}>
              <Text>Products</Text>
              <Text>Rp{calculateTotal().toFixed(2)}</Text>
            </Flex>
            <Flex justify="space-between" mb={4}>
              <Text>Shipping</Text>
              <Text>Free</Text>
            </Flex>
            <Divider my={2} />
            <Flex justify="space-between" fontWeight="bold" mb={4}>
              <Text>Total amount</Text>
              <Text>Rp{calculateTotal().toFixed(2)}</Text>
            </Flex>
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
