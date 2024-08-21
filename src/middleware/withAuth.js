"use client";

import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";

const withAuth = (WrappedComponent, requiredRole) => {
  return (props) => {
    const toast = useToast();
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast({
          title: "Unauthorized",
          description: "Please login to use this feature!",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        router.push("/login");
        return;
      }

      const user = jwt.decode(token);
      if (!user || user.role !== requiredRole) {
        toast({
          title: "Unauthorized",
          description: "You do not have permission to access this page.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        router.push("/home");
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
