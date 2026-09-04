import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import Nav from "@/components/Nav";
import "./globals.css";

export const metadata = {
  title: "Odune · Questionnaires de cadrage",
  description:
    "Deux questionnaires de cadrage Odune : Patrinove et la marque de soins intimes.",
  robots: { index: false, follow: false, nocache: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${GeistMono.variable} ${GeistSans.variable}`}>
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
