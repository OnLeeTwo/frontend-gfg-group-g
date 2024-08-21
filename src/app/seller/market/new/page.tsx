import { MarketForm } from '../../../../components/forms/market-form';
import PageContainer from '../../../../components/layout/page-container';
import { ScrollArea } from '../../../../components/ui/scroll-area';
import React from 'react';

export default function Page() {
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <MarketForm
          initialData={null}
          key={null}
        />
      </div>
    </PageContainer>
  );
}