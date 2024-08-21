import PageContainer from '../../../components/layout/page-container';
import { columns } from '@/components/tables/user-tables/columns';
import { UserTable } from '@/components/tables/user-tables/client';
import { buttonVariants } from '../../../components/ui/button';
import { Heading } from '../../../components/ui/heading';
import { Separator } from '../../../components/ui/separator';
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
  const perPage = Number(searchParams.limit) || 10;
  const name = searchParams.search || '';
  
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/markets?page=${page}&per_page=${perPage}` +
    (name ? `&name=${name}` : '')
  );
  const fetchMarket = await res.json();
  
  if (!fetchMarket.success) {
    return <div>Error fetching market data: {fetchMarket.message}</div>;
  }

  const totalMarkets = fetchMarket.total_items;
  const pageCount = fetchMarket.total_pages;
  const markets = fetchMarket.data;

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Market (${totalMarkets})`}
            description="Manage all markets that you have"
          />

          <Link
            href={'../seller/users/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />

        <UserTable
          searchKey="market_name"
          pageNo={page}
          columns={columns}
          totalUsers={totalMarkets}
          data={markets}
          pageCount={pageCount}
        />
      </div>
    </PageContainer>
  );
}
