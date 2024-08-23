"use client";

import Head from "next/head";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  UnorderedList,
  ListItem,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";

export default function About() {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.600", "gray.200");
  const headingColor = useColorModeValue("gray.800", "white");

  return (
    <>
      <Head>
        <title>About Us - SucoMart</title>
        <meta
          name="description"
          content="Learn about SucoMart, your gateway to sustainable and locally crafted products."
        />
      </Head>
      <Box bg={bgColor} minHeight="100vh">
        <Container maxW="container.lg" pt={10} pb={20}>
          <VStack spacing={10} align="stretch">
            <Heading as="h1" size="2xl" color={headingColor}>
              About Us
            </Heading>

            <Text fontSize="lg" color={textColor}>
              Welcome to SucoMart, your gateway to discovering sustainable and
              locally crafted products. If you&aposre searching for something
              new that makes a difference, you&apos;ve arrived at the right
              place. Our marketplace celebrates innovation while championing
              local artisans and eco-friendly brands. Each item in our curated
              collection is not only designed with sustainability in mind but
              also supports small businesses that are committed to ethical and
              green practices. Whether it&apos;s unique, locally sourced goods
              or the latest in sustainable living, we bring you products that
              are both fresh and impactful. Explore a new way to shop—one that
              values creativity, community, and the planet.
            </Text>

            <Box>
              <Heading as="h2" size="xl" mb={4} color={headingColor}>
                Our Commitment
              </Heading>
              <Text color={textColor}>
                At SucoMart, we&apos;re passionate about making sustainable and
                eco-friendly products accessible to everyone. Founded in 2024,
                our mission is to create a marketplace where conscious consumers
                can find high-quality, environmentally responsible goods that
                align with their values.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="xl" mb={4} color={headingColor}>
                What We Offer
              </Heading>
              <UnorderedList spacing={2} pl={5} color={textColor}>
                <ListItem>
                  A diverse range of eco-friendly products, from everyday
                  essentials to unique, handcrafted items
                </ListItem>
                <ListItem>
                  Rigorous vetting process to ensure all products meet our
                  sustainability standards
                </ListItem>
                <ListItem>
                  Transparent information about each product&apos;s
                  environmental impact and origins
                </ListItem>
                <ListItem>
                  Educational resources to help our customers make informed
                  choices
                </ListItem>
              </UnorderedList>
            </Box>

            <Box>
              <Heading as="h2" size="xl" mb={4} color={headingColor}>
                Our Impact
              </Heading>
              <Text color={textColor} mb={4}>
                By choosing SucoMart, you&apos;re not just shopping –
                you&apos;re contributing to a larger movement. We&apos;re proud
                to report that our efforts have:
              </Text>
              <UnorderedList spacing={2} pl={5} color={textColor}>
                <ListItem>Reduced plastic waste by 50 tons annually</ListItem>
                <ListItem>
                  Supported over 100 small-scale, sustainable producers
                </ListItem>
                <ListItem>
                  Offset 1000 tons of carbon emissions through our partnerships
                </ListItem>
              </UnorderedList>
            </Box>

            <Box>
              <Heading as="h2" size="xl" mb={4} color={headingColor}>
                Join Our Community
              </Heading>
              <Text color={textColor} mb={6}>
                We invite you to explore our marketplace and join a community of
                like-minded individuals who are committed to living more
                sustainably. Together, we can create positive change for our
                planet, one purchase at a time.
              </Text>
              <Button colorScheme="green" size="lg">
                Shop Now
              </Button>
            </Box>
          </VStack>
        </Container>
      </Box>
    </>
  );
}
