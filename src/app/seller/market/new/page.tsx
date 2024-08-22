'use client'

import withAuth from '@/middleware/withAuth';
import { MarketForm } from '../../../../components/forms/market-form';
import PageContainer from '../../../../components/layout/page-container';
import React, {useState, useEffect} from 'react';

const MarketPageNew = () => {
  const [key, setKey] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchSellerId = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seller`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setKey(data.seller_id);
      } else {
        console.error('Failed to fetch market data');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchSellerId();
}, []);
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <MarketForm
          initialData={null}
          key={key}
          sellerId={key}
        />
      </div>
    </PageContainer>
  );
}

export default withAuth(MarketPageNew, 'seller')