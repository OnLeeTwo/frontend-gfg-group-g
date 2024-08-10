import { useRouter } from "next/navigation";
import { useToast } from "@chakra-ui/react";
import { useAuth } from "../hooks/authContext";

export const useLogout = () => {
  const router = useRouter();
  const toast = useToast();
  const { setIsLoggedIn } = useAuth();

  const logout = async () => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/logout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("role");
        setIsLoggedIn(false);

        toast({
          title: "Logout Successful",
          description: "You've been successfully logged out.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        router.push("/login");
      } else {
        const data = await response.json();
        throw new Error(data.error || "Logout failed");
      }
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return logout;
};
