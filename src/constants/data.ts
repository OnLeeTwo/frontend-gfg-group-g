import { NavItem } from "../types";

export type User = {
  market_id: string;
  market_name: string;
  location: string;
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
  {
    title: "Promotions",
    href: "/seller/promotions",
    icon: "promotions",
    label: "kanban",
  },
];
