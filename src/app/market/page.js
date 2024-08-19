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
} from "@chakra-ui/react";
import MarketCard from "@/components/MarketCard";
import { Button } from "@/components/Button";
import { useState } from "react";
import { useDataPaginate } from "@/hooks/usePaginate";
import { LoadingPage } from "@/components/Loading";

export default function Market() {
  const [searchQuery, setSearchQuery] = useState("");
  const [limit, setLimit] = useState(5);
  const [name, setName] = useState("")

  const { nextPage, prevPage, data, currentPage, totalPage, error, isLoading } =
    useDataPaginate(
      `${process.env.NEXT_PUBLIC_API_URL}/markets`,
      limit,
      searchQuery
    );

  const handleSubmit = () => {
    setSearchQuery(name)
    
  }
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
            <Button onClick={handleSubmit} CTA="CARI"></Button>
          </Stack>
        </Box>
        <Box maxWidth="100%" overflowX="auto" padding={4}>
           {isLoading ? (
            <LoadingPage />
          ) : error ? (  <Box mt={10} mb={10}>
            <Alert status="error">
              <AlertIcon />
              {error.response.data.message}
            </Alert>
          </Box>) :
          data.length === 0 ? (
            <Box mt={10} mb={10}>
              <Alert status="warning">
                <AlertIcon />
                Market tidak ditemukan
              </Alert>
            </Box>
          )  : (
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
          )
        }
        </Box>
        <div className="flex flex-row justify-end items-center gap-12 mt-12">
          <Box p={4}>
            <Select
              sx={{ width: "100px" }}
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            >
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
