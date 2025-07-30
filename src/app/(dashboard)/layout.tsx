"use client";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { Navbar, Sidebar } from "@/components";
import { ClientProvider } from "@/context/ClientContext";
import { useToggle } from "@/hooks/useToggle";
import { getLoggedInUserName } from "@/lib/auth";

export default function DashboardLayout({ children }: PropsWithChildren<object>) {
  const { value: isCollapsed, set: setIsCollapsed } = useToggle(false);
  const { value: isMobileMenuOpen, set: setIsMobileMenuOpen } = useToggle(false);
  const [clientName, setClientName] = useState("John Anderson");

  useEffect(() => {
    const name = getLoggedInUserName();
    if (name) setClientName(name);
  }, []);

  return (
    <ClientProvider clientName={clientName}>
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
