import { NextResponse } from 'next/server';

const performanceData = {
  '1M': [
    { period: 'Week 1', portfolio: 2680000, benchmark: 2650000, growth: 2.1 },
    { period: 'Week 2', portfolio: 2720000, benchmark: 2680000, growth: 1.5 },
    { period: 'Week 3', portfolio: 2695000, benchmark: 2670000, growth: -0.9 },
    { period: 'Week 4', portfolio: 2750000, benchmark: 2700000, growth: 2.0 },
  ],
  '3M': [
    { period: 'Jan', portfolio: 2400000, benchmark: 2380000, growth: 2.1 },
    { period: 'Feb', portfolio: 2450000, benchmark: 2420000, growth: 2.3 },
    { period: 'Mar', portfolio: 2380000, benchmark: 2390000, growth: -2.9 },
    { period: 'Apr', portfolio: 2520000, benchmark: 2480000, growth: 5.9 },
    { period: 'May', portfolio: 2680000, benchmark: 2620000, growth: 6.3 },
    { period: 'Jun', portfolio: 2750000, benchmark: 2680000, growth: 2.6 },
  ],
  '1Y': [
    { period: 'Q1 2024', portfolio: 2200000, benchmark: 2180000, growth: 8.2 },
    { period: 'Q2 2024', portfolio: 2350000, benchmark: 2320000, growth: 6.8 },
    { period: 'Q3 2024', portfolio: 2480000, benchmark: 2440000, growth: 5.5 },
    { period: 'Q4 2024', portfolio: 2580000, benchmark: 2520000, growth: 4.0 },
    { period: 'Q1 2025', portfolio: 2650000, benchmark: 2580000, growth: 2.7 },
    { period: 'Q2 2025', portfolio: 2750000, benchmark: 2680000, growth: 3.8 },
  ],
};

const assetAllocationData = [
  { name: 'US Equities', value: 35, amount: 962500, color: '#0ea5e9' },
  { name: 'International Equities', value: 15, amount: 412500, color: '#06b6d4' },
  { name: 'Government Bonds', value: 20, amount: 550000, color: '#14b8a6' },
  { name: 'Corporate Bonds', value: 10, amount: 275000, color: '#f59e0b' },
  { name: 'Real Estate', value: 12, amount: 330000, color: '#8b5cf6' },
  { name: 'Commodities', value: 5, amount: 137500, color: '#ef4444' },
  { name: 'Cash', value: 3, amount: 82500, color: '#64748b' },
];

const sectorData = [
  { sector: 'Technology', allocation: 25, performance: 15.2 },
  { sector: 'Healthcare', allocation: 18, performance: 12.8 },
  { sector: 'Financial Services', allocation: 15, performance: 8.9 },
  { sector: 'Consumer Goods', allocation: 12, performance: 6.7 },
  { sector: 'Energy', allocation: 10, performance: 18.5 },
  { sector: 'Industrial', allocation: 8, performance: 11.3 },
  { sector: 'Utilities', allocation: 7, performance: 5.4 },
  { sector: 'Materials', allocation: 5, performance: 9.8 },
];

const riskMetricsData = [
  { metric: 'Volatility', portfolio: 12.4, benchmark: 14.2, target: 12.0 },
  { metric: 'Sharpe Ratio', portfolio: 1.24, benchmark: 1.08, target: 1.20 },
  { metric: 'Beta', portfolio: 0.92, benchmark: 1.00, target: 0.95 },
  { metric: 'Max Drawdown', portfolio: -8.2, benchmark: -12.5, target: -10.0 },
];

const incomeData = [
  { month: 'Jan', dividends: 12500, interest: 8200, rent: 5500 },
  { month: 'Feb', dividends: 13200, interest: 8400, rent: 5500 },
  { month: 'Mar', dividends: 11800, interest: 8100, rent: 5500 },
  { month: 'Apr', dividends: 14200, interest: 8600, rent: 5500 },
  { month: 'May', dividends: 15800, interest: 8800, rent: 5500 },
  { month: 'Jun', dividends: 16500, interest: 9100, rent: 5500 },
];

export async function GET() {
  return NextResponse.json({
    performanceData,
    assetAllocationData,
    sectorData,
    riskMetricsData,
    incomeData,
  });
}
