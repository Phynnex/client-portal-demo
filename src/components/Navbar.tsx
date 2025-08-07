"use client";
import React from 'react';
import { Bell, User, Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
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
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <header className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5 text-slate-600 dark:text-slate-200" />
          </Button>

          {/* Page Title */}
          <div className="flex-1 md:flex-none">
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{pageTitle}</h1>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center space-x-1 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <>
                  <Moon className="h-5 w-5" />
                  <span className="text-sm">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="h-5 w-5" />
                  <span className="text-sm">Light</span>
                </>
              )}
            </Button>
            <div className="hidden md:flex items-center space-x-2">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                <User className="h-5 w-5 text-blue-600 dark:text-blue-100" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{clientName}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}