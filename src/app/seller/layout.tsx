import { ReactNode } from "react";
import DashboardLayout from "../../components/layout/SellerLayout";
import React from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
