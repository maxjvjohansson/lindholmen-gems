import { Quicksand } from "next/font/google";
import ProgressOverlay from "@/components/ProgressBar/ProgressOverlay";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Lindholmen Gems",
  description:
    "A location based interactive walking game that transforms Lindholmen into an engaging adventure. Players walk between real locations, complete fun challenges, and collect puzzle pieces together.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body className={`${quicksand.variable} antialiased`}>
        <main>{children}</main>
      </body>
    </html>
  );
}
