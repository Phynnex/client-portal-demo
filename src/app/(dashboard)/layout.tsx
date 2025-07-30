

"use client";
import React from "react";
import { Navbar, Sidebar } from "@/components";
import { ClientProvider } from "@/context/ClientContext";
import { useToggle } from "@/hooks/useToggle";

import { PropsWithChildren } from "react";

export default function DashboardLayout({ children }: PropsWithChildren<object>) {
  const { value: isCollapsed, set: setIsCollapsed } = useToggle(false);
  const { value: isMobileMenuOpen, set: setIsMobileMenuOpen } = useToggle(false);
  // Replace this with actual logic to get the client name
  return (
    <ClientProvider clientName="John Anderson">
      <div className="flex">
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        <div className="flex-1">
          <Navbar setIsMobileMenuOpen={setIsMobileMenuOpen} />
          <main>{children}</main>
        </div>
      </div>
    </ClientProvider>
  );
}