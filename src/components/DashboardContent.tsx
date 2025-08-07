"use client";
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Shield, 
  BarChart3, 
  Eye
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Button } from '@/components/ui';

interface PortfolioPoint {
  month: string;
  value: number;
  growth: number;
}

interface AllocationItem {
  name: string;
  value: number;
  color: string;
}

interface Transaction {
  id: number;
  type: string;
  asset: string;
  amount: string;
  date: string;
}

interface DashboardData {
  totalAssets: number;
  ytdGrowth: number;
  riskLevel: string;
  portfolioData: PortfolioPoint[];
  assetAllocation: AllocationItem[];
  recentTransactions: Transaction[];
}

interface DashboardContentProps {
  clientName: string;
}

export default function DashboardContent({ clientName }: DashboardContentProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const { data, isLoading, isError } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await fetch('/api/dashboard');
      if (!res.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      return res.json();
    },
  });

  if (isLoading) {
    return <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">Loading dashboard...</main>;
  }

  if (isError || !data) {
    return <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">Error loading dashboard.</main>;
  }

  const { totalAssets, ytdGrowth, riskLevel, portfolioData, assetAllocation, recentTransactions } = data;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
          Welcome back, {clientName}
        </h2>
        <p className="text-slate-600">
          {currentTime.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })} • {currentTime.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Assets</p>
              <p className="text-2xl md:text-3xl font-bold text-slate-900">{formatCurrency(totalAssets)}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">YTD Growth</p>
              <p className="text-2xl md:text-3xl font-bold text-green-600">+{ytdGrowth}%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Risk Level</p>
              <p className="text-2xl md:text-3xl font-bold text-amber-600">{riskLevel}</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <Shield className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Portfolio Performance Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Portfolio Performance</h3>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-slate-500" />
              <span className="text-sm text-slate-500">6 Months</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={portfolioData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value as number), 'Portfolio Value']}
                  labelStyle={{ color: '#1e293b' }}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#0ea5e9" 
                  strokeWidth={3}
                  dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#0ea5e9' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Asset Allocation */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Asset Allocation</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetAllocation}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {assetAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {assetAllocation.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-slate-600">{item.name}</span>
                <span className="text-sm font-medium text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Recent Transactions</h3>
          <Button variant="ghost" size="default" className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
            <Eye className="h-4 w-4" />
            <span>View All</span>
          </Button>
        </div>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'Buy' ? 'bg-green-100' : 
                  transaction.type === 'Sell' ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  {transaction.type === 'Buy' ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : transaction.type === 'Sell' ? (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  ) : (
                    <DollarSign className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{transaction.type} {transaction.asset}</p>
                  <p className="text-sm text-slate-500">{transaction.date}</p>
                </div>
              </div>
              <p className="font-semibold text-slate-900">{transaction.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}