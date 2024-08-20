import { Icons } from "../components/icons";

export interface NavItem {
  disabled: any;
  title: string;
  href: string;
  icon?: keyof typeof Icons;
  label?: string;
}

