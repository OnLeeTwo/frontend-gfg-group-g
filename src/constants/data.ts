import { NavItem } from "../types";

export type User = {
  market_id: string;
  market_name: string;
  location: string;
};

export type Product = {
  id: string;
  market_id: string;
  product_name: string;
  stock: number;
  price: number;
  description: string;
  category: string;
  is_premium: string;
};

export type Promotion = {
  promotion_id: string;
  code: string;
  discount_value: number;
  start_date: string;
  end_date: string;
};

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/seller/dashboard",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    title: "Market",
    href: "/seller/market",
    icon: "user",
    label: "user",
  },
  {
    title: "Product",
    href: "/seller/products",
    icon: "products",
    label: "product",
  },
];
