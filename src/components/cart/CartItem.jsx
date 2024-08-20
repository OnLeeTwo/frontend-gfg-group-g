import React from "react";
import {
  Box,
  Flex,
  Image,
  Text,
  Button,
  VStack,
  HStack,
  Checkbox,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

const CartItem = ({
  product,
  quantity,
  onRemove,
  onQuantityChange,
  isSelected,
  onToggleSelect,
}) => {
  const toast = useToast();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > product.stock) {
      toast({
        title: "Quantity exceeds available stock",
        description: `Only ${product.stock} items available`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    onQuantityChange(newQuantity);
  };

  return (
    <Box
      bg="white"
      p={4}
      borderRadius="md"
      mb={2}
      cursor="pointer"
      onClick={onToggleSelect}
      borderWidth="1px"
      borderColor={isSelected ? "blue.500" : "gray.200"}
    >
      <Flex align="center">
        <Checkbox
          isChecked={isSelected}
          onChange={onToggleSelect}
          mr={4}
          pointerEvents="none"
        />
        <Image
          src={product.images}
          alt={product.name}
          boxSize="100px"
          objectFit="cover"
          mr={4}
        />
        <VStack align="start" flex={1}>
          <Text fontWeight="bold">{product.name}</Text>
          <Text>Category: {product.category}</Text>
          <HStack>
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleQuantityChange(quantity - 1);
              }}
              isDisabled={quantity <= 1}
            >
              -
            </Button>
            <Text>{quantity}</Text>
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleQuantityChange(quantity + 1);
              }}
              isDisabled={quantity >= product.stock}
            >
              +
            </Button>
          </HStack>
          <Text fontSize="sm" color={quantity >= product.stock ? "red.500" : "gray.500"}>
            Stock: {product.stock}
          </Text>
        </VStack>
        <VStack align="end">
          <Text fontWeight="bold">Rp{product.price.toFixed(2)}</Text>
          <Button
            leftIcon={<DeleteIcon />}
            colorScheme="red"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            Remove
          </Button>
        </VStack>
      </Flex>
    </Box>
  );
};

export default CartItem;