import { UsersForm } from '../../../../components/forms/users-form';
import PageContainer from '../../../../components/layout/page-container';
import { ScrollArea } from '../../../../components/ui/scroll-area';
import React from 'react';

export default function Page() {
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <UsersForm
          roles={[
            { _id: 'buyer', name: 'buyer' },
            { _id: 'seller', name: 'seller' }
          ]}
          initialData={null}
          key={null}
        />
      </div>
    </PageContainer>
  );
}
