import {Roboto} from "next/font/google";

import "./globals.css";
import {ThemeProvider} from "@/components/theme-provider";
import AuthProvider from "@/components/auth-provider";
import connectDB from "@/lib/database";
import Header from "@/components/header";
import {Toaster} from "@/components/ui/toaster";

connectDB();

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata = {
  title: {
    template: "%s | Photo Sharing App",
  },
  description: "this is a demo photo sharing app",
};

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Header />
            <main>{children}</main>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
