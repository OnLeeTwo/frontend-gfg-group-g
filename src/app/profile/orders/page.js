import React, { useState, useEffect } from "react";
import {
  Heading,
  VStack,
  Tabs,
  TabList,
  Tab,
  Input,
  Box,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import OrderItem from "./OrderItem";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Replace this with your actual API call
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/order/buyer`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <VStack align="stretch" spacing={8}>
      <Heading as="h1" size="xl">
        Orders History
      </Heading>

      <Tabs>
        <TabList>
          <Tab>All</Tab>
          <Tab>To Pay</Tab>
          <Tab>To Ship</Tab>
          <Tab>To Receive</Tab>
          <Tab>Completed</Tab>
          <Tab>Cancelled</Tab>
        </TabList>
      </Tabs>

      <Box position="relative">
        <Input placeholder="Search by Order ID or Product name" />
        <SearchIcon position="absolute" right="4" top="3" />
      </Box>

      {loading ? (
        <Spinner />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : (
        <VStack align="stretch" spacing={4}>
          {orders.map((order) => (
            <OrderItem key={order.order_id} order={order} />
          ))}
        </VStack>
      )}
    </VStack>
  );
};

export default UserOrders;
