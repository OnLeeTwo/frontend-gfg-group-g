"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import useFetchUser from "@/hooks/userFetch";
import {
  Box,
  Flex,
  Spinner,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  Divider,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormErrorMessage,
} from "@chakra-ui/react";
import withAuth from "@/middleware/withAuth";

const UpdateSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Password must be at least 6 characters"),
});

const AccountSettings = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [token, setToken] = useState(null);
  const [actionType, setActionType] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("access_token"));
    }
  }, []);

  const { user, mutate, isLoading, error } = useFetchUser(token);

  const handleAccountUpdate = async (values, actions) => {
    const formData = new FormData();
    formData.append("email", values.email);
    if (values.password) {
      formData.append("password", values.password);
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
          title: "Account updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        mutate();
      } else {
        throw new Error("Failed to update account");
      }
    } catch (error) {
      toast({
        title: "Error updating account",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    actions.setSubmitting(false);
  };

  const handleCriticalAction = async () => {
    onClose();
    if (actionType === "delete") {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          toast({
            title: "Account deleted successfully",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          mutate();
        } else {
          throw new Error("Failed to delete account");
        }
      } catch (error) {
        toast({
          title: "Error deleting account",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const openConfirmationModal = (type) => {
    setActionType(type);
    onOpen();
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
        <Text color="red.500">
          {error.message || "An error occurred while fetching user data."}
        </Text>
      </Box>
    );
  }

  return (
    <Box maxWidth="600px" margin="auto" padding={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Account Information
          </Text>
          <Text>
            <strong>Email:</strong> {user.email}
          </Text>
        </Box>

        <Divider />

        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Update Account
          </Text>
          <Formik
            initialValues={{
              email: user.email || "",
              password: "",
            }}
            validationSchema={UpdateSchema}
            onSubmit={handleAccountUpdate}
          >
            {(props) => (
              <Form>
                <VStack spacing={4}>
                  <Field name="email">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.email && form.touched.email}
                      >
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input {...field} id="email" placeholder="Email" />
                        <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="password">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.password && form.touched.password
                        }
                      >
                        <FormLabel htmlFor="password">
                          Password (optional)
                        </FormLabel>
                        <Input
                          {...field}
                          type="password"
                          id="password"
                          placeholder="Unchanged if left blank"
                        />
                        <FormErrorMessage>
                          {form.errors.password}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Button
                    mt={4}
                    colorScheme="blue"
                    isLoading={props.isSubmitting}
                    type="submit"
                  >
                    Update Account
                  </Button>
                </VStack>
              </Form>
            )}
          </Formik>
        </Box>

        <Divider />

        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Danger Zone
          </Text>
          <Button
            colorScheme="red"
            onClick={() => openConfirmationModal("delete")}
          >
            Delete Account
          </Button>
        </Box>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Confirm {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to {actionType} your account? This action
            cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={handleCriticalAction}>
              Confirm
            </Button>
            <Button variant="ghost" onClick={onClose} ml={3}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default withAuth(AccountSettings, "buyer");
