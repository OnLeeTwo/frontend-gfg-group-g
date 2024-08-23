import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Text,
  Image,
  Spinner,
  Box,
  HStack,
  Divider
} from "@chakra-ui/react";

const OrderDetailsModal = ({ isOpen, onClose, orderId, tax, shipping_fee, admin_fee, total_amount}) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem("access_token"));
    if (isOpen) {
      fetchOrderDetails();
    }
  }, [isOpen]);

  const fetchOrderDetails = async () => {
    setIsLoading(true);
    setError(null);

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order_details/order/${orderId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setOrderDetails(data.order_details);
    } catch (error) {
        setError("Failed to fetch order details. Please try again.");
    } finally {
        setIsLoading(false);
    }
};

const calculateSubTotal = () => {
  if (!orderDetails) return 0;
  return orderDetails.reduce((sum, item) => {
    return sum + (parseFloat(item.product_price) * item.quantity);
  }, 0);
};

return (
  <Modal isOpen={isOpen} onClose={onClose} size="lg">
    <ModalOverlay />
    <ModalContent>
      <ModalHeader bg="gray.100" borderTopRadius="md">Order Details</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {isLoading ? (
          <Spinner />
        ) : error ? (
          <Text color="red.500">{error}</Text>
        ) : orderDetails ? (
          <VStack align="stretch" spacing={4}>
            {orderDetails.map((item) => (
              <Box key={item.product_id}>
                <Text fontWeight="bold" fontSize={'lg'}>{item.market_name}</Text>
                <HStack key={item.product_id} spacing={4} mt={2} align="start">
                  <Image src={item.product_images} alt="Product" boxSize="50px" objectFit="cover" />
                  <VStack align="start" flex={1}>
                    <Text fontWeight="bold">{item.product_name}</Text>
                    <Text>Rp{item.product_price.toLocaleString()} × {item.quantity}</Text>
                  </VStack>
                  <Text fontWeight="bold">Rp{(parseFloat(item.product_price) * item.quantity).toLocaleString()}</Text>
                </HStack>
            </Box>
              
            ))}
            <Divider />
            <HStack justify="space-between">
              <Text>Merchandise Subtotal</Text>
              <Text fontWeight="bold">Rp{calculateSubTotal().toLocaleString()}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text>Shipping Fee</Text>
              <Text fontWeight="bold">Rp{parseFloat(shipping_fee).toLocaleString()}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text>Handling Fee</Text>
              <Text fontWeight="bold">Rp{parseFloat(admin_fee).toLocaleString()}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text>Tax (11%)</Text>
              <Text fontWeight="bold">Rp{parseFloat(tax).toLocaleString()}</Text>
            </HStack>
            <Divider />
            <HStack justify="space-between">
              <Text fontWeight="bold">Order Total</Text>
              <Text fontWeight="bold" fontSize="lg" color="red.500">
                Rp{parseFloat(total_amount).toLocaleString()}
              </Text>
            </HStack>
          </VStack>
        ) : null}
      </ModalBody>
    </ModalContent>
  </Modal>
);
};

export default OrderDetailsModal;