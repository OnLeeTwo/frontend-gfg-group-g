import { Icons } from "../components/icons";

export interface NavItem {
  disabled?: boolean;
  title: string;
  href: string;
  icon?: keyof typeof Icons;
  label?: string;
}
