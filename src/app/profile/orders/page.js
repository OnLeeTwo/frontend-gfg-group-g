"use client";

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
import OrderItem from "@/components/profile/OrderItem";
import useOrders from "@/hooks/orderFetch";
import withAuth from "@/middleware/withAuth";

const UserOrders = () => {
  const { orders, loading, error } = useOrders();

  return (
    <VStack align="stretch" spacing={8}>
      <Heading as="h1" size="xl">
        Order History
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

export default withAuth(UserOrders, "buyer");
