"use client";

import React, {useState}from "react";
import {
  Box,
  HStack,
  VStack,
  Text,
  Badge,
  Button,
  Divider,
} from "@chakra-ui/react";
import OrderDetailsModal from "./OrdersDetailsModal";

const OrderItem = ({ order }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "yellow";
      case "Arrived":
        return "green";
      case "Cancelled":
        return "red";
      default:
        return "gray";
    }
  };
  
  const shippingAddress = JSON.parse(order.shipping_address);

  const handleViewDetails = () => {
    setIsModalOpen(true);
  };

  const handleCancelOrder = async (order_id) =>{
    const token = localStorage.getItem("access_token")
    if (!token){
      return 
    }
    const formData = new FormData();
    formData.append("status_order", "cancelled");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${order_id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("Failed to cancel order");
      }
      toast({
        title: `Order canceled successfuly`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  }

  return (
    <Box borderWidth={1} borderRadius="lg" p={4}>
      <HStack justifyContent="space-between" mb={2}>
        <Text fontWeight="bold">Order #{order.order_id}</Text>
        <Badge colorScheme={getStatusColor(order.status_order)}>
          {order.status_order}
        </Badge>
      </HStack>
      <VStack align="stretch" spacing={2}>
        <Text>Total Amount: Rp{order.total_amount.toLocaleString()}</Text>
        <Text>Payment Status: {order.status_payment}</Text>
        <Text>Created At: {order.created_at}</Text>
        <Box>
          <Text fontWeight="bold">Shipping Address:</Text>
          <VStack align="stretch" pl={4} spacing={1}>
            <Text>{`${shippingAddress.first_name} ${shippingAddress.last_name}`}</Text>
            <Text>{shippingAddress.full_address}</Text>
            <Text>{`${shippingAddress.city}, ${shippingAddress.zip_code}`}</Text>
            <Text>Phone: {shippingAddress.phone_number}</Text>
          </VStack>
        </Box>
        {order.promotion_id && (
          <Text>Promotion ID: {order.promotion_id}</Text>
        )}
      </VStack>
      <Divider my={2} />
      <HStack justifyContent="flex-end" mt={2}>
      <Button size="sm" onClick={handleViewDetails}>View Details</Button>
        {order.status_order === "Pending" && (
          <Button size="sm" onClick={handleCancelOrder(order.order_id)} colorScheme="red">
            Cancel Order
          </Button>
        )}
      </HStack>
      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderId={order.order_id}
        shipping_fee={order.shipping_fee}
        tax={order.tax}
        admin_fee={order.admin_fee}
        total_amount={order.total_amount}
      />
    </Box>
  );
};
  
export default OrderItem;