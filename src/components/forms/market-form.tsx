'use client'

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Input as ChakraInput, Box, VStack, HStack, Text, Spinner, Button} from '@chakra-ui/react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import { Separator } from '../ui/separator';
import { Heading } from '../ui/heading';
import { useToast } from '../ui/use-toast';
import React, { useEffect, useState} from 'react';

const formSchema = z.object({
  market_name: z.string().min(3, { message: 'Market name must be at least 3 characters' }),
  location: z.string().min(3, { message: 'Market location must be at least 3 characters' }),
  profile_picture: z.any().optional()
});

type MarketFormValues = z.infer<typeof formSchema>;

interface MarketFormProps {
  initialData: any | null;
  sellerId: any | null
}

export const MarketForm: React.FC<MarketFormProps> = ({ initialData , sellerId}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);


  const title = initialData ? 'Edit Market' : 'Create Market';
  const description = initialData ? 'Edit an existing market.' : 'Add a new market.';
  const toastMessage = initialData ? 'Market updated.' : 'Market created.';
  const action = initialData ? 'Save changes' : 'Create';

  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("access_token");
      setToken(token);
    }
  }, []);

  const defaultValues = initialData || {
    market_id: '',
    market_name: '',
    location: '',
    logo: []
  };

  const form = useForm<MarketFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: MarketFormValues) => {
    try {
      setLoading(true);

      const { profile_picture } = data;
      if (initialData) {
        const formData = new FormData();
        if (data.market_name){
          formData.append("name", data.market_name);
        }
        if (data.location){
          formData.append("location", data.location);
        }
        if (profile_picture) {
          formData.append("images", profile_picture);
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/markets/${initialData.market_id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          toast({
            title: "Market updated successfully",
            duration: 3000,
          });
        } else {
          throw new Error("Failed to update market");
        }
      } else {
        const formData = new FormData();
        if (data.market_name){
          formData.append("name", data.market_name);
        }
        if (data.location){
          formData.append("location", data.location);
        }
        if (profile_picture) {
          formData.append("images", profile_picture);
        }
        formData.append("seller_id", sellerId);
        console.log(token)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/markets`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        if (response.ok) {
          toast({
            title: "Market created successfully",
            duration: 3000,
          });
        } else {
          throw new Error("Failed to create market");
        }
      }
      router.refresh();
      router.push(`/seller/market`);
      toast({
        title: toastMessage,
        description: `Market ${initialData ? 'updated' : 'created'} successfully.`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth="800px" margin="0 auto" padding="2rem">
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Heading title={title} description={description} />
        </HStack>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <VStack spacing={6} align="stretch">
              <HStack spacing={6}>
                <FormField
                  control={form.control}
                  name="market_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Market Name</FormLabel>
                      <FormControl>
                        <ChakraInput
                          disabled={loading}
                          placeholder="Market Name"
                          {...field}
                          _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Market Location</FormLabel>
                      <FormControl>
                        <ChakraInput
                          disabled={loading}
                          placeholder="Market Location"
                          {...field}
                          _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </HStack>
              <FormField
                control={form.control}
                name="profile_picture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Market Logo</FormLabel>
                    <FormControl>
                      <Box
                        borderWidth={1}
                        borderRadius="md"
                        padding={4}
                        cursor="pointer"
                        _hover={{ bg: 'gray.50' }}
                        onClick={() => document.getElementById('file-input')?.click()}
                      >
                        <HStack spacing={2}>
                          <Text>{field.value ? field.value.name : 'Click to upload image'}</Text>
                        </HStack>
                        <input
                          id="file-input"
                          type="file"
                          accept="image/*"
                          disabled={loading}
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            field.onChange(e.target.files?.[0]);
                          }}
                        />
                      </Box>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={loading}
                type="submit"
                colorScheme="blue"
                isLoading={loading}
                loadingText="Submitting"
              >
                {action}
              </Button>
            </VStack>
          </form>
        </Form>
      </VStack>
    </Box>
  );
}
