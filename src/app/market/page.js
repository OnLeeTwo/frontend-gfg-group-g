"use client";

import {
  Container,
  Stack,
  Input,
  Grid,
  Flex,
  Box,
  Alert,
  AlertIcon,
  Select,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import MarketCard from "@/components/MarketCard";
import { Button as ButtonSearch } from "@/components/Button";
import { useState } from "react";
import { useDataPaginate } from "@/hooks/usePaginate";
import { LoadingPage } from "@/components/Loading";
import { ChevronDownIcon } from "@chakra-ui/icons";

export default function Market() {
  const [searchQuery, setSearchQuery] = useState("");
  const [limit, setLimit] = useState(5);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const PaginateNumber = [5, 10, 25, 50, 100]
  

  const handleCheck = (value) => {
    setCheckedItems((prev) => {
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value];
    });
  };

  const { nextPage, prevPage, data, currentPage, totalPage, error, isLoading } =
    useDataPaginate(
      `${process.env.NEXT_PUBLIC_API_URL}/markets`,
      '',
      limit,
      searchQuery,
      locationQuery
    );

  const handleSubmit = () => {
    setSearchQuery(name);
    setLocationQuery(location);
  };
  return (
    <Container maxW="container.xl" py={10}>
      <Flex direction={{ base: "column", md: "column" }} gap={3}>
        <Box>
          <Stack spacing={4} marginBottom="4" direction="row">
            <Input
              placeholder="Search by market name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {/* <Input
              placeholder="Search by market name"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            /> */}
          
            <ButtonSearch onClick={handleSubmit} CTA="CARI"></ButtonSearch>
          </Stack>
        </Box>
        <Box maxWidth="100%" overflowX="auto" padding={4}>
          {isLoading ? (
            <LoadingPage />
          ) : error ? (
            <Box mt={10} mb={10}>
              <Alert status="error">
                <AlertIcon />
                {"Market tidak ditemukan"}
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
            <Grid templateColumns="repeat(3, 1fr)" gap={3}>
              {data.map((item) => (
                <div key={item.market_id}>
                  <MarketCard
                    name={item.market_name}
                    image={item.profile_pict}
                    location={item.location}
                    id={item.market_id}
                  />
                </div>
              ))}
            </Grid>
          )}
        </Box>
        <div className="flex flex-row justify-end items-center gap-12 mt-12">
          <Box p={4}>
            <Select
              sx={{ width: "100px" }}
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            >
              {PaginateNumber.map((number) => (
                <option key={number} value={number}>{number}</option>
              ))}
            </Select>
          </Box>
          <ButtonSearch
            CTA="Previous"
            onClick={prevPage}
            disabled={currentPage === 1 && true}
          />
          <ButtonSearch
            CTA="Next"
            onClick={nextPage}
            disabled={currentPage === totalPage && true}
          />
        </div>
      </Flex>
    </Container>
  );
}
