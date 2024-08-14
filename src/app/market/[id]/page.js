'use client'

import ProductCard from "@/components/ProductCard"
import SearchBar from "@/components/SearchBar"
import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  Spinner,
  Container,
  useToast,
  Grid
} from "@chakra-ui/react"
import axios from "axios"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function MarketPage() {
  const { id } = useParams()
  const [market, setMarket] = useState([])
  const toast = useToast()
  const [product, setProduct] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products_market/${id}`
        )
      
        if(res.data.success && res.data.data.length > 0 ) {
          setProduct(res.data.data)
        }else {
          setProduct([])
        }
      } catch (err) {
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }

    const fetchMarket = async() => {
      try{
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/markets/${id}`
        )

        setMarket(res.data)
      }catch(err) {
        setError(err)
      }
    }

    setTimeout(() => {
      fetchProduct()
    }, 5000)
    fetchMarket()
  }, [id])

  if (error) {
    return (
      <Flex mt={20} mb={20} alignItems='center' justifyContent='center'>
        <Alert status="error">
          <AlertIcon />
          {error.message || "An error occurred while fetching this market."}
        </Alert>
      </Flex>
    );
  }

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="80vh">
        <Spinner size="xl" />
      </Flex>
    )
  }

  if (product.length < 1) {
    return (
      <Flex mt='2' alignItems='center' justifyContent='center'>
        <Alert status="info">
          <AlertIcon />
          No Product found.
        </Alert>
      </Flex>
    );
  }

 

  return (
    <Container maxW="container.xl" py={10}>
      <SearchBar parameters={`Cari product terbaru di market ${market.market_name} ...`} />
      <Flex direction={{ base: "column", md: "column" }} gap={3}>
        <Box>
          <Grid templateColumns='repeat(5, 1fr)' gap={6}>
            {product.map((item) => (
              <div key={item}>
                <ProductCard
                  name={item.product_name}
                  image={item.images}
                  description="Ini deskripsi market"
                  location={item.location}
                  price={item.price}
                  category={item.category}
                />
              </div>
            ))
            }
          </Grid>
        </Box>
      </Flex>
    </Container>
  )
}