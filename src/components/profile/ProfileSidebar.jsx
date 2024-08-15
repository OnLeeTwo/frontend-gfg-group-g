import React from "react";
import { VStack, Link, Button } from "@chakra-ui/react";
import { useLogout } from "@/hooks/auth";

const ProfileSidebar = () => {
  const logout = useLogout();

  return (
    <VStack align="stretch" spacing={3} position="sticky" top="20px">
      <Link href="profile/account">Account Main</Link>
      <Link href="profile/orders">Order History</Link>
      <Link href="profile/wishlist">My Wishlist</Link>
      <Button
        onClick={logout}
        className="text-gray-700 hover:text-blue-500"
      >
        Logout
      </Button>
    </VStack>
  );
};

export default ProfileSidebar;