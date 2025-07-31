import React from 'react';
import { LucideProps } from 'lucide-react';

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  category: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  createdAt: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface DocumentType {
  id: number;
  name: string;
  type: string;
  category: string;
  size: string;
  date: string;
  description: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;
  color: string;
  bgColor: string;
}
