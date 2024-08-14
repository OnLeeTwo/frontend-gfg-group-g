"use client";

import {
  Container,
  Input,
  InputRightAddon,
  Grid,
  Button,
  Text,
  Heading,
  Spinner,
  Flex,
  Box,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import MarketCard from "@/components/MarketCard";
import axios from "axios";
import SearchBar from "@/components/SearchBar";

export default function Market() {
  const [market, setMarket] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchMarket = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/markets`
        );
        console.log(res);
        if (res.data.success && res.data.data.length > 0) {
          setMarket(res.data.data);
        } else {
          setMarket([]);
        }
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarket();
  }, []);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="80vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box mt={10} mb={10}>
        <Alert status="error">
          <AlertIcon />
          {error.message || "An error occurred while fetching this market."}
        </Alert>
      </Box>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Flex direction={{ base: "column", md: "column" }} gap={3}>
        <Box>
          <SearchBar parameters={"Cari market terdekat"} />
        </Box>
        <Box>
            <Grid templateColumns='repeat(5, 1fr)' gap={6}>
                {market.map((item) => (
                    <div key={item}>
                        <MarketCard 
                            name={item.market_name}
                            image='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
                            description={""}
                            location={item.location}
                            id={item.market_id}
                        />
                    </div>
                ))}
            </Grid>
        </Box>
      </Flex>
    </Container>
  );
}
