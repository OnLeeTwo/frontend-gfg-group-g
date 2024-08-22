'use client'

import withAuth from '@/middleware/withAuth';
import { ProductForm } from '../../../../components/forms/products-form';
import PageContainer from '../../../../components/layout/page-container';

import React ,{useEffect, useState} from 'react';

const ProductPageNew = () => {
  const [key, setKey] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/markets`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

      const responseData = await response.json();
      if (response.ok && responseData.success) {
        const filteredMarkets = responseData.data.map((market: any) => ({
          market_id: market.market_id,
          market_name: market.market_name,
        }));
        setKey(filteredMarkets);
        } else {
          console.error('Failed to fetch market data');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMarket();
  }, []);

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <ProductForm
          initialData={null}
          key={null}
          markets={key}
        />
      </div>
    </PageContainer>
  );
}

export default withAuth(ProductPageNew, 'seller')