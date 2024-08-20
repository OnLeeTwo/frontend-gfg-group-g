import { Box, Text, Link, Heading, Image, Stack } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box as="footer" bg='#92c529' color="white" py={10} px={5}>
      <Stack
        direction={{ base: 'column', md: 'row' }}
        spacing={10}
        justify="space-between"
        className="main-footer"
      >
        <Box className="our-office">
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
        </Box>
        <Box className="hiring">
          <Heading as="h4" size="md" mb={4}>
            We're Hiring!
          </Heading>
          <Text mb={4}>
            We're hiring for Software Engineer and many more! If you are interested in
            working with us, simply send your CV and diploma to:{' '}
            <Link href="mailto:hrd@sucomart.com?subject=Job Application" color="teal.300">
              hrd@sucomart.com
            </Link>
          </Text>
        </Box>
        <Box className="company">
          <Heading as="h4" size="md" mb={4}>
            <Image src="/logo.png" alt="sucomart logo" boxSize="200px"
          objectFit="cover" mr={2} />
          </Heading>
          <Stack spacing={2} mb={4}>
            <Link href="#" color="teal.300">
              About
            </Link>
            <Link href="#" color="teal.300">
              Contact
            </Link>
            <Link href="#" color="teal.300">
              Terms and Condition
            </Link>
            <Link href="#" color="teal.300">
              Licensing
            </Link>
          </Stack>
          <Text fontSize="sm">
            Sucomart&copy; logo and Sucomart Market&copy; is
            a trademark registered by Group G. All rights reserved.
          </Text>
        </Box>
      </Stack>
      <Box className="copyright-footer" mt={10} textAlign="center">
        <Text>&copy;2024 Sucomart</Text>
      </Box>
    </Box>
  );
};

export default Footer;
