"use client";

import "@/app/globals.css";
import { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { ThemeProvider } from "next-themes";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
<html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light">
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
