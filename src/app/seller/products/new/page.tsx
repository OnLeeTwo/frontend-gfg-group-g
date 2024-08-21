import withAuth from '@/middleware/withAuth';
import { ProductForm } from '../../../../components/forms/products-form';
import PageContainer from '../../../../components/layout/page-container';

import React from 'react';

const ProductPageNew = () => {
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <ProductForm
          initialData={null}
          key={null}
        />
      </div>
    </PageContainer>
  );
}

export default withAuth(ProductPageNew, 'seller')