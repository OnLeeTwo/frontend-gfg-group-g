'use client';
import { Checkbox } from '../../ui/checkbox';
import { Product } from '../../../constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import React from 'react';

export const columns: ColumnDef<Product>[] = [
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
    accessorKey: 'id',
    header: 'PRODUCT_ID'
  },
  {
    accessorKey: 'market_id',
    header: 'MARKET_ID'
  },
  {
    accessorKey: 'product_name',
    header: 'NAME'
  },
  {
    accessorKey: 'stock',
    header: 'STOCK'
  },
  {
    accessorKey: 'price',
    header: 'PRICE'
  },
  {
    accessorKey: 'description',
    header: 'DESCRIPTION'
  },
  {
    accessorKey: 'is_premium',
    header: 'PREMIUM(?)'
  },
  {
    accessorKey: 'category',
    header: 'CATEGORY'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
