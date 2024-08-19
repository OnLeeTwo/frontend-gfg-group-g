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
  Select
} from "@chakra-ui/react";
import MarketCard from "@/components/MarketCard";
import { Button } from "@/components/Button";
import { useState } from "react";
import axios from "axios";
import SearchBar from "@/components/SearchBar";
import { useDataPaginate } from "@/hooks/usePaginate";
import { ErrorData } from "@/components/Error";
import { LoadingPage } from "@/components/Loading";

export default function Market() {
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(5)
  const { nextPage, prevPage, data, currentPage, totalPage, error, isLoading } =
    useDataPaginate(`${process.env.NEXT_PUBLIC_API_URL}/markets`, limit);
  const filteredItems = data.filter((item) =>
    item.market_name.toLowerCase().includes(search.toLowerCase())
  );
  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorData error={error} errorStatus="error" />;
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Flex direction={{ base: "column", md: "column" }} gap={3}>
        <Box>
          <Stack spacing={4} marginBottom="4">
            <Input
              placeholder="Search by market name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Stack>
        </Box>
        <Box maxWidth="100%" overflowX="auto" padding={4}>
          {filteredItems.length === 0 ? (
            <Box mt={10} mb={10}>
              <Alert status="warning">
                <AlertIcon />
                Market tidak ditemukan
              </Alert>
            </Box>
          ) : (
            <Grid templateColumns="repeat(5, 1fr)" gap={6}>
              {filteredItems.map((item) => (
                <div key={item}>
                  <MarketCard
                    name={item.market_name}
                    image="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                    description={""}
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
        <Select sx={{ width: '100px' }} value={limit} onChange={(e) => setLimit(e.target.value)}> 
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
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
      </Flex>
    </Container>
  );
}
