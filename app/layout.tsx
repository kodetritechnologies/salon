import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

import dbConnect from "@/utils/lib/dbConnect";
import Setting from "@/utils/models/Setting";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let dbTheme = "dark";
  try {
    await dbConnect();
    const settings = await Setting.findOne({});
    if (settings && settings.theme) {
      dbTheme = settings.theme;
    }
  } catch (error) {
    console.error("Failed to query settings for theme in RootLayout:", error);
  }

  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${poppins.variable} h-full antialiased ${dbTheme !== "dark" ? dbTheme : ""}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const pref = localStorage.getItem('theme_preference');
                  const dbTheme = '${dbTheme}';
                  let activeTheme = dbTheme;
                  
                  if (pref === 'light') {
                    activeTheme = 'light';
                  } else if (pref === 'brand') {
                    activeTheme = dbTheme;
                  } else {
                    // Migrate legacy 'theme' keys to prevent stale settings blocking new admin themes
                    const legacyTheme = localStorage.getItem('theme');
                    if (legacyTheme === 'light') {
                      activeTheme = 'light';
                      localStorage.setItem('theme_preference', 'light');
                    } else if (legacyTheme) {
                      activeTheme = dbTheme;
                      localStorage.setItem('theme_preference', 'brand');
                    }
                    localStorage.removeItem('theme');
                  }
                  
                  document.documentElement.classList.remove('light', 'theme-blue', 'theme-green');
                  if (activeTheme !== 'dark') {
                    document.documentElement.classList.add(activeTheme);
                  }
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Toaster position="top-right" reverseOrder={false} />
        {children}
      </body>
    </html>
  );
}
