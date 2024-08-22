'use client'

import PageContainer from '../../../components/layout/page-container';
import { columns } from '@/components/tables/user-tables/columns';
import { UserTable } from '@/components/tables/user-tables/client';
import { buttonVariants } from '../../../components/ui/button';
import { Heading } from '../../../components/ui/heading';
import { Separator } from '../../../components/ui/separator';
import { cn } from '../../../utils/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import withAuth from '@/middleware/withAuth';



type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const MarketPage = ({ searchParams }: paramsProps) => {
  const [markets, setMarkets] = useState([]);
  const [totalMarkets, setTotalMarkets] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    const fetchMarketData = async () => {
      const page = Number(searchParams.page) || 1;
      const perPage = Number(searchParams.limit) || 10;
      const name = searchParams.search || '';

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/markets?page=${page}&per_page=${perPage}` +
        (name ? `&name=${name}` : '')
      );
      const fetchMarket = await res.json();

      if (fetchMarket.success) {
        setMarkets(fetchMarket.data);
        setTotalMarkets(fetchMarket.total_items);
        setPageCount(fetchMarket.total_pages);
      } else {
        console.error('Error fetching market data:', fetchMarket.message);
      }
    };

    fetchMarketData();
  }, [searchParams]);

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Market (${totalMarkets})`}
            description="Manage all markets that you have"
          />

          <Link
            href={'../seller/market/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />

        <UserTable
          searchKey="market_name"
          pageNo={Number(searchParams.page) || 1}
          columns={columns}
          totalUsers={totalMarkets}
          data={markets}
          pageCount={pageCount}
        />
      </div>
    </PageContainer>
  );
}

export default withAuth(MarketPage, 'seller');
