import React from 'react';

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  category: string;
  icon: string;
  createdAt: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  icon: string;
}

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface Document {
  id: number;
  name: string;
  type: string;
  category: string;
  size: string;
  date: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
}

export interface Account {
  id: number;
  name: string;
  type: string;
  accountNumber: string;
  balance: number;
  change: number;
  changePercent: number;
  assetTypes: string[];
  lastUpdated: string;
  status: string;
  icon: string;
  color: string;
  bgColor: string;
  riskLevel: string;
  ytdReturn: number;
}

export interface Conversation {
  id: number;
  name: string;
  role: string;
  avatar: string | null;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  type: string;
}

export interface Message {
  id: number;
  senderId: number | string;
  senderName: string;
  content: string;
  timestamp: string;
  type: string;
}

export interface PerformanceRecord {
  period: string;
  portfolio: number;
  benchmark: number;
  growth: number;
}

export type PerformanceData = Record<string, PerformanceRecord[]>;

export interface AssetAllocationRecord {
  name: string;
  value: number;
  amount: number;
  color: string;
}

export interface SectorRecord {
  sector: string;
  allocation: number;
  performance: number;
}

export interface RiskMetricRecord {
  metric: string;
  portfolio: number;
  benchmark: number;
  target: number;
}

export interface IncomeRecord {
  month: string;
  dividends: number;
  interest: number;
  rent: number;
}

export interface ReportsData {
  performanceData: PerformanceData;
  assetAllocationData: AssetAllocationRecord[];
  sectorData: SectorRecord[];
  riskMetricsData: RiskMetricRecord[];
  incomeData: IncomeRecord[];
}

export interface PortfolioPoint {
  month: string;
  value: number;
  growth: number;
}

export interface AllocationItem {
  name: string;
  value: number;
  color: string;
}

export interface Transaction {
  id: number;
  type: string;
  asset: string;
  amount: string;
  date: string;
}

export interface DashboardData {
  totalAssets: number;
  ytdGrowth: number;
  riskLevel: string;
  portfolioData: PortfolioPoint[];
  assetAllocation: AllocationItem[];
  recentTransactions: Transaction[];
}
