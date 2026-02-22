import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arya Intaran - Link",
  description: "Arya Intaran - Link",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`font-sans antialiased bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen selection:bg-blue-200 selection:text-blue-900`}
      >
        {children}
      </body>
    </html>
  );
}
