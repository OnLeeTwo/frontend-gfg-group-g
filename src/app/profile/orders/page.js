import { Heading, VStack } from "@chakra-ui/react";
import React from "react";

const UserOrders = () => {
  return (
    <VStack align="stretch" spacing={8}>
      <Heading as="h1" size="xl">
        Orders History
      </Heading>
    </VStack>
  );
};

export default UserOrders;
