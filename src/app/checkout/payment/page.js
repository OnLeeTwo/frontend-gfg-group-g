"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Container,
  useToast,
} from "@chakra-ui/react";
import withAuth from "@/middleware/withAuth";

const PaymentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState([]);
  const [token, setToken] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const orderDataParams = searchParams.get("orderData");
    if (orderDataParams) {
      try {
        const decodedOrder = JSON.parse(decodeURIComponent(orderDataParams));
        setOrderData(decodedOrder);
        const storedToken = localStorage.getItem("access_token");
        if (storedToken) setToken(storedToken);
      } catch (error) {
        console.error("Error parsing order data:", error);
      }
    }
  }, [searchParams]);

  const calculateTotal = (orderData) => {
    if (!Array.isArray(orderData)) {
      console.error("orderData is not an array:", orderData);
      return 0;
    }

    let total = 0;
    orderData.forEach((order) => {
      if (typeof order.amount === "string") {
        total += parseFloat(order.amount) || 0;
      } else if (typeof order.amount === "number") {
        total += order.amount;
      } else {
        console.error("Invalid amount:", order.amount);
      }
    });
    return total;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let successfulPayment = [];
    let failedPayment = [];

    for (let i = 0; i < orderData.length; i++) {
      const order = orderData[i];

      const formData = new FormData();
      formData.append("status_payment", "done");

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/${order.orderId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );
        if (!response.ok) {
          throw new Error("Failed to process payment");
        }
        successfulPayment.push(order);
        toast({
          title: `Payment ${i + 1} of ${
            orderData.length
          } processed successfully`,
          status: "info",
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Error processing payment:", error);
        failedPayment.push(order);
      } finally {
        setIsLoading(false);
      }
    }

    if (failedPayment.length > 0) {
      toast({
        title: `${failedPayment.length} orders failed to process`,
        description: "You can try to resubmit these orders.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }

    if (successfulPayment.length > 0) {
      toast({
        title: "All payment were processed successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.push(`/`);
    } else {
      toast({
        title: "No payment were processed successfully, please try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl" textAlign="center" color={"red.500"}>
          For development purpose only, do not submit the real payment data!
        </Heading>
        <Heading as="h1" size="xl" textAlign="center">
          Payment Details
        </Heading>
        <Box as="form" onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="cardNumber" isRequired>
              <FormLabel>Card Number</FormLabel>
              <Input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
              />
            </FormControl>
            <FormControl id="expiryDate" isRequired>
              <FormLabel>Expiry Date</FormLabel>
              <Input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/YY"
              />
            </FormControl>
            <FormControl id="cvv" isRequired>
              <FormLabel>CVV</FormLabel>
              <Input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
              />
            </FormControl>
            <Box>
              <Heading as="h2" size="md" mb={2}>
                Order Summary
              </Heading>
              <Text>Total: Rp{calculateTotal(orderData).toFixed(2)}</Text>
            </Box>
            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              width="full"
              isLoading={isLoading}
              loadingText="Processing"
            >
              Pay Now
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default withAuth(PaymentPage, "buyer");
