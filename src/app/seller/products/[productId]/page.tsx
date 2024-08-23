'use client'

import { ProductForm } from '../../../../components/forms/products-form';
import { ScrollArea } from '../../../../components/ui/scroll-area';
import React, {useState, useEffect} from 'react';
import { useParams } from 'next/navigation';
import withAuth from '@/middleware/withAuth';

interface Product {
  id: string;
  market_id: string;
  product_name: string;
  stock: number;
  price : number;
  description : string;
  category : string;
  is_premium : number;
}

const ProductPageForm = () => {
  const [initialData, setInitialData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
  const fetchProductData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/${params.productId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setInitialData(data.data[0]);
      } else {
        console.error('Failed to fetch market data');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchProductData();
}, [params.productId]);

if (loading) {
  return <div>Loading...</div>; 
}

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <ProductForm
          initialData={initialData}
          key={initialData?.id || 'new' }
          markets={null}
        />
      </div>
    </ScrollArea>
  );
}

export default withAuth(ProductPageForm, 'seller')