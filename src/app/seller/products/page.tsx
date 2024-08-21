import PageContainer from '../../../components/layout/page-container';
import { columns } from '../../../components/tables/product-tables/columns';
import { ProductTable } from '../../../components/tables/product-tables/client';
import { buttonVariants } from '../../../components/ui/button';
import { Heading } from '../../../components/ui/heading';
import { Separator } from '../../../components/ui/separator';
import { cn } from '../../../utils/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import withAuth from '@/middleware/withAuth';


type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const ProductPage = async ({ searchParams }: paramsProps) => {
  const page = Number(searchParams.page) || 1;
  const perPage = Number(searchParams.limit) || 10;
  const name = searchParams.search || null;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?page=${page}&per_page=${perPage}` +
    (name ? `&name=${name}` : '')
  );
  const fetchProduct = await res.json();

  if (!fetchProduct.success) {
    return <div>Error fetching product data: {fetchProduct.message}</div>;
  }

  const totalProduct = fetchProduct.total_items;
  const pageCount = fetchProduct.total_pages;
  const product = fetchProduct.data;

  return (
    <PageContainer>
      <div className="space-y-4">

        <div className="flex items-start justify-between">
          <Heading
            title={`All Product`}
            description="Manage all product that you have"
          />

          <Link
            href={'seller/product/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />

        <ProductTable
          searchKey="product_name"
          pageNo={page}
          columns={columns}
          totalProduct={totalProduct}
          data={product}
          pageCount={pageCount}
        />
      </div>
    </PageContainer>
  );
}

export default withAuth(ProductPage, 'seller');