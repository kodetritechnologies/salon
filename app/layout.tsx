import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-display-custom",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const poppins = Poppins({
  variable: "--font-sans-custom",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Royal Gents Salon — India's Premium Men's Grooming Experience",
  description: "Premium men's grooming in Indore. Expert haircuts, beard styling, facials, hair spa and luxury barbering by certified Indian barbers.",
  authors: [{ name: "Royal Gents Salon" }],
  openGraph: {
    title: "Royal Gents Salon — India's Premium Men's Grooming Experience",
    description: "Premium men's grooming in Indore. Expert haircuts, beard styling, facials, hair spa and luxury barbering by certified Indian barbers.",
    type: "website",
    images: [
      {
        url: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/9372cffc-7d19-4aad-ad48-060bc108e662",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Royal Gents Salon — India's Premium Men's Grooming Experience",
    description: "Premium men's grooming in Indore. Expert haircuts, beard styling, facials, hair spa and luxury barbering by certified Indian barbers.",
    images: ["https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/9372cffc-7d19-4aad-ad48-060bc108e662"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
