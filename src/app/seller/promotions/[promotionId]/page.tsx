'use client'

import { ProductForm } from '../../../../components/forms/products-form';
import { ScrollArea } from '../../../../components/ui/scroll-area';
import React, {useState, useEffect} from 'react';
import { useParams } from 'next/navigation';
import exp from 'constants';
import withAuth from '@/middleware/withAuth';

interface Promotion {
  promotion_id: string;
  market_id: string;
  code: string;
  discount_value: number;
  start_date : string;
  end_date : string;
}

const ProductPageForm = () => {
  const [initialData, setInitialData] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
  const fetchPromotionData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promotions`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const filteredPromotions = data.filter(promotion => promotion.promotion_id === params.promotionId);
        setInitialData(filteredPromotions);
      } else {
        console.error('Failed to fetch market data');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchPromotionData();
}, [params.promotionId]);

if (loading) {
  return <div>Loading...</div>; 
}

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <PromotionForm
          initialData={initialData}
          key={initialData?.id || 'new' }
        />
      </div>
    </ScrollArea>
  );
}

export default withAuth(ProductPageForm, 'seller')