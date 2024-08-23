'use client';

import PageContainer from '../../../components/layout/page-container';
import { buttonVariants } from '../../../components/ui/button';
import { Heading } from '../../../components/ui/heading';
import { Separator } from '../../../components/ui/separator';
import { cn } from '../../../utils/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import withAuth from '@/middleware/withAuth';
import { PromotionsTable } from '@/components/tables/promotion-tables/client';
import { columns } from '@/components/tables/promotion-tables/columns';

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const PromotionPage = ({ searchParams }: paramsProps) => {
  const [promotion, setPromotion] = useState([]);
  const [totalPromotions, setTotalPromotions] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromotionsData = async () => {

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/promotion`,{
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          }
        );
        const fetchpromotions = await res.json();

        if (fetchpromotions.success) {
          setPromotion(fetchpromotions.data);
        } else {
          setError(`Error fetching promotions data: ${fetchpromotions.message}`);
        }
      } catch (error) {
        setError('Error fetching promotions data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPromotionsData();
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
            title={`All promotionss`}
            description="Manage all promotionss that you have"
          />

          <Link
            href={'../seller/promotions/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />

        <PromotionsTable
          searchKey="code"
          pageNo={Number(searchParams.page) || 1}
          columns={columns}
          totalpromotions={totalPromotions}
          data={promotion}
          pageCount={pageCount}
        />
      </div>
    </PageContainer>
  );
};

export default withAuth(PromotionPage, 'seller');