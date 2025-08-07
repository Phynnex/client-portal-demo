import { NextResponse } from 'next/server';
import {
  PortfolioPoint,
  AllocationItem,
  Transaction,
  DashboardData,
} from '@/types';

const portfolioData: PortfolioPoint[] = [
  { month: 'Jan', value: 2400000, growth: 2.1 },
  { month: 'Feb', value: 2450000, growth: 2.3 },
  { month: 'Mar', value: 2380000, growth: -2.9 },
  { month: 'Apr', value: 2520000, growth: 5.9 },
  { month: 'May', value: 2680000, growth: 6.3 },
  { month: 'Jun', value: 2750000, growth: 2.6 },
];

const assetAllocation: AllocationItem[] = [
  { name: 'US Equities', value: 35, color: '#0ea5e9' },
  { name: 'International Equities', value: 15, color: '#06b6d4' },
  { name: 'Government Bonds', value: 20, color: '#14b8a6' },
  { name: 'Corporate Bonds', value: 10, color: '#f59e0b' },
  { name: 'Real Estate', value: 12, color: '#8b5cf6' },
  { name: 'Commodities', value: 5, color: '#ef4444' },
  { name: 'Cash', value: 3, color: '#64748b' },
];

const recentTransactions: Transaction[] = [
  { id: 1, type: 'Buy', asset: 'AAPL', amount: '$15,000', date: '2025-05-28' },
  { id: 2, type: 'Sell', asset: 'TSLA', amount: '$8,500', date: '2025-05-20' },
  { id: 3, type: 'Buy', asset: 'AMZN', amount: '$12,000', date: '2025-05-15' },
];

export async function GET() {
  const data: DashboardData = {
    totalAssets: 2750000,
    ytdGrowth: 6.3,
    riskLevel: 'Moderate',
    portfolioData,
    assetAllocation,
    recentTransactions,
  };

  return NextResponse.json(data);
}

