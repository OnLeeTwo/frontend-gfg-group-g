import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChakraProvider } from "@chakra-ui/react";
import "./globals.css";

export const metadata = {
  title: "SucoMart",
  description: "Belanja hemat, harga terjangkau",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider>
          <Navbar />
          <main style={{ marginBottom: '20px', marginTop: '20px'}}>{children}</main>
          <Footer />
        </ChakraProvider>
      </body>
    </html>
  );
}
