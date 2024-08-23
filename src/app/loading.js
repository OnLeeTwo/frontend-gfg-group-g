import { Flex, Spinner, Text, VStack } from "@chakra-ui/react";

export default function Loading() {
  return (
    <Flex justifyContent="center" alignItems="center" height="100vh">
      <VStack spacing={3}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
        <Text fontSize="lg" fontWeight="bold" color="blue.500">
          Loading...
        </Text>
      </VStack>
    </Flex>
  );
}
