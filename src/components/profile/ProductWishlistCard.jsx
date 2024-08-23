import React from 'react';
import Link from 'next/link';
import {
  Box,
  Image,
  Text,
  VStack,
  Flex,
} from '@chakra-ui/react';

const ProductWishlistCard = ({ id, name, images, price, stock }) => {
  return (
    <Link href={`/product/${id}`} passHref>
      <Box
        width="200px"
        height="300px"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        shadow="md"
        display="flex"
        flexDirection="column"
      >
        <Box height="200px" overflow="hidden">
          <Image 
            src={images} 
            alt={name} 
            objectFit="cover"
            width="100%"
            height="100%"
          />
        </Box>

        <VStack 
          align="start" 
          p={3} 
          spacing={1} 
          flex={1} 
          justifyContent="space-between"
        >
          <Box>
            <Text 
              fontSize="sm" 
              fontWeight="semibold" 
              noOfLines={2}
              height="40px"
            >
              {name}
            </Text>
            <Text fontWeight="bold" color="red.500">
              Rp{price.toLocaleString()}
            </Text>
          </Box>
          <Flex justify="space-between" width="100%">
            <Text fontSize="xs" color="gray.500">
              {stock < 5 ? 'Stock hampir habis' : 'Stock tersedia'}
            </Text>
          </Flex>
        </VStack>
      </Box>
    </Link>
  );
};

export default ProductWishlistCard;