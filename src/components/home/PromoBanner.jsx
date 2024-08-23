import { Box, Flex, Heading, Text, Button } from '@chakra-ui/react';

export default function PromoBanner() {
  return (
    <Box bg="green.100" py={12}>
      <Flex
        maxW="container.xl"
        mx="auto"
        direction={{ base: 'column', md: 'row' }}
        align="center"
        justify="space-between"
        px={4}
      >
        <Box mb={{ base: 6, md: 0 }}>
          <Heading as="h2" size="xl" color="green.700" mb={2}>
            Summer Sale!
          </Heading>
          <Text fontSize="lg" color="green.600">
            Get 10% off on all eco-friendly products, use code "SEPULUH".
          </Text>
        </Box>
        <Button
          size="lg"
          colorScheme="green"
          _hover={{ bg: 'green.600' }}
        >
          Shop Now
        </Button>
      </Flex>
    </Box>
  );
}