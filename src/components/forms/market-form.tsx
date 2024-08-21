'use client';
import * as z from 'zod';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import { Input as ChakraInput } from '@chakra-ui/react';
import { Button } from '../ui/button';
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
import React from 'react';

const formSchema = z.object({
  market_name: z.string().min(3, { message: 'Market name must be at least 3 characters' }),
  location: z.string().min(3, { message: 'Market location must be at least 3 characters' }),
  profile_picture: z.any().optional()
});

type MarketFormValues = z.infer<typeof formSchema>;

interface MarketFormProps {
  initialData: any | null;
}

export const MarketForm: React.FC<MarketFormProps> = ({ initialData }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [open, setOpen] = useState(false);

  const title = initialData ? 'Edit Market' : 'Create Market';
  const description = initialData ? 'Edit an existing market.' : 'Add a new market.';
  const toastMessage = initialData ? 'Market updated.' : 'Market created.';
  const action = initialData ? 'Save changes' : 'Create';

  const token =  localStorage.getItem("access_token")

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
            title: "Profile updated successfully",
            duration: 3000,
          });
        } else {
          throw new Error("Failed to update profile");
        }
      } else {
        // await axios.post(`/api/markets`, data);
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
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="market_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Market Name</FormLabel>
                  <FormControl>
                    <ChakraInput disabled={loading} placeholder="Market Name" {...field} />
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
                    <ChakraInput disabled={loading} placeholder="Market Location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
            control={form.control}
            name="profile_picture"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Market Logo</FormLabel>
                <FormControl>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={loading}
                    onChange={(e) => {
                      field.onChange(e.target.files?.[0]);
                      setProfilePicture(e.target.files?.[0]);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
