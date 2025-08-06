"use client";
import React, { PropsWithChildren, useEffect } from "react";
import { Navbar, Sidebar } from "@/components";
import { ClientProvider } from "@/context/ClientContext";
import { useToggle } from "@/hooks/useToggle";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function ProtectedLayout({ children }: PropsWithChildren<object>) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { value: isCollapsed, set: setIsCollapsed } = useToggle(false);
  const { value: isMobileMenuOpen, set: setIsMobileMenuOpen } = useToggle(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return null;
  }

  return (
    <ClientProvider clientName={session?.user?.name || ""}>
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

export default function DashboardLayout({ children }: PropsWithChildren<object>) {
  return (
    <SessionProvider>
      <ProtectedLayout>{children}</ProtectedLayout>
    </SessionProvider>
  );
}
