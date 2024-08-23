"use client";

import React from "react";
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
import OrderItemSeller from "@/components/seller/OrderItemSeller";
import useOrdersSeller from "@/hooks/orderFetchSeller";
import withAuth from "@/middleware/withAuth";

const SellerOrders = () => {
  const { orders, loading, error } = useOrdersSeller();

  return (
    <VStack align="stretch" spacing={8}>
      <Heading as="h1" size="xl">
        All Orders
      </Heading>

      <Tabs>
        <TabList>
          <Tab>All</Tab>
          <Tab>To Ship</Tab>
          <Tab>To Delivered</Tab>
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
            <OrderItemSeller key={order.order_id} order={order} />
          ))}
        </VStack>
      )}
    </VStack>
  );
};

export default withAuth(SellerOrders, "seller");
