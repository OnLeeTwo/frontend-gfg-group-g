import PageContainer from '../../../components/layout/page-container';
import { columns } from '../../../components/tables/product-tables/columns';
import { ProductTable } from '../../../components/tables/product-tables/client';
import { buttonVariants } from '../../../components/ui/button';
import { Heading } from '../../../components/ui/heading';
import { Separator } from '../../../components/ui/separator';
import { Product } from '../../../constants/data';
import { cn } from '../../../utils/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';


type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const description = searchParams.search || null;
  const offset = (page - 1) * pageLimit;

  const res = await fetch(
    `https://api.slingacademy.com/v1/sample-data/products?offset=${offset}&limit=${pageLimit}` +
      (description ? `&search=${description}` : '')
  );
  const fetchProuct = await res.json();
  const totalProduct = fetchProuct.limit; //1000
  const pageCount = Math.ceil(totalProduct / pageLimit);
  const product: Product[] = fetchProuct.products;
  return (
    <PageContainer>
      <div className="space-y-4">

        <div className="flex items-start justify-between">
          <Heading
            title={`Product (${totalProduct})`}
            description="Manage Products (Server side table functionalities.)"
          />

          <Link
            href={'se/product/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />

        <ProductTable
          searchKey="description"
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
