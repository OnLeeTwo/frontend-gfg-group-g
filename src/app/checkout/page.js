"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
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
  Select,
  Checkbox,
  Divider,
  useToast,
} from "@chakra-ui/react";

const CheckoutPage = () => {
  const toast = useToast();
  const [cart, setCart] = useState({});
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState("Home delivery");
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    floor: "",
    zipCode: "",
    city: "",
  });
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("Debit card");
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "{}");
    setCart(storedCart);
  }, []);
  const handlePromoCode = () => {
    // Implement promo code logic here
    // This is a placeholder implementation
    if (promoCode === "DISCOUNT10") {
      const newDiscount = calculateSubtotal() * 0.1;
      setDiscount(newDiscount);
      toast({
        title: "Promo code applied",
        description: `Discount of Rp${newDiscount.toFixed(
          2
        )} has been applied to your order.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else {
      setDiscount(0);
      toast({
        title: "Invalid promo code",
        description: "The entered promo code is not valid.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const calculateTotal = () => {
    return (
      calculateSubtotal() + calculateShipping() + calculateTaxes() - discount
    );
  };
  const calculateSubtotal = () => {
    // Implement subtotal calculation logic
    return 100000;
  };

  const calculateShipping = () => {
    // Implement shipping calculation logic
    return 10000;
  };

  const calculateTaxes = () => {
    // Implement tax calculation logic
    return 10000;
  };

  const calculateAdmin = () => {
    // Implement tax calculation logic
    return 10000;
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
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Shipping address
              </Text>
              <VStack spacing={4}>
                <Input placeholder="First name" />
                <Input placeholder="Last name" />
                <Input placeholder="Email" />
                <Input placeholder="Phone number" />
                <Input placeholder="Address" />
                <Select placeholder="Floor">
                  <option>Ground floor</option>
                  <option>1st floor</option>
                  {/* Add more options */}
                </Select>
                <Input placeholder="ZIP code" />
                <Input placeholder="City" />
              </VStack>
            </Box>

            <Box>
              <Checkbox
                isChecked={sameAsBilling}
                onChange={(e) => setSameAsBilling(e.target.checked)}
              >
                Same as the delivery address
              </Checkbox>
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
          <Box mb={4}>
            <Text fontWeight="bold" mb={2}>
              Promo code
            </Text>
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handlePromoCode}>
                  Apply
                </Button>
              </InputRightElement>
            </InputGroup>
          </Box>
          <VStack align="stretch" spacing={4}>
            {Object.entries(cart).flatMap(([marketId, items]) =>
              items.map((item) => (
                <HStack key={item.product_id} justify="space-between">
                  <Image
                    src={item.images}
                    alt={item.name}
                    boxSize="50px"
                    objectFit="cover"
                  />
                  <VStack align="start" flex={1}>
                    <Text fontWeight="bold">{item.name}</Text>
                    <Text>{item.category}</Text>
                  </VStack>
                  <Text>Rp{item.total_price.toFixed(2)}</Text>
                </HStack>
              ))
            )}
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
            {discount > 0 && (
              <HStack justify="space-between" color="green.500">
                <Text>Discount</Text>
                <Text>-Rp{discount.toFixed(2)}</Text>
              </HStack>
            )}
            <Divider />
            <HStack justify="space-between" fontWeight="bold">
              <Text>Total</Text>
              <Text>
                Rp{(calculateSubtotal() + calculateShipping()).toFixed(2)}
              </Text>
            </HStack>
          </VStack>
        </Box>
      </Flex>
    </Container>
  );
};

export default CheckoutPage;
