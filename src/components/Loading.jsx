import { Flex, Spinner } from "@chakra-ui/react";

export const LoadingPage = () => {
    return (
        <Flex justify="center" align="center" h="80vh">
          <Spinner size="xl" />
        </Flex>
      );
}