"use client";

import React, { useState } from "react";
import {
  Box,
  HStack,
  VStack,
  Text,
  Badge,
  Button,
  Divider,
  useToast,
  Select,
} from "@chakra-ui/react";
import OrderDetailsModalSeller from "./OrdersDetailsModalSeller";

const OrderItemSeller = ({ initialOrder }) => {
  const [order, setOrder] = useState(initialOrder);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(order.status_order);
  const toast = useToast();

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
  
  let shippingAddress;
  try {
    shippingAddress = JSON.parse(order.shipping_address);
  } catch (error) {
    console.error("Error parsing shipping address:", error);
    shippingAddress = {};
  }

  const handleViewDetails = () => {
    setIsModalOpen(true);
  };

  const handleCancelOrder = async (order_id) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      toast({
        title: "Authentication error",
        description: "Please log in to cancel the order",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    
    setIsLoading(true);
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
        title: `Order canceled successfully`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error canceling order:", error);
      toast({
        title: "Failed to cancel order",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOrderStatus = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      toast({
        title: "Authentication error",
        description: "Please log in to update the order status",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
  
    setIsLoading(true);
    const formData = new FormData();
    formData.append("status_order", selectedStatus);
  
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${order.order_id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update order status");
      }
      setOrder(prevOrder => ({
        ...prevOrder,
        status_order: selectedStatus
      }));
      toast({
        title: `Order status updated to ${selectedStatus}`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Failed to update order status",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            <Text>{`${shippingAddress.first_name || ''} ${shippingAddress.last_name || ''}`}</Text>
            <Text>{shippingAddress.full_address || ''}</Text>
            <Text>{`${shippingAddress.city || ''}, ${shippingAddress.zip_code || ''}`}</Text>
            <Text>Phone: {shippingAddress.phone_number || ''}</Text>
          </VStack>
        </Box>
        {order.promotion_id && (
          <Text>Promotion ID: {order.promotion_id}</Text>
        )}
      </VStack>
      <Divider my={2} />
      <HStack justifyContent="flex-end" mt={2}>
        <Button
          size="sm"
          onClick={handleViewDetails}
          aria-label="View order details"
        >
          View Details
        </Button>
        {order.status_order === "Pending" && (
          <Button
            size="sm"
            onClick={() => handleCancelOrder(order.order_id)}
            colorScheme="red"
            isLoading={isLoading}
            loadingText="Cancelling"
            aria-label="Cancel order"
          >
            Cancel Order
          </Button>
        )}
        <Select
          size="sm"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          isDisabled={isLoading}
          aria-label="Update order status"
          width="auto" 
        >
          <option value="pending">Pending</option>
          <option value="shipping">Shipping</option>
          <option value="delivered">Delivered</option>
          <option value="arrived">Arrived</option>
        </Select>
        <Button
          size="sm"
          onClick={handleUpdateOrderStatus}
          colorScheme="blue"
          isLoading={isLoading}
          loadingText="Updating"
          aria-label="Update order status"
        >
          Update Status
        </Button>
      </HStack>
      <OrderDetailsModalSeller
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
  
export default OrderItemSeller;