"use client";
import React, { useState } from 'react';
import {
  Download,
  Calendar,
  Filter,
 
  BarChart3,
  Activity,
  Grid3X3,


  FileText,
  Image as ImageIcon,


  ChevronDown
} from 'lucide-react';
import { Button, Select } from '@/components/ui';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ComposedChart,
  Legend
} from 'recharts';
import {
  ValueType,
  NameType,
  TooltipProps
} from 'recharts/types/component/DefaultTooltipContent';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useQuery } from '@tanstack/react-query';
import type { ReportsData } from '@/types';

export default function ReportsAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'1M' | '3M' | '1Y'>('3M');
  const [selectedPortfolio, setSelectedPortfolio] = useState('all');
  const [chartType, setChartType] = useState('line');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const reportRef = React.useRef<HTMLDivElement>(null);

  const { data, isLoading, isError } = useQuery<ReportsData>({
    queryKey: ['reports'],
    queryFn: async () => {
      const res = await fetch('/api/reports');
      if (!res.ok) {
        throw new Error('Failed to fetch reports');
      }
      return res.json();
    },
  });

  if (isLoading) {
    return <div className="p-4 sm:p-6 lg:p-8">Loading reports...</div>;
  }

  if (isError || !data) {
    return <div className="p-4 sm:p-6 lg:p-8">Error loading reports.</div>;
  }

  const { performanceData, assetAllocationData, sectorData, riskMetricsData, incomeData } = data;

  const formatCurrency = (amount: bigint | ValueType) => {
    let value: number | bigint = 0;
    if (typeof amount === 'number' || typeof amount === 'bigint') {
      value = amount;
    } else if (Array.isArray(amount) && typeof amount[0] === 'number') {
      value = amount[0];
    } else if (typeof amount === 'string') {
      value = Number(amount);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: ValueType) => {
    const num = Number(value);
    return `${num >= 0 ? '+' : ''}${num.toFixed(1)}%`;
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('report.pdf');
    setShowExportMenu(false);
  };

  const handleExportImage = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current);
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = 'report.png';
    link.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleExportData = () => {
    if (!currentData) return;

    const headers = Object.keys(currentData[0]);

    const rows = currentData.map(row =>
      headers.map(h => String((row as Record<string, unknown>)[h] ?? '')).join(',')

    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.csv';
    link.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const currentData = performanceData[selectedPeriod];

  return (
    <div ref={reportRef} className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Reports & Analytics</h1>
            <p className="text-slate-600">Comprehensive portfolio analysis and performance insights</p>
          </div>
          
          {/* Export Actions */}
          <div className="relative">
            <Button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export Report</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
                <div className="py-1">
                  <Button
                    onClick={handleExportPDF}
                    variant="ghost"
                    className="flex items-center space-x-2 w-full px-4 py-2 text-left hover:bg-slate-50"
                  >
                    <FileText className="h-4 w-4 text-red-500" />
                    <span>Export as PDF</span>
                  </Button>
                  <Button
                    onClick={handleExportImage}
                    variant="ghost"
                    className="flex items-center space-x-2 w-full px-4 py-2 text-left hover:bg-slate-50"
                  >
                    <ImageIcon className="h-4 w-4 text-green-500" />
                    <span>Export as Image</span>
                  </Button>
                  <Button
                    onClick={handleExportData}
                    variant="ghost"
                    className="flex items-center space-x-2 w-full px-4 py-2 text-left hover:bg-slate-50"
                  >
                    <Grid3X3 className="h-4 w-4 text-blue-500" />
                    <span>Export Data (CSV)</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Time Period Filter */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-slate-500" />
              <span className="font-medium text-slate-700">Time Period:</span>
            </div>
            <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
              {['1M', '3M', '1Y'].map((period) => (
                <Button
                  key={period}
                  onClick={() => setSelectedPeriod(period as '1M' | '3M' | '1Y')}
                  variant="ghost"
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    selectedPeriod === period
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>

          {/* Portfolio Filter */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-slate-500" />
              <span className="font-medium text-slate-700">Portfolio:</span>
            </div>
            <Select
              value={selectedPortfolio}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedPortfolio(e.target.value)}
              className="px-3 py-2"
            >
              <option value="all">All Portfolios</option>
              <option value="growth">Growth Portfolio</option>
              <option value="income">Income Portfolio</option>
              <option value="balanced">Balanced Portfolio</option>
            </Select>
          </div>

          {/* Chart Type Selector */}
          <div className="flex items-center space-x-2">
            <span className="font-medium text-slate-700">View:</span>
            <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
              <Button
                onClick={() => setChartType('line')}
                variant="ghost"
                className={`p-2 rounded-md transition-colors ${
                  chartType === 'line' ? 'bg-white shadow-sm' : 'hover:bg-slate-200'
                }`}
                title="Line Chart"
              >
                <Activity className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setChartType('area')}
                variant="ghost"
                className={`p-2 rounded-md transition-colors ${
                  chartType === 'area' ? 'bg-white shadow-sm' : 'hover:bg-slate-200'
                }`}
                title="Area Chart"
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Performance Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Portfolio Performance vs Benchmark</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-slate-600">Portfolio</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
              <span className="text-sm text-slate-600">Benchmark</span>
            </div>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="period" stroke="#64748b" fontSize={12} />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12}
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                  <Tooltip
                    formatter={(value: ValueType, name: NameType) => [
                      formatCurrency(value),
                      name === 'portfolio' ? 'Portfolio' : 'Benchmark'
                    ]}
                    labelStyle={{ color: '#1e293b' }}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="portfolio"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#0ea5e9' }}
                />
                <Line
                  type="monotone"
                  dataKey="benchmark"
                  stroke="#64748b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#64748b', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            ) : (
              <AreaChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="period" stroke="#64748b" fontSize={12} />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12}
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                  <Tooltip
                    formatter={(value: ValueType, name: NameType) => [
                      formatCurrency(value),
                      name === 'portfolio' ? 'Portfolio' : 'Benchmark'
                    ]}
                  />
                <Area
                  type="monotone"
                  dataKey="portfolio"
                  stackId="1"
                  stroke="#0ea5e9"
                  fill="#0ea5e9"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="benchmark"
                  stackId="2"
                  stroke="#64748b"
                  fill="#64748b"
                  fillOpacity={0.1}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Asset Allocation & Sector Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Asset Allocation */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Asset Allocation</h3>
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetAllocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={1}
                  dataKey="value"
                >
                  {assetAllocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(
                    value: ValueType,
                    name: NameType,
                    props: TooltipProps<ValueType, NameType>
                  ) => [
                    `${value}% (${formatCurrency(props.payload.amount)})`,
                    props.payload.name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {assetAllocationData.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-1">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-slate-700">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-slate-900">{item.value}%</span>
                  <div className="text-xs text-slate-500">{formatCurrency(item.amount)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sector Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Sector Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis 
                  type="category" 
                  dataKey="sector" 
                  stroke="#64748b" 
                  fontSize={11}
                  width={80}
                />
                  <Tooltip
                    formatter={(value: ValueType, name: NameType) => [
                      name === 'allocation' ? `${value}%` : `${formatPercent(value)}`,
                      name === 'allocation' ? 'Allocation' : 'Performance'
                    ]}
                  />
                <Bar dataKey="allocation" fill="#0ea5e9" />
                <Bar dataKey="performance" fill="#14b8a6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Income Analysis & Risk Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Income Analysis */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Income Analysis</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={incomeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  formatter={(value: ValueType) => [formatCurrency(value)]}
                />
                <Legend />
                <Bar dataKey="dividends" stackId="a" fill="#0ea5e9" name="Dividends" />
                <Bar dataKey="interest" stackId="a" fill="#14b8a6" name="Interest" />
                <Bar dataKey="rent" stackId="a" fill="#f59e0b" name="Rent" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Metrics Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Risk Metrics</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-2 font-medium text-slate-700">Metric</th>
                  <th className="text-right py-3 px-2 font-medium text-slate-700">Portfolio</th>
                  <th className="text-right py-3 px-2 font-medium text-slate-700">Benchmark</th>
                  <th className="text-right py-3 px-2 font-medium text-slate-700">Target</th>
                </tr>
              </thead>
              <tbody>
                {riskMetricsData.map((metric, index) => (
                  <tr key={index} className="border-b border-slate-100">
                    <td className="py-3 px-2 text-slate-900">{metric.metric}</td>
                    <td className="py-3 px-2 text-right font-medium text-slate-900">
                      {metric.metric.includes('%') || metric.metric === 'Max Drawdown' 
                        ? `${metric.portfolio}%` 
                        : metric.portfolio}
                    </td>
                    <td className="py-3 px-2 text-right text-slate-600">
                      {metric.metric.includes('%') || metric.metric === 'Max Drawdown' 
                        ? `${metric.benchmark}%` 
                        : metric.benchmark}
                    </td>
                    <td className="py-3 px-2 text-right text-slate-500">
                      {metric.metric.includes('%') || metric.metric === 'Max Drawdown' 
                        ? `${metric.target}%` 
                        : metric.target}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">+12.4%</div>
            <div className="text-sm text-slate-600">YTD Return</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">+18.7%</div>
            <div className="text-sm text-slate-600">1 Year Return</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">+8.9%</div>
            <div className="text-sm text-slate-600">3 Year (Annualized)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">+11.2%</div>
            <div className="text-sm text-slate-600">Since Inception</div>
          </div>
        </div>
      </div>
    </div>
  );
}
