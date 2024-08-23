'use client';
import { Checkbox } from '../../ui/checkbox';
import { Promotion } from '../../../constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import React from 'react';

export const columns: ColumnDef<Promotion>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: true,
    enableHiding: true
  },
  {
    accessorKey: 'promotion_id',
    header: 'PROMOTION_ID'
  },
  {
    accessorKey: 'market_id',
    header: 'MARKET_ID'
  },
  {
    accessorKey: 'code',
    header: 'CODE'
  },
  {
    accessorKey: 'start_date',
    header: 'START DATE'
  },
  {
    accessorKey: 'end_date',
    header: 'END DATE'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
