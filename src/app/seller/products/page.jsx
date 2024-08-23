'use client';

import PageContainer from '../../../components/layout/page-container';
import { columns } from '../../../components/tables/product-tables/columns';
import { ProductTable } from '../../../components/tables/product-tables/client';
import { buttonVariants } from '../../../components/ui/button';
import { Heading } from '../../../components/ui/heading';
import { Separator } from '../../../components/ui/separator';
import { cn } from '../../../utils/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import withAuth from '@/middleware/withAuth';

const ProductPage = ({ searchParams }) => {
  const [product, setProduct] = useState([]);
  const [totalProduct, setTotalProduct] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      const page = Number(searchParams.page) || 1;
      const perPage = Number(searchParams.limit) || 10;
      const name = searchParams.search || null;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products?page=${page}&per_page=${perPage}` +
          (name ? `&name=${name}` : '')
        );
        const fetchProduct = await res.json();

        if (fetchProduct.success) {
          setProduct(fetchProduct.data);
          setTotalProduct(fetchProduct.total_items);
          setPageCount(fetchProduct.total_pages);
        } else {
          setError(`Error fetching product data: ${fetchProduct.message}`);
        }
      } catch (error) {
        setError('Error fetching product data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [searchParams]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`All Products`}
            description="Manage all products that you have"
          />

          <Link
            href={'../seller/products/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />
        <ProductTable
          searchKey="product_name"
          pageNo={Number(searchParams.page) || 1}
          columns={columns}
          totalProduct={totalProduct}
          data={product}
          pageCount={pageCount}
        />
      </div>
    </PageContainer>
  );
};

export default withAuth(ProductPage, 'seller');