import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// import Head from "next/head";
import { ChakraProvider } from "@chakra-ui/react";
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
      {/* <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato&display=swap"
          rel="stylesheet"
        />
      </Head> */}
      <body>
        <ChakraProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ChakraProvider>
      </body>
    </html>
  );
}
