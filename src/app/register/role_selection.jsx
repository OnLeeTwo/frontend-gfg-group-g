import React from 'react';
import { Box, VStack, Heading, Button, Image, Container } from '@chakra-ui/react';

const RoleSelection = ({ onSelect }) => {
  return (
    <Container maxW="container.sm">
      <VStack spacing={8} mt={16}>
        <Heading as="h1" size="xl" textAlign="center">
          What&apos;s your purpose to use this website?
        </Heading>
        <Box display="flex" justifyContent="center" gap={8}>
          <Button
            onClick={() => onSelect('buyer')}
            variant="outline"
            height="240px"
            width="240px"
            flexDirection="column"
          >
            <Image src="/buyer_icon.svg" alt="Buyer" boxSize="50px" mb={2} />
            I want to be a buyer
          </Button>
          <Button
            onClick={() => onSelect('seller')}
            variant="outline"
            height="240px"
            width="240px"
            flexDirection="column"
          >
            <Image src="/seller_icon.svg" alt="Seller" boxSize="50px" mb={2} />
            I want to be a seller
          </Button>
        </Box>
      </VStack>
    </Container>
  );
};

export default RoleSelection;