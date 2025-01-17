import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'], // Pesos
  variable: '--font-roboto', 
});

export const metadata: Metadata = {
  title: "Horario",
  description: "Horario de clases",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={roboto.variable}
      >
        {children}
      </body>
    </html>
  );
}
