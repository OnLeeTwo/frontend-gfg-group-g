"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import {
  Box,
  Flex,
  Text,
  Button,
  useToast,
  Container,
  Spinner,
  Alert,
  AlertIcon,
  Link,
} from "@chakra-ui/react";
import useCartFetch from "@/hooks/cartFetch";
import CartItem from "@/components/cart/CartItem";

const CartPage = () => {
  const router = useRouter();
  const [localCart, setLocalCart] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [token, setToken] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "{}");
    setLocalCart(storedCart);
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) setToken(storedToken);
  }, []);

  const { cartProducts, setCartProducts, error, isLoading } = useCartFetch(
    localCart,
    token
  );

  useEffect(() => {
    if (Object.keys(cartProducts).length > 0) {
      setSelectedItems((prevSelectedItems) => {
        const newSelectedItems = Object.entries(cartProducts).flatMap(
          ([marketId, marketData]) =>
            marketData.product.map((product) => {
              const existingItem = prevSelectedItems.find(
                (item) =>
                  item.marketId === marketId &&
                  item.productId === product.product_id
              );
              return {
                marketId,
                productId: product.product_id,
                selected: existingItem ? existingItem.selected : false,
              };
            })
        );
        return newSelectedItems;
      });
    }
  }, [cartProducts]);

  const updateQuantity = (marketId, productId, newQuantity) => {
    const product = cartProducts[marketId]?.product.find(
      (p) => p.product_id === productId
    );
    if (!product) return;

    if (newQuantity > product.stock) {
      toast({
        title: "Quantity exceeds available stock",
        description: `Only ${product.stock} items available`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLocalCart((prevCart) => {
      const newCart = JSON.parse(JSON.stringify(prevCart));
      const item = newCart[marketId].find(
        (item) => item.product_id === productId
      );
      if (item) {
        item.quantity = Math.max(1, newQuantity);
      }
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeItem = (marketId, productId) => {
    setLocalCart((prevCart) => {
      const newCart = JSON.parse(JSON.stringify(prevCart));
      newCart[marketId] = newCart[marketId].filter(
        (item) => item.product_id !== productId
      );
      if (newCart[marketId].length === 0) {
        delete newCart[marketId];
      }
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });

    setCartProducts((prevProducts) => {
      const newProducts = JSON.parse(JSON.stringify(prevProducts));
      newProducts[marketId].product = newProducts[marketId].product.filter(
        (p) => p.product_id !== productId
      );
      if (newProducts[marketId].product.length === 0) {
        delete newProducts[marketId];
      }
      return newProducts;
    });

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
    setSelectedItems((prev) => {
      const newSelectedItems = prev.map((item) =>
        item.productId === productId && item.marketId === marketId
          ? { ...item, selected: !item.selected }
          : item
      );
      return newSelectedItems;
    });
  };

  const totalAmount = selectedItems
    .filter((item) => item.selected)
    .reduce((acc, selectedItem) => {
      const marketData = cartProducts[selectedItem.marketId];
      if (!marketData) return acc;

      const product = marketData.product.find(
        (p) => p.product_id === selectedItem.productId
      );
      if (!product) return acc;

      const cartItem = localCart[selectedItem.marketId]?.find(
        (item) => item.product_id === selectedItem.productId
      );
      if (!cartItem) return acc;

      return acc + cartItem.quantity * product.price;
    }, 0);

  const handleCheckout = () => {
    const itemsToCheckout = selectedItems.filter((item) => item.selected);

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

    const checkoutCart = itemsToCheckout.reduce((acc, item) => {
      if (!acc[item.marketId]) {
        acc[item.marketId] = [];
      }

      const product = cartProducts[item.marketId].product.find(
        (p) => p.product_id === item.productId
      );
      const cartItem = localCart[item.marketId].find(
        (i) => i.product_id === item.productId
      );

      if (product && cartItem) {
        acc[item.marketId].push({
          product_id: item.productId,
          quantity: cartItem.quantity,
        });
      }

      return acc;
    }, {});

    const encodedCart = encodeURIComponent(JSON.stringify(checkoutCart));

    router.push(`/checkout?cart=${encodedCart}`);
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
          {error.message || "An error occurred while fetching the cart items."}
        </Alert>
      </Box>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Flex direction={{ base: "column", md: "row" }} gap={6}>
        <Box flex={3}>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Cart - {Object.values(localCart).flat().length} items
          </Text>
          {Object.entries(cartProducts).map(([marketId, marketData]) => (
            <Box key={marketId} mb={6} bg="gray.100" p={4} borderRadius="md">
              <Link as={NextLink} href={`/market/${marketId}`}>
                <Text fontSize="lg" fontWeight="semibold" mb={2}>
                  {marketData.market_name}
                </Text>
              </Link>
              {marketData.product.map((product) => {
                const cartItem = localCart[marketId]?.find(
                  (item) => item.product_id === product.product_id
                );
                if (!cartItem) return null;
                return (
                  <CartItem
                    key={`${marketId}-${product.product_id}`}
                    product={product}
                    quantity={cartItem.quantity}
                    onRemove={() => removeItem(marketId, product.product_id)}
                    onQuantityChange={(newQuantity) =>
                      updateQuantity(marketId, product.product_id, newQuantity)
                    }
                    isSelected={selectedItems.find(
                      (selected) =>
                        selected.productId === product.product_id &&
                        selected.marketId === marketId &&
                        selected.selected
                    )}
                    onToggleSelect={() =>
                      toggleSelectItem(marketId, product.product_id)
                    }
                  />
                );
              })}
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
