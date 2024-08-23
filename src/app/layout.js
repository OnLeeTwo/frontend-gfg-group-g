import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "@/hooks/authContext";
import "./globals.css";

export const metadata = {
  title: "SucoMart",
  description: "Sustainable and Eco marketing platform for all",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ChakraProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </ChakraProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
