"use client";
import React from 'react';
import { Bell, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui';
import { useClient } from '@/context/ClientContext';

interface NavbarProps {
  setIsMobileMenuOpen: (open: boolean) => void;
  pageTitle?: string;
}

export default function Navbar({ 
  setIsMobileMenuOpen,
  pageTitle = "Dashboard",
}: NavbarProps) {
  const { clientName } = useClient();
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5 text-slate-600" />
          </Button>

          {/* Page Title */}
          <div className="flex-1 md:flex-none">
            <h1 className="text-xl font-semibold text-slate-900">{pageTitle}</h1>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative text-slate-600 hover:text-slate-900">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
            <div className="hidden md:flex items-center space-x-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">{clientName}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}