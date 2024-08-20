import { NavItem } from "../types";

export type User = {
  id: number;
  first_name: string;
  email: string;
  gender: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  email: string;
  description: string;
};


export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: 'seller/dashboard',
    icon: 'dashboard',
    label: 'Dashboard'
  },
  {
    title: 'User',
    href: 'seller/users',
    icon: 'user',
    label: 'user'
  },
  {
    title: 'Product',
    href: 'seller/products',
    icon: 'products',
    label: 'product'
  },
  {
    title: 'Promotions',
    href: 'seller/promotions',
    icon: 'promotions',
    label: 'kanban'
  },
];
