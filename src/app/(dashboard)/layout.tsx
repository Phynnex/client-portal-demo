

"use client";
import React, { useState } from "react";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import ClientContext from "@/app/context/ClientContext";

import { PropsWithChildren } from "react";

export default function DashboardLayout({ children }: PropsWithChildren<object>) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Replace this with actual logic to get the client name
  const clientName = "Client Name";

  return (
    <ClientContext.Provider value={{ clientName: 'John Anderson' }}>
    <div className="flex">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        clientName={clientName}
      />
      <div className="flex-1">
        <Navbar setIsMobileMenuOpen={setIsMobileMenuOpen} clientName={clientName} />
        <main>{children}</main>
      </div>
    </div>
    </ClientContext.Provider>
  );
}