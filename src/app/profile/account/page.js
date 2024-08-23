"use client";

import React, { useEffect, useState } from "react";
import useFetchUser from "@/hooks/userFetch";
import AddressForm from "../AddressForm";
import {
  Box,
  Flex,
  VStack,
  Heading,
  Text,
  Button,
  Grid,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  Image,
  useDisclosure,
  Modal,
  ModalBody,
  ModalHeader,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import withAuth from "@/middleware/withAuth";
const UserProfile = () => {
  const toast = useToast();
  const [token, setToken] = useState(null);
  const {
    isOpen: isProfileOpen,
    onOpen: onProfileOpen,
    onClose: onProfileClose,
  } = useDisclosure();
  const {
    isOpen: isAddressOpen,
    onOpen: onAddressOpen,
    onClose: onAddressClose,
  } = useDisclosure();
  const [profilePicture, setProfilePicture] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("access_token"));
    }
  }, []);

  const { user, error, isLoading, mutate } = useFetchUser(token);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setAddresses(user.address || []);
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    if (profilePicture) {
      formData.append("profile_picture", profilePicture);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Profile updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        mutate();
        onProfileClose();
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    onAddressOpen();
  };

  const handleAddressSubmit = async (addressData) => {
    try {
      const updatedAddresses = editingAddress
        ? addresses.map((addr) =>
            addr.id === editingAddress.id ? { ...addr, ...addressData } : addr
          )
        : [...addresses, { ...addressData, id: Date.now() }];

      const formData = new FormData();
      formData.append("address", JSON.stringify(updatedAddresses));

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Updated addresses:", data.addresses);
        toast({
          title: `Address ${editingAddress ? "updated" : "added"} successfully`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        mutate();
        onAddressClose();
        setEditingAddress(null);
      } else {
        throw new Error(
          `Failed to ${editingAddress ? "update" : "add"} address`
        );
      }
    } catch (error) {
      toast({
        title: `Error ${editingAddress ? "updating" : "adding"} address`,
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteAddress = async (addressToDelete) => {
    try {
      const updatedAddresses = addresses.filter(
        (addr) => addr !== addressToDelete
      );

      const formData = new FormData();
      formData.append("address", JSON.stringify(updatedAddresses));

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Address deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        mutate();
      } else {
        throw new Error("Failed to delete address");
      }
    } catch (error) {
      toast({
        title: "Error deleting address",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="80vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box mt={10}>
        <Alert status="error">
          <AlertIcon />
          {error.message || "An error occurred while fetching user data."}
        </Alert>
      </Box>
    );
  }

  const isPlaceholderImage =
    user.profile_picture && user.profile_picture.endsWith("None");

  const imageUrl = isPlaceholderImage
    ? "/default_placeholder_user.jpg"
    : user.profile_picture;

  return (
    <div>
      <VStack align="stretch" spacing={8}>
        <Heading as="h1" size="xl">
          Account Main
        </Heading>

        <Flex>
          <Image
            src={imageUrl}
            alt="Profile Picture"
            width={125}
            height={125}
            layout="responsive"
            objectFit="cover"
          />
          <Box ml={4}>
            <Heading as="h2" size="md">
              {user.name || "Mr. Anonymous"}
            </Heading>
            <Text>Email: {user.email || "No email provided"}</Text>
            <Button onClick={onProfileOpen} mt={2}>
              Edit Profile
            </Button>
          </Box>
        </Flex>

        <Box>
          <Heading as="h3" size="md" mb={4}>
            Addresses
          </Heading>
          <Button
            onClick={() => {
              setEditingAddress(null);
              onAddressOpen();
            }}
            mb={6}
          >
            + Add New Address
          </Button>
          <Grid
            templateColumns={{
              base: "1fr",
              md: "1fr 1fr",
              lg: "1fr 1fr 1fr",
            }}
            gap={4}
          >
            {addresses.map((address) => (
              <Box
                key={address.id}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                p={4}
                bg="white"
                shadow="md"
              >
                <Heading as="h4" size="sm">
                  {`${address.first_name} ${address.last_name}`}
                </Heading>
                <Text mt={2}>Phone: {address.phone_number}</Text>
                <Text mt={2}>
                  {`${address.full_address}, ${address.city}, ${address.zip_code}`}
                </Text>
                <Flex mt={4}>
                  <Button
                    size="sm"
                    onClick={() => handleEditAddress(address)}
                    mr={2}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDeleteAddress(address)}
                  >
                    Delete
                  </Button>
                </Flex>
              </Box>
            ))}
          </Grid>
        </Box>
      </VStack>

      <Modal isOpen={isProfileOpen} onClose={onProfileClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleProfileUpdate}>
              <FormControl>
                <FormLabel>Profile Picture</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePicture(e.target.files[0])}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Name</FormLabel>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </FormControl>
              <Button mt={4} colorScheme="blue" type="submit">
                Update Profile
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <AddressForm
        isOpen={isAddressOpen}
        onClose={() => {
          onAddressClose();
          setEditingAddress(null);
        }}
        onSubmit={handleAddressSubmit}
        initialData={editingAddress}
      />
    </div>
  );
};

export default withAuth(UserProfile, "buyer");
