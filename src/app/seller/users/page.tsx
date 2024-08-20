import PageContainer from '../../../components/layout/page-container';
import { columns } from '@/components/tables/user-tables/columns';
import { UserTable } from '@/components/tables/user-tables/client';
import { buttonVariants } from '../../../components/ui/button';
import { Heading } from '../../../components/ui/heading';
import { Separator } from '../../../components/ui/separator';
import { User } from '../../../constants/data';
import { cn } from '../../../utils/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';


type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const email = searchParams.search || null;
  const offset = (page - 1) * pageLimit;

  const res = await fetch(
    `https://api.slingacademy.com/v1/sample-data/users?offset=${offset}&limit=${pageLimit}` +
      (email ? `&search=${email}` : '')
  );
  const fetchProuct = await res.json();
  const totalUsers = fetchProuct.limit; //1000
  const pageCount = Math.ceil(totalUsers / pageLimit);
  const users: User[] = fetchProuct.users;
  return (
    <PageContainer>
      <div className="space-y-4">

        <div className="flex items-start justify-between">
          <Heading
            title={`Users (${totalUsers})`}
            description="Manage Users (Server side table functionalities.)"
          />

          <Link
            href={'../seller/users/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />

        <UserTable
          searchKey="email"
          pageNo={page}
          columns={columns}
          totalUsers={totalUsers}
          data={users}
          pageCount={pageCount}
        />
      </div>
    </PageContainer>
  );
}
