"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Waves,
  Home,
  FileText,
  CreditCard,
  MessageSquare,
  CheckSquare,
  ChevronLeft,
  User,
  X
} from 'lucide-react';
import { useClient } from '@/context/ClientContext';

// Navigation items
const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Accounts", href: "/accounts", icon: CreditCard },
  { name: "Messaging", href: "/messaging", icon: MessageSquare },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Reports", href: "/reports", icon: FileText },
];

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileMenuOpen,
  setIsMobileMenuOpen,

}: SidebarProps) {
  const pathname = usePathname();
  const { clientName } = useClient();
  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden md:flex flex-col bg-white border-r border-slate-200 transition-all duration-300 sticky top-0 h-screen ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-2 rounded-lg">
                  <Waves className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3">
                  <h1 className="text-lg font-bold text-slate-800">Blue Marina</h1>
                  <p className="text-xs text-slate-600">Asset Management</p>
                </div>
              </div>
            )}
            {isCollapsed && (
              <button
                onClick={() => setIsCollapsed(false)}
                className="bg-gradient-to-r from-blue-600 to-teal-600 p-2 rounded-lg mx-auto hover:shadow-lg transition-all duration-200"
                title="Expand Sidebar"
              >
                <Waves className="h-6 w-6 text-white" />
              </button>
            )}
            {!isCollapsed && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <ChevronLeft className="h-4 w-4 text-slate-600" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  title={isCollapsed ? item.name : ''}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && (
                    <span className="ml-3 font-medium">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Section - Sticky to bottom */}
        {!isCollapsed && (
          <div className="p-4 border-t border-slate-200 mt-auto flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{clientName}</p>
                <p className="text-xs text-slate-500">Premium Client</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="mobile-sidebar fixed left-0 top-0 h-full w-64 bg-white shadow-xl">
            {/* Mobile Header */}
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-2 rounded-lg">
                    <Waves className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-3">
                    <h1 className="text-lg font-bold text-slate-800">Blue Marina</h1>
                    <p className="text-xs text-slate-600">Asset Management</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-100"
                >
                  <X className="h-5 w-5 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 p-4">
              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="ml-3 font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}