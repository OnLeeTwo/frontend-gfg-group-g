'use client'

import Link from 'next/link'
import { useLogout } from '../hooks/logout'
import { useAuth } from '../hooks/authContext'
import React from 'react'
import {
  Box,
  Flex,
  HStack,
  Button,
  Image,
  useColorModeValue,
  Container,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  VStack,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'

function Navbar() {
  const { isLoggedIn, role } = useAuth();
  const logout = useLogout();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const profileLink = role === 'seller' ? '/seller' : '/profile';

  return (
    <Box as="nav" bg={useColorModeValue('#92c529', 'gray.800')} py={4} shadow="md" position="sticky" top={0} zIndex={10}>
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center">
          <Link href="/" passHref>
            <Image src="/logo.png" alt="SucoMart logo" h="50px" />
          </Link>
          
          {/* Desktop Menu */}
          <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
            <NavLink href="/">Home</NavLink>
            <NavLink href="/product">Product</NavLink>
            <NavLink href="/market">Market</NavLink>
            <NavLink href="/about">About</NavLink>
            {isLoggedIn ? (
              <>
                <NavLink href="/cart">Cart</NavLink>
                <NavLink href={profileLink}>Profile</NavLink>
                <Button
                  onClick={logout}
                  variant="ghost"
                  colorScheme="green"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <NavLink href="/login">Login</NavLink>
                <NavLink href="/register" isButton>Register</NavLink>
              </>
            )}
          </HStack>

          {/* Mobile Menu */}
          <IconButton
            aria-label="Open Menu"
            size="lg"
            mr={2}
            icon={<HamburgerIcon />}
            onClick={onOpen}
            display={{ base: 'flex', md: 'none' }}
          />
        </Flex>
      </Container>

      {/* Mobile Drawer */}
      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            <Flex justify="space-between" align="center">
              Menu
              <IconButton
                aria-label="Close Menu"
                size="sm"
                icon={<CloseIcon />}
                onClick={onClose}
              />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch">
              <NavLink href="/" onClick={onClose}>Home</NavLink>
              <NavLink href="/product" onClick={onClose}>Product</NavLink>
              <NavLink href="/market" onClick={onClose}>Market</NavLink>
              <NavLink href="/about" onClick={onClose}>About</NavLink>
              {isLoggedIn ? (
                <>
                  <NavLink href="/cart" onClick={onClose}>Cart</NavLink>
                  <NavLink href={profileLink} onClick={onClose}>Profile</NavLink>
                  <Button
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    variant="ghost"
                    colorScheme="green"
                    justifyContent="flex-start"
                    width="100%"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <NavLink href="/login" onClick={onClose}>Login</NavLink>
                  <NavLink href="/register" onClick={onClose} isButton>Register</NavLink>
                </>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}

const NavLink = ({ children, href, onClick, isButton = false }) => {
  const content = (
    <Button
      as={isButton ? 'button' : 'span'}
      variant={isButton ? "solid" : "ghost"}
      colorScheme="green"
      onClick={onClick}
      justifyContent="flex-start"
      width="100%"
    >
      {children}
    </Button>
  );

  return (
    <Link href={href} passHref>
      {content}
    </Link>
  );
}

export default Navbar