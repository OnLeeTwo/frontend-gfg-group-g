import {
  Image,
  Stack,
  Heading,
  Card,
  ButtonGroup,
  Divider,
  Button,
  Text,
  CardBody,
  CardFooter,
  Tag,
  TagLabel,
  Tooltip,
} from "@chakra-ui/react";
import Link from 'next/link'

export default function ProductCard({
  name,
  description,
  image,
  market,
  price,
  stock,
  category,
  id,
}) {
  return (
    <Card maxW="sm" variant="filled" maxHeight={900}>
      <CardBody>
        <Image
          src={image}
          height="200px"
          alt={`Produk ${name}: ${description}`}
          borderRadius="lg"
        />
        <Stack mt="6" spacing="3">
          <Heading size="md">{name}</Heading>
          <Heading as="h4" size="sm">
            {market}
          </Heading>
          <Text>
            {description}
            {stock < 5 ? <p>Stock hampir habis</p> : <></>}
          </Text>
          <Tooltip label={category}>
          <Tag
            borderRadius="full"
            size="sm"
            width="min-content"
            variant="solid"
            colorScheme="green"
          >
            <TagLabel>{category}</TagLabel>
          </Tag>
          </Tooltip>
          <Text color="blue.600" fontSize="2xl">
            Rp. {price.toLocaleString()}
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <ButtonGroup spacing="2">
          <Button variant="solid" colorScheme="blue">
          <Link href={`/product/${id}`}>
                        View product
                       </Link>
          </Button>
          <Button variant="ghost" colorScheme="blue">
            add to cart
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}
