import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Lindholmen Gems",
  description:
    "En interaktiv skattjakt och lunchpromenad på Lindholmen. Utforska området, lös utmaningar vid olika platser och upptäck nya sidor av stadsdelen på ett roligt och aktivt sätt.",
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
