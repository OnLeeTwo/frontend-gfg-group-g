"use client";

import withAuth from "@/middleware/withAuth";
import { redirect } from "next/navigation";

const ProfilePage = () => {
  redirect("/profile/account");
};

export default withAuth(ProfilePage, "buyer");
