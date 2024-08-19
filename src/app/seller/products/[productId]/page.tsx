import { ProductForm } from '../../../../components/forms/products-form';
import { ScrollArea } from '../../../../components/ui/scroll-area';
import React from 'react';


export default function Page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <ProductForm
          categories={[
            { _id: 'shirts', name: 'shirts' },
            { _id: 'pants', name: 'pants' }
          ]}
          initialData={null}
          key={null}
        />
      </div>
    </ScrollArea>
  );
}
