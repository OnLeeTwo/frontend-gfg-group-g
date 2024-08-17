import PageContainer from '../../../components/layout/page-container';
import { UserClient } from '../../../components/tables/user-tables/client';
import { users } from '../../../constants/data';

export default function page() {
    return (
      <PageContainer>
        <div className="space-y-2">
          <UserClient data={users} />
        </div>
      </PageContainer>
    );
  }
