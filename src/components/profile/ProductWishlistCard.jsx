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
        maxW="200px"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        shadow="md"
        >
        <Image src={images} alt={name} />

        <VStack align="start" p={3} spacing={1}>
            <Text fontSize="sm" fontWeight="semibold" noOfLines={2}>
            {name}
            </Text>
            <Text fontWeight="bold" color="red.500">
            Rp{price.toLocaleString()}
            </Text>
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