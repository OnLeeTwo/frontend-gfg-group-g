import { NavItem } from "../types";

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  verified: boolean;
  status: string;
};
export const users: User[] = [
  {
    id: 1,
    name: 'Candice Schiner',
    email: 'Candice Schiner@gmail.com',
    role: 'Buyer',
    verified: false,
    status: 'Active'
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'John Doe@gmail.com',
    role: 'Buyer',
    verified: true,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    email: 'Alice Johnson@gmail.com',
    role: 'Seller',
    verified: true,
    status: 'Active'
  },
  {
    id: 4,
    name: 'David Smith',
    email: 'David Smith@gmail.com',
    role: 'Seller',
    verified: false,
    status: 'Inactive'
  },
  {
    id: 5,
    name: 'Emma Wilson',
    email: 'Emma Wilson@gmail.com',
    role: 'Buyer',
    verified: true,
    status: 'Active'
  },
  {
    id: 6,
    name: 'James Brown',
    email: 'James Brown@gmail.com',
    role: 'Seller',
    verified: false,
    status: 'Active'
  },
  {
    id: 7,
    name: 'Laura White',
    email: 'Laura White@gmail.com',
    role: 'Seller',
    verified: true,
    status: 'Active'
  },
  {
    id: 8,
    name: 'Michael Lee',
    email: 'Michael Lee@gmail.com',
    role: 'Buyer',
    verified: false,
    status: 'Active'
  },
  {
    id: 9,
    name: 'Olivia Green',
    email: 'Olivia Green@gmail.com',
    role: 'Buyer',
    verified: true,
    status: 'Active'
  },
  {
    id: 10,
    name: 'Robert Taylor',
    email: 'Robert Taylor@gmail.com',
    role: 'Seller',
    verified: false,
    status: 'Active'
  }
];

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
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
