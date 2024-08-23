import {
  Image,
  Stack,
  Heading,
  Card,
  ButtonGroup,
  Button,
  Text,
  Flex,
  CardBody,
  CardHeader,
  CardFooter,
} from "@chakra-ui/react";
import Link from "next/link";

export default function MarketCard({ name, image, location }) {
  return (
    <Card maxW="md" maxHeight={500} height={300}>
      <CardHeader>
        <Flex spacing="2">
          <Image objectFit="cover" src={image} alt={`Market ${name} on ${location}`} />
        </Flex>
      </CardHeader>
      <CardBody>
        <Stack mt="2" spacing="1">
          <Heading size="md">{name}</Heading>
          <Text fontSize="sm">
            {location}
          </Text>
        </Stack>
      </CardBody>

    
    </Card>
  );
  
}
