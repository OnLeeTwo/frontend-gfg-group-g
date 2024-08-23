'use client'

import { MarketForm } from '../../../../components/forms/market-form';
import PageContainer from '../../../../components/layout/page-container';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import withAuth from '@/middleware/withAuth';

interface Market {
  market_id: string;
  market_name: string;
  location: string;
  profile_picture : string;

}

const MarketPageForm = () => {
  const [initialData, setInitialData] = useState<Market | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/markets/${params.marketId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setInitialData(data);
        } else {
          console.error('Failed to fetch market data');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, [params.marketId]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return ( 
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <MarketForm initialData={initialData} key={initialData?.market_id || 'new' } sellerId={null} />
      </div>
    </PageContainer>
  );
}


export default withAuth(MarketPageForm, 'seller')