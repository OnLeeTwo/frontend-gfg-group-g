"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useCartFetch from "@/hooks/cartFetch";
import useFetchUser from "@/hooks/userFetch";
import {
  Box,
  Alert,
  AlertIcon,
  Container,
  Flex,
  VStack,
  HStack,
  Text,
  Image,
  Button,
  Radio,
  RadioGroup,
  Input,
  InputGroup,
  InputRightElement,
  Heading,
  Grid,
  Select,
  Spinner,
  Checkbox,
  Divider,
  useToast,
} from "@chakra-ui/react";

const CheckoutPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const [token, setToken] = useState(null);
  const [shouldFetchUser, setShouldFetchUser] = useState(false);
  const [checkoutCart, setCheckoutCart] = useState({});
  const [promoCodes, setPromoCodes] = useState({});
  const [promoErrors, setPromoErrors] = useState({});
  const [promotions, setPromotions] = useState({});
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState("Home delivery");
  const [addresses, setAddresses] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Debit card");
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    const cart = searchParams.get("cart");
    if (cart) {
      try {
        const decodedCart = JSON.parse(decodeURIComponent(cart));
        setCheckoutCart(decodedCart);
        const storedToken = localStorage.getItem("access_token");
        if (storedToken) setToken(storedToken);
      } catch (error) {
        console.error("Error parsing cart data:", error);
      }
    }
  }, [searchParams]);

  const { cartProducts, error, isLoading } = useCartFetch(checkoutCart, token);

  useEffect(() => {
    if (token && cartProducts && Object.keys(cartProducts).length > 0) {
      setShouldFetchUser(true);
    }
  }, [token, cartProducts]);

  const { user } = useFetchUser(shouldFetchUser ? token : null);

  useEffect(() => {
    if (user) {
      setAddresses(user.address || []);
    }
  }, [user]);

  const handlePromoCode = async (marketId) => {
    setPromoErrors((prev) => ({ ...prev, [marketId]: "" }));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/promotion/${promoCodes[marketId]}?market_id=${marketId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to apply promo code");
      }

      const promotionData = await response.json();

      setPromotions((prevPromotions) => ({
        ...prevPromotions,
        [marketId]: promotionData,
      }));

      toast({
        title: "Promo code applied",
        description: `Discount of ${promotionData.discount_value}% has been applied to products from ${cartProducts[marketId].market_name}.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error applying promo code:", error);
      setPromoErrors((prev) => ({ ...prev, [marketId]: error.message }));
      toast({
        title: "Error applying promo code",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return (
      calculateSubtotal() +
      calculateShipping() +
      calculateTaxes(subtotal) +
      calculateAdmin() -
      discount
    );
  };

  const calculateSubtotal = () => {
    let subtotal = 0;
    for (const [marketId, marketData] of Object.entries(cartProducts)) {
      const marketSubtotal = marketData.product.reduce((sum, item) => {
        const cartItem = checkoutCart[marketId]?.find(
          (ci) => ci.product_id === item.product_id
        );
        const quantity = cartItem ? cartItem.quantity : 0;
        return sum + item.price * quantity;
      }, 0);

      if (promotions[marketId]) {
        const discountPercentage = promotions[marketId].discount_value / 100;
        subtotal += marketSubtotal * (1 - discountPercentage);
      } else {
        subtotal += marketSubtotal;
      }
    }
    return subtotal;
  };

  const calculateShipping = () => {
    // Can be implemented in the future
    return 10000;
  };

  const calculateTaxes = (subtotal) => {
    const taxes = subtotal * 0.11;
    return taxes;
  };

  const calculateAdmin = () => {
    // Can be implemented in the future
    return 5000;
  };

  const getSelectedAddress = () => {
    return addresses.find((address) => address.id === selectedAddressId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedAddress = getSelectedAddress();
    if (!selectedAddress) {
      toast({
        title: "Please select an address",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const marketOrders = Object.entries(cartProducts).map(
      ([marketId, marketData]) => {
        const cartItems = checkoutCart[marketId].map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        }));
        return {
          market_id: marketId,
          cart: JSON.stringify({ [marketId]: cartItems }),
          promotion_code: promoCodes[marketId] || "",
        };
      }
    );

    console.log(marketOrders);

    let successfulOrders = [];
    let successfulMarketIds = [];
    let failedOrders = [];

    for (let i = 0; i < marketOrders.length; i++) {
      const order = marketOrders[i];
      try {
        const formData = new FormData();
        formData.append("cart", order.cart);
        if (order.promotion_code) {
          formData.append("code", order.promotion_code);
        }
        formData.append("shipping_address", JSON.stringify(selectedAddress));

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/order`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to create order");
        }

        const orderData = await response.json();
        successfulOrders.push({
          orderId: orderData.order_id,
          amount: orderData.total_amount,
        });
        successfulMarketIds.push(order.market_id);

        toast({
          title: `Order ${i + 1} of ${marketOrders.length} created`,
          status: "info",
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        console.error(
          `Error creating order for market ${order.market_id}:`,
          error
        );
        failedOrders.push(order);
      }
    }

    if (failedOrders.length > 0) {
      toast({
        title: `${failedOrders.length} orders failed to create`,
        description: "You can try to resubmit these orders.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }

    if (successfulOrders.length > 0) {
      removeSuccessfulOrdersFromCart(successfulMarketIds);
      const orderDataString = encodeURIComponent(
        JSON.stringify(successfulOrders)
      );
      router.push(`checkout/payment?orderData=${orderDataString}`);
    } else {
      toast({
        title: "No orders were processed successfully",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const removeSuccessfulOrdersFromCart = (successfulMarketIds) => {
    const currentCart = JSON.parse(localStorage.getItem("cart") || "{}");
    successfulMarketIds.forEach((marketId) => {
      delete currentCart[marketId];
    });
    localStorage.setItem("cart", JSON.stringify(currentCart));
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
          {error.message ||
            "An error occurred while checking your items out. Please try again later."}
        </Alert>
      </Box>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Flex direction={{ base: "column", md: "row" }} gap={6}>
        <Box flex={2}>
          <VStack align="stretch" spacing={6}>
            <Box>
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Delivery and collection
              </Text>
              <RadioGroup value={deliveryMethod} onChange={setDeliveryMethod}>
                <HStack>
                  <Radio value="Home delivery">Home delivery</Radio>
                  <Radio value="Order and collect">Order and collect</Radio>
                </HStack>
              </RadioGroup>
            </Box>

            <Box>
              <Heading as="h3" size="md" mb={4}>
                Shipping Addresses
              </Heading>
              <Grid
                templateColumns={{
                  base: "1fr",
                  md: "1fr 1fr",
                  lg: "1fr 1fr 1fr",
                }}
                gap={4}
              >
                {addresses.map((address) => (
                  <Box
                    key={address.id}
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    p={4}
                    bg={selectedAddressId === address.id ? "blue.50" : "white"}
                    shadow="md"
                    cursor="pointer"
                    onClick={() => setSelectedAddressId(address.id)}
                    _hover={{ bg: "gray.50" }}
                  >
                    <Flex justifyContent="space-between" alignItems="center">
                      <Heading as="h4" size="sm">
                        {`${address.first_name} ${address.last_name}`}
                      </Heading>
                      <Radio
                        isChecked={selectedAddressId === address.id}
                        onChange={() => setSelectedAddressId(address.id)}
                      />
                    </Flex>
                    <Text mt={2}>Phone: {address.phone_number}</Text>
                    <Text mt={2}>
                      {`${address.full_address}, ${address.city}, ${address.zip_code}`}
                    </Text>
                  </Box>
                ))}
              </Grid>
            </Box>

            <Box>
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Payment
              </Text>
              <RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
                <VStack align="start">
                  <Radio value="Debit card">Debit card</Radio>
                  <Radio value="BLIK">
                    BLIK / Fast transfer / Installments
                  </Radio>
                </VStack>
              </RadioGroup>
            </Box>

            <Box>
              <Checkbox
                isChecked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              >
                I accept the terms and conditions
              </Checkbox>
            </Box>

            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isDisabled={!termsAccepted}
            >
              I ORDER AND PAY
            </Button>
          </VStack>
        </Box>

        <Box flex={1}>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            Order summary
          </Text>
          <VStack align="stretch" spacing={4}>
            {Object.entries(cartProducts).map(([marketId, marketData]) => (
              <Box
                key={marketId}
                borderWidth={1}
                borderRadius="md"
                p={4}
                mb={4}
              >
                <Text fontWeight="bold" mb={2}>
                  {marketData.market_name}
                </Text>
                {marketData.product.map((item) => {
                  const cartItem = checkoutCart[marketId]?.find(
                    (ci) => ci.product_id === item.product_id
                  );
                  const quantity = cartItem ? cartItem.quantity : 0;
                  return (
                    <HStack
                      key={item.product_id}
                      justify="space-between"
                      mb={2}
                    >
                      <Image
                        src={item.images}
                        alt={item.name}
                        boxSize="50px"
                        objectFit="cover"
                      />
                      <VStack align="start" flex={1}>
                        <Text fontWeight="bold">{item.name}</Text>
                        <Text>
                          {quantity} × Rp{item.price.toFixed(2)}
                        </Text>
                      </VStack>
                      <Text>Rp{(item.price * quantity).toFixed(2)}</Text>
                    </HStack>
                  );
                })}
                <Box mt={4}>
                  <Text fontWeight="bold" mb={2}>
                    Promo code for {marketData.market_name}
                  </Text>
                  <InputGroup size="md">
                    <Input
                      pr="4.5rem"
                      type="text"
                      placeholder="Enter promo code"
                      value={promoCodes[marketId] || ""}
                      onChange={(e) =>
                        setPromoCodes({
                          ...promoCodes,
                          [marketId]: e.target.value,
                        })
                      }
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={() => handlePromoCode(marketId)}
                      >
                        Apply
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  {promoErrors[marketId] && (
                    <Text color="red.500" mt={2}>
                      {promoErrors[marketId]}
                    </Text>
                  )}
                </Box>
              </Box>
            ))}
            <Divider />

            <HStack justify="space-between">
              <Text>Subtotal</Text>
              <Text>Rp{calculateSubtotal().toFixed(2)}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text>Shipping</Text>
              <Text>Rp{calculateShipping().toFixed(2)}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text>Taxes included (11%)</Text>
              <Text>Rp{calculateTaxes(calculateSubtotal()).toFixed(2)}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text>Admin fee</Text>
              <Text>Rp{calculateAdmin().toFixed(2)}</Text>
            </HStack>
            {Object.entries(promotions).map(([marketId, promotion]) => (
              <HStack key={marketId} justify="space-between" color="green.500">
                <Text>Discount ({cartProducts[marketId].market_name})</Text>
                <Text>-{promotion.discount_value}%</Text>
              </HStack>
            ))}
            <Divider />
            <HStack justify="space-between" fontWeight="bold">
              <Text>Total</Text>
              <Text>Rp{calculateTotal().toFixed(2)}</Text>
            </HStack>
          </VStack>
        </Box>
      </Flex>
    </Container>
  );
};

export default CheckoutPage;
