'use client';
import * as z from 'zod';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
  product_name: z
    .string()
    .min(3, { message: 'Product Name must be at least 3 characters' }),
    description: z
    .string()
    .min(3, { message: 'Product description must be at least 3 characters' }),
    price: z.coerce.number(),
  market_id : z.string().min(1, { message: 'Please select a market' }),
  images: z.any().optional(),
  stock: z.coerce.number(),
  category: z.string().min(1, { message: 'Please select a category' }),
  is_premium: z.coerce.number(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData: any | null;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit product' : 'Create product';
  const description = initialData ? 'Edit a product.' : 'Add a new product';
  const toastMessage = initialData ? 'Product updated.' : 'Product created.';
  const action = initialData ? 'Save changes' : 'Create';

  const token =  localStorage.getItem("access_token")
  
  const defaultValues = initialData || {
        product_name: '',
        market_id: '',
        description: '',
        price: 0,
        stock: 0,
        images: [],
        category: '',
        is_premium: 0
      };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      const { images } = data;
      if (initialData) {
        const formData = new FormData();
        if (data.product_name){
          formData.append("product_name", data.product_name);
        }
        if (data.description){
          formData.append("description", data.description);
        }
        if (images) {
          formData.append("images", images);
        }
        if (data.description){
          formData.append("description", data.description);
        }
        if (data.price){
          formData.append("price", data.price);
        }
        if (data.stock){
          formData.append("stock", data.stock);
        }
        if (data.category){
          formData.append("description", data.category);
        }
        if (data.is_premium){
          formData.append("is_premium", data.is_premium);
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/markets/${initialData.product_id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        if (response.ok) {
          toast({
            title: "Product updated successfully",
            duration: 3000,
          });
        } else {
          throw new Error("Failed to update product");
        }
      } else {
        const formData = new FormData();
          formData.append("product_name", data.product_name);
          formData.append("description", data.description);
          formData.append("market_id", data.market_id);
        if (images) {
          formData.append("images", images);
        }
        if (data.description){
          formData.append("description", data.description);
        }
        if (data.price){
          formData.append("price", data.price);
        }
        if (data.stock){
          formData.append("stock", data.stock);
        }
        if (data.category){
          formData.append("description", data.category);
        }
        if (data.is_premium){
          formData.append("is_premium", data.is_premium);
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        if (response.ok) {
          toast({
            title: "Product updated successfully",
            duration: 3000,
          });
        } else {
          throw new Error("Failed to update product");
        }
      }
      router.refresh();
      router.push(`/seller/products`);
      toast({
        title: toastMessage,
        description: `Product ${initialData ? 'updated' : 'created'} successfully.`,
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
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                <input
                    type="file"
                    accept="image/*"
                    disabled={loading}
                    onChange={(e) => {
                      field.onChange(e.target.files?.[0]);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="product_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Product name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Product description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input type="string" disabled={loading} placeholder="Product category" {...field} />
                    </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_premium"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>I want to list this product as a premium quality</FormLabel>
                    <FormControl>
                      <Input type="checkbox" disabled={loading} {...field} />
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
