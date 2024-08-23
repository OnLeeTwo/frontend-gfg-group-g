"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Container,
  Box,
  Select,
  FormErrorMessage,
  Heading,
  useToast,
} from "@chakra-ui/react";

import RoleSelection from "./role_selection";

const validationSchema = Yup.object({
  email: Yup.string()
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address")
    .required("Required"),
  password: Yup.string()
    .min(8, "Must be at least 8 characters")
    .required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
  acceptedTerms: Yup.boolean()
    .oneOf([true], "You must accept the terms and conditions")
    .required("Required"),
  over18YearsOld: Yup.boolean()
    .oneOf([true], "You must be over 18 years old")
    .required("Required"),
  role: Yup.string().required("Required"),
});

export default function Register() {
  const [showForm, setShowForm] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      acceptedTerms: false,
      over18YearsOld: false,
      role: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const formData = new FormData();
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("role", values.role);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();

        if (response.ok) {
          toast({
            title: "Registration Successful",
            description: data.message,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          router.push("/login?firstTimeLogin=true");
        } else {
          throw new Error(data.error || "Registration failed");
        }
      } catch (error) {
        toast({
          title: "Registration Failed",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleRoleSelect = (role) => {
    formik.setFieldValue("role", role);
    setShowForm(true);
  };

  if (!showForm) {
    return <RoleSelection onSelect={handleRoleSelect} />;
  }

  return (
    <Container maxW="container.sm">
      <Box mt={16} mb={8}>
        <Heading as="h1" size="xl" mb={8}>
          Register to SucoMart
        </Heading>
        <form onSubmit={formik.handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={formik.touched.role && formik.errors.role}>
              <FormLabel htmlFor="role">Role</FormLabel>
              <Select
                id="role"
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </Select>
              <FormErrorMessage>{formik.errors.role}</FormErrorMessage>
            </FormControl>

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

            <FormControl
              isInvalid={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
            >
              <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                onChange={formik.handleChange}
                value={formik.values.confirmPassword}
              />
              <FormErrorMessage>
                {formik.errors.confirmPassword}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={
                formik.touched.acceptedTerms && formik.errors.acceptedTerms
              }
            >
              <Checkbox
                id="acceptedTerms"
                name="acceptedTerms"
                isChecked={formik.values.acceptedTerms}
                onChange={formik.handleChange}
              >
                I accept the terms and conditions
              </Checkbox>
              <FormErrorMessage>{formik.errors.acceptedTerms}</FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={
                formik.touched.over18YearsOld && formik.errors.over18YearsOld
              }
            >
              <Checkbox
                id="over18YearsOld"
                name="over18YearsOld"
                isChecked={formik.values.over18YearsOld}
                onChange={formik.handleChange}
              >
                I am over 18 years old
              </Checkbox>
              <FormErrorMessage>
                {formik.errors.over18YearsOld}
              </FormErrorMessage>
            </FormControl>

            <Button mt={4} colorScheme="green" type="submit">
              Register
            </Button>
          </VStack>
        </form>
      </Box>
    </Container>
  );
}
