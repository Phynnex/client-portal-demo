"use client";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { Navbar, Sidebar } from "@/components";
import { ClientProvider } from "@/context/ClientContext";
import { useToggle } from "@/hooks/useToggle";

export default function DashboardLayout({ children }: PropsWithChildren<object>) {
  const { value: isCollapsed, set: setIsCollapsed } = useToggle(false);
  const { value: isMobileMenuOpen, set: setIsMobileMenuOpen } = useToggle(false);
  const [storedName, setStoredName] = useState('');

  useEffect(() => {
    if (typeof window !== "undefined") {
      const name = localStorage.getItem("clientName") || "";
      setStoredName(name);
    }
  }, []);

  return (
    <ClientProvider clientName={storedName}>
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
