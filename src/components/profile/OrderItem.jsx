import React from "react";
import {
  Box,
  HStack,
  VStack,
  Text,
  Badge,
  Button,
  Divider,
} from "@chakra-ui/react";

const OrderItem = ({ order }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "yellow";
      case "COMPLETED":
        return "green";
      case "CANCELLED":
        return "red";
      default:
        return "gray";
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
        <Text>Shipping Address: {order.shipping_address}</Text>
        {order.promotion_id && (
          <Text>Promotion ID: {order.promotion_id}</Text>
        )}
      </VStack>
      <Divider my={2} />
      <HStack justifyContent="flex-end" mt={2}>
        <Button size="sm">View Details</Button>
        {order.status_order === "PENDING" && (
          <Button size="sm" colorScheme="red">
            Cancel Order
          </Button>
        )}
      </HStack>
    </Box>
  );
};

export default OrderItem;