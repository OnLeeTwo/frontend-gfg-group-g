import { useState, useEffect } from 'react';
import { Box, Image, Flex, Button, VStack, Text } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';

const banners = [
  { id: 1, image: 'banner/banner-1.webp', alt: 'Green initiatives' },
  { id: 2, image: 'banner/banner-2.webp', alt: 'Eco-friendly products' },
  { id: 3, image: 'banner/banner-3.webp', alt: 'Sustainable living' },
];

export default function BannerCarousel() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <Box
      position="relative"
      height={{ base: "200px", md: "400px", lg: "500px" }}
      overflow="hidden"
    >
      {banners.map((banner, index) => (
        <Image
          key={banner.id}
          src={banner.image}
          alt={banner.alt}
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          objectFit="cover"
          opacity={index === currentBanner ? 1 : 0}
          transition="opacity 0.5s ease-in-out"
        />
      ))}
      
      <Flex
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        alignItems="center"
        justifyContent="center"
        backgroundColor="rgba(0,0,0,0.4)"
      >
        <VStack spacing={{ base: 4, md: 6 }}>
          <Text
            color="white"
            fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
            fontWeight="bold"
            textAlign="center"
            px={4}
          >
            Welcome to SucoMart
          </Text>
          <Button
            colorScheme="green"
            size={{ base: "md", md: "lg" }}
            onClick={() => {
              router.push("/market");
            }}
          >
            Shop Now
          </Button>
        </VStack>
      </Flex>

      {/* Indicator dots */}
      <Flex
        position="absolute"
        bottom="20px"
        left="50%"
        transform="translateX(-50%)"
      >
        {banners.map((_, index) => (
          <Box
            key={index}
            width="10px"
            height="10px"
            borderRadius="50%"
            bg={index === currentBanner ? 'white' : 'whiteAlpha.600'}
            mx="2px"
            cursor="pointer"
            onClick={() => setCurrentBanner(index)}
          />
        ))}
      </Flex>

      {/* Navigation buttons */}
      <Button
        position="absolute"
        left="10px"
        top="50%"
        transform="translateY(-50%)"
        onClick={prevBanner}
        size={{ base: "sm", md: "md" }}
        display={{ base: "none", md: "flex" }}
      >
        <ChevronLeftIcon />
      </Button>
      <Button
        position="absolute"
        right="10px"
        top="50%"
        transform="translateY(-50%)"
        onClick={nextBanner}
        size={{ base: "sm", md: "md" }}
        display={{ base: "none", md: "flex" }}
      >
        <ChevronRightIcon />
      </Button>
    </Box>
  );
}