"use client";

import {
  Container,
  Stack,
  SimpleGrid,
  Input,
  Grid,
  Flex,
  Box,
  Alert,
  AlertIcon,
  Select,
  Checkbox,
  VStack,
  Heading,
} from "@chakra-ui/react";
import MarketCard from "@/components/MarketCard";
import { Button } from "@/components/Button";
import { useState } from "react";
import { useDataPaginate } from "@/hooks/usePaginate";
import { LoadingPage } from "@/components/Loading";
import { useBreakpointValue } from "@chakra-ui/react";
import Link from "next/link";

export default function Market() {
  const options = [5, 10, 25, 50, 100];
  const [searchQuery, setSearchQuery] = useState("");
  const [limit, setLimit] = useState(5);
  const [name, setName] = useState("");
  const [filters, setFilters] = useState({
    location: [],
  });
  const [current, setCurrent] = useState(false);

  const { nextPage, prevPage, data, currentPage, totalPage, error, isLoading } =
    useDataPaginate(
      `${process.env.NEXT_PUBLIC_API_URL}/markets`,
      limit,
      searchQuery,
      current
    );

  const handleLocationFilter = (location) => {
    setFilters((prev) => ({
      ...prev,
      location: prev.location.includes(location)
        ? prev.location.filter((l) => l !== location)
        : [...prev.location, location],
    }));
  };

  const filteredMarkets = data.filter(
    (market) =>
      filters.location.length === 0 ||
      filters.location.includes(market.location)
  );

  const handleSubmit = () => {
    setSearchQuery(name);
    setCurrent(true);
  };

  return (
    <Container maxW="container.xl" py={5}>
      <Flex direction={{ base: "column", md: "row" }}>
        <Box
          width={{ base: "100%", md: "250px" }}
          p={4}
          borderRight={{ base: "none", md: "1px" }}
          borderBottom={{ base: "1px", md: "none" }}
          borderColor="gray.200"
          mb={{ base: 4, md: 0 }}
        >
          <VStack align="stretch" spacing={6}>
            <Box>
              <Heading size="md" mb={2}>
                Filter
              </Heading>
            </Box>

            <Box>
              <Heading size="sm" mb={2}>
                Location
              </Heading>
              <VStack align="stretch">
                {[...new Set(data.map((p) => p.location))].map((location) => (
                  <Checkbox
                    key={location}
                    onChange={() => handleLocationFilter(location)}
                    isChecked={filters.location.includes(location)}
                  >
                    {location}
                  </Checkbox>
                ))}
              </VStack>
            </Box>
          </VStack>
        </Box>
        <Box width={{ base: "100%", md: "75%" }} p={4}>
          <Flex direction={{ base: "column", sm: "row" }} gap={2} mb={4}>
            <Input
              placeholder="Search by market name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button
              onClick={handleSubmit}
              CTA="CARI"
              width={{ base: "100%", sm: "auto" }}
            ></Button>
          </Flex>
          <Box mb={4}>
            {isLoading ? (
              <LoadingPage />
            ) : error ? (
              <Box mt={5} mb={5}>
                <Alert status="error">
                  <AlertIcon />
                  Market tidak ditemukan
                </Alert>
              </Box>
            ) : data.length === 0 ? (
              <Box mt={5} mb={5}>
                <Alert status="warning">
                  <AlertIcon />
                  Market tidak ditemukan
                </Alert>
              </Box>
            ) : (
              <Grid
                templateColumns={{
                  base: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(4, 1fr)",
                  xl: "repeat(5, 1fr)",
                }}
                gap={3}
              >
                {filteredMarkets.map((item) => (
                  <div key={item.market_id}>
                    <Link href={`/market/${item.market_id}`}>
                      <MarketCard
                        name={item.market_name}
                        image={item.profile_pict}
                        location={item.location}
                      />
                    </Link>
                  </div>
                ))}
              </Grid>
            )}
          </Box>
          <Flex
            direction={{ base: "column", sm: "row" }}
            justifyContent="flex-end"
            alignItems="center"
            gap={{ base: 4, sm: 12 }}
            mt={6}
          >
            <Box>
              <Select
                sx={{ width: "100px" }}
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
              >
                {options.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </Select>
            </Box>
            <Flex gap={2}>
              <Button
                CTA="Previous"
                onClick={prevPage}
                disabled={currentPage === 1}
              />
              <Button
                CTA="Next"
                onClick={nextPage}
                disabled={currentPage === totalPage}
              />
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Container>
  );
}
