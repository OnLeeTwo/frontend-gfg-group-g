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

  console.log(data);
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
    <Container maxW="container.xl" py={10}>
      <Flex>
        <Box width="250px" p={4} borderRight="1px" borderColor="gray.200">
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
                {/* Dynamically generate checkboxes based on unique categories */}
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
        <Box width="75%" p={4}>
          <Flex direction="row" gap={2} mb={4}>
            <Input
              placeholder="Search by market name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button onClick={handleSubmit} CTA="CARI"></Button>
          </Flex>
          <Flex direction="row" gap={2} mb={4}>
            <Box columns={5} spacing={4}>
              {isLoading ? (
                <LoadingPage />
              ) : error ? (
                <Box mt={10} mb={10}>
                  <Alert status="error">
                    <AlertIcon />
                    Market tidak ditemukan
                  </Alert>
                </Box>
              ) : data.length === 0 ? (
                <Box mt={10} mb={10}>
                  <Alert status="warning">
                    <AlertIcon />
                    Market tidak ditemukan
                  </Alert>
                </Box>
              ) : (
                <Grid templateColumns="repeat(6, 1fr)" gap={3}>
                  {filteredMarkets.map((item) => (
                    <div key={item.market_id}>
                      <Link href={`/market/${item.market_id}`}>
                        <MarketCard
                          name={item.market_name}
                          image={item.profile_pict}
                          location={item.location}
                        />{" "}
                      </Link>
                    </div>
                  ))}
                </Grid>
              )}
            </Box>
          </Flex>
          <div className="flex flex-row justify-end items-center gap-12 mt-12">
            <Box p={4}>
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
            <Button
              CTA="Previous"
              onClick={prevPage}
              disabled={currentPage === 1 && true}
            />
            <Button
              CTA="Next"
              onClick={nextPage}
              disabled={currentPage === totalPage && true}
            />
          </div>
        </Box>
      </Flex>
    </Container>
  );
}
