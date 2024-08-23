import {
  Image,
  Stack,
  Heading,
  Card,
  Text,
  Flex,
  CardBody,
  CardHeader,
  Box,
} from "@chakra-ui/react";

export default function MarketCard({ name, image, location }) {
  function isImageURL(url) {
    const fileExtensions = ['.png', '.jpg', '.jpeg'];
    return fileExtensions.some(extension => url.toLowerCase().endsWith(extension));
  }

  const imageUrl = isImageURL(image) ? image : `/default_placeholder_market.jpg`;

  return (
    <Card maxW="sm" height="100%">
      <CardHeader p={0}>
        <Box height="200px" width="100%">
          <Image
            objectFit="cover"
            src={imageUrl}
            alt={`Market ${name} on ${location}`}
            width="100%"
            height="100%"
          />
        </Box>
      </CardHeader>
      <CardBody>
        <Stack spacing="3">
          <Heading size="md">{name}</Heading>
          <Text fontSize="sm">{location}</Text>
        </Stack>
      </CardBody>
    </Card>
  );
}