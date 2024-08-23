import { Box, Text, Link, Heading, Image, Stack, Grid, GridItem, HStack, Container, Flex } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box as="footer" bg='#92c529' color="white" py={10}>
      <Container maxW="1280px" px={5}>
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }} gap={10}>
          <GridItem>
            <Heading as="h4" size="md" mb={4}>
              Our Main Office
            </Heading>
            <Box
              as="iframe"
              title="Main Office Maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5026.131365189473!2d116.70549051849025!3d-0.9728806455918307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2df6c9a9138990fd%3A0x593aee2ae36416b6!2sTitik%20Nol%20IKN%20Nusantara!5e0!3m2!1sen!2sid!4v1723727782080!5m2!1sen!2sid"
              border="0"
              w="100%"
              h="200px"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              mb={4}
            />
            <Text>+62-123-456-789</Text>
            <Text>Ibu Kota Nusantara</Text>
          </GridItem>

          <GridItem>
            <Stack spacing={4}>
              <Box>
                <Heading as="h4" size="md" mb={2}>
                  Sucomart
                </Heading>
                <Stack spacing={1}>
                  <Link href="/about">About Sucomart</Link>
                  <Link href="#">Career</Link>
                  <Link href="#">Blog</Link>
                </Stack>
              </Box>
              <Box>
                <Heading as="h4" size="md" mb={2}>
                  Guide and Help
                </Heading>
                <Stack spacing={1}>
                  <Link href="#">Sucomart Care</Link>
                  <Link href="#">Terms and Condition</Link>
                  <Link href="#">Privacy</Link>
                </Stack>
              </Box>
            </Stack>
          </GridItem>

          <GridItem>
            <Flex direction="column" align="center">
              <Image src="/logo_slogan.png" alt="sucomart logo" boxSize="250px" objectFit="contain" mb={4} />
              <Box>
                <Heading as="h4" size="md" mb={2} textAlign="center">
                  Follow Us
                </Heading>
                <HStack spacing={2} mb={4} justify="center">
                  <Image src="../icons/facebook-icon.svg" alt="Facebook" boxSize="30px" />
                  <Image src="../icons/x-icon.svg" alt="XTwitter" boxSize="30px" />
                  <Image src="../icons/youtube-icon.svg" alt="Youtube" boxSize="30px" />
                  <Image src="../icons/instagram-icon.svg" alt="Instagram" boxSize="30px" />
                </HStack>
              </Box>
              <HStack spacing={2} align="center">
                <Image src="../badge/google-play.png" alt="Get it on Google Play" h="40px" />
                <Image src="../badge/app-store.png" alt="Download on the App Store" h="40px" />
              </HStack>
            </Flex>
          </GridItem>
        </Grid>

        <Box mt={10} textAlign="center">
          <Text>&copy; 2024, PT. Sucomart Maju Jaya.</Text>
          <Text> All rights reserved.</Text>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;