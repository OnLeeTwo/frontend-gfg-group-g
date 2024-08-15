import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  FormErrorMessage,
} from '@chakra-ui/react';

const AddressSchema = Yup.object().shape({
  first_name: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  last_name: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  phone_number: Yup.string()
    .matches(/^\+?[0-9-]+$/, "Must be a valid phone number")
    .min(10, 'Too Short!')
    .max(20, 'Too Long!')
    .required('Required'),
  full_address: Yup.string()
    .min(5, 'Too Short!')
    .max(255, 'Too Long!')
    .required('Required'),
  zip_code: Yup.string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(5, 'Too Short!')
    .max(10, 'Too Long!')
    .required('Required'),
  city: Yup.string()
    .min(2, 'Too Short!')
    .max(100, 'Too Long!')
    .required('Required'),
});

const AddressForm = ({ isOpen, onClose, onSubmit, initialData }) => {
  const isEditing = initialData && initialData.id;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEditing ? 'Edit Address' : 'Add New Address'}</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={{
            first_name: initialData?.first_name || '',
            last_name: initialData?.last_name || '',
            phone_number: initialData?.phone_number || '',
            full_address: initialData?.full_address || '',
            zip_code: initialData?.zip_code || '',
            city: initialData?.city || '',
          }}
          validationSchema={AddressSchema}
          onSubmit={(values, actions) => {
            onSubmit(values);
            actions.setSubmitting(false);
            onClose();
          }}
        >
          {(props) => (
            <Form>
              <ModalBody>
                <VStack spacing={4}>
                  <Field name="first_name">
                    {({ field, form }) => (
                      <FormControl isInvalid={form.errors.first_name && form.touched.first_name}>
                        <FormLabel htmlFor="first_name">First Name</FormLabel>
                        <Input {...field} id="first_name" placeholder="First Name" />
                        <FormErrorMessage>{form.errors.first_name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="last_name">
                    {({ field, form }) => (
                      <FormControl isInvalid={form.errors.last_name && form.touched.last_name}>
                        <FormLabel htmlFor="last_name">Last Name</FormLabel>
                        <Input {...field} id="last_name" placeholder="Last Name" />
                        <FormErrorMessage>{form.errors.last_name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="phone_number">
                    {({ field, form }) => (
                      <FormControl isInvalid={form.errors.phone_number && form.touched.phone_number}>
                        <FormLabel htmlFor="phone_number">Phone Number</FormLabel>
                        <Input {...field} id="phone_number" placeholder="Phone Number" />
                        <FormErrorMessage>{form.errors.phone_number}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="full_address">
                    {({ field, form }) => (
                      <FormControl isInvalid={form.errors.full_address && form.touched.full_address}>
                        <FormLabel htmlFor="full_address">Full Address</FormLabel>
                        <Input {...field} id="full_address" placeholder="Full Address" />
                        <FormErrorMessage>{form.errors.full_address}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="zip_code">
                    {({ field, form }) => (
                      <FormControl isInvalid={form.errors.zip_code && form.touched.zip_code}>
                        <FormLabel htmlFor="zip_code">ZIP Code</FormLabel>
                        <Input {...field} id="zip_code" placeholder="ZIP Code" />
                        <FormErrorMessage>{form.errors.zip_code}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="city">
                    {({ field, form }) => (
                      <FormControl isInvalid={form.errors.city && form.touched.city}>
                        <FormLabel htmlFor="city">City</FormLabel>
                        <Input {...field} id="city" placeholder="City" />
                        <FormErrorMessage>{form.errors.city}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="blue"
                  mr={3}
                  isLoading={props.isSubmitting}
                  type="submit"
                >
                  {isEditing ? 'Update' : 'Add'}
                </Button>
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default AddressForm;