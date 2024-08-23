"use client";

import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Container,
  Box,
  Heading,
  FormErrorMessage,
  useToast,
  Text,
  Link,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/authContext";

const validationSchema = Yup.object({
  email: Yup.string()
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address")
    .required("Required"),
  password: Yup.string().required("Required"),
});

export default function Login() {
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setIsLoggedIn } = useAuth();
  const [isFirstTimeLogin, setIsFirstTimeLogin] = useState(false);

  useEffect(() => {
    const firstTimeLogin = searchParams.get("firstTimeLogin");
    setIsFirstTimeLogin(firstTimeLogin === "true");
  }, [searchParams]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,

    onSubmit: async (values, { setSubmitting }) => {
      try {
        const formData = new FormData();
        formData.append("email", values.email);
        formData.append("password", values.password);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/login`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();

        if (response.ok) {
          toast({
            title: "Login Successful",
            description: "You've been successfully logged in.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);
          setIsLoggedIn(true);

          if (isFirstTimeLogin) {
            router.push("/profile/account");
          } else {
            router.push("/home");
          }
        } else {
          throw new Error(data.error || "Login failed");
        }
      } catch (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Container maxW="container.sm">
      <Box mt={16} mb={8}>
        <Heading as="h1" size="xl" mb={8} textAlign="center">
          Login
        </Heading>
        <form onSubmit={formik.handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl
              isInvalid={formik.touched.email && formik.errors.email}
            >
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                name="email"
                type="email"
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={formik.touched.password && formik.errors.password}
            >
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                id="password"
                name="password"
                type="password"
                onChange={formik.handleChange}
                value={formik.values.password}
              />
              <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
            </FormControl>

            <Button
              mt={4}
              colorScheme="green"
              type="submit"
              isLoading={formik.isSubmitting}
              loadingText="Logging In"
              width="100%"
            >
              Login
            </Button>
          </VStack>
        </form>
        <Text mt={4} textAlign="center">
          Don&apos;t have an account?{" "}
          <Link as={NextLink} href="/register" color="blue.500">
            Register here
          </Link>
        </Text>
      </Box>
    </Container>
  );
}
