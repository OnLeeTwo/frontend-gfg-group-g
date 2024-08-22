import { useState, useEffect } from 'react';
import { Box, Image, Flex, Button } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

const banners = [
  { id: 1, image: 'banner/banner-1.webp', alt: 'Green initiatives' },
  { id: 2, image: '/banner2.jpg', alt: 'Sustainable living' },
  { id: 3, image: '/banner3.jpg', alt: 'Eco-friendly products' },
];

export default function BannerCarousel() {
  const [currentBanner, setCurrentBanner] = useState(0);

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
      <Button
        position="absolute"
        left="10px"
        top="50%"
        transform="translateY(-50%)"
        onClick={prevBanner}
      >
        <ChevronLeftIcon />
      </Button>
      <Button
        position="absolute"
        right="10px"
        top="50%"
        transform="translateY(-50%)"
        onClick={nextBanner}
      >
        <ChevronRightIcon />
      </Button>
    </Box>
  );
}