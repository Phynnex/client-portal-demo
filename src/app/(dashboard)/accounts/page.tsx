"use client";
import React, { useState } from 'react';
import { 
  CreditCard,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  MoreVertical,
  BarChart3,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Banknote,
  Home,
  Briefcase
} from 'lucide-react';

// Mock account data
const accountsData = [
  {
    id: 1,
    name: 'Primary Investment Portfolio',
    type: 'Investment',
    accountNumber: '****4521',
    balance: 1850000,
    change: 45000,
    changePercent: 2.49,
    assetTypes: ['Stocks', 'Bonds', 'ETFs'],
    lastUpdated: '2025-05-29',
    status: 'Active',
    icon: TrendingUp,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    riskLevel: 'Moderate',
    ytdReturn: 12.4
  },
  {
    id: 2,
    name: 'Retirement Savings Account',
    type: 'Retirement',
    accountNumber: '****8932',
    balance: 650000,
    change: -8500,
    changePercent: -1.29,
    assetTypes: ['Target Date Funds', 'Bonds'],
    lastUpdated: '2025-05-29',
    status: 'Active',
    icon: Briefcase,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    riskLevel: 'Conservative',
    ytdReturn: 8.7
  },
  {
    id: 3,
    name: 'Real Estate Investment Trust',
    type: 'Real Estate',
    accountNumber: '****2847',
    balance: 250000,
    change: 12000,
    changePercent: 5.04,
    assetTypes: ['REITs', 'Real Estate Funds'],
    lastUpdated: '2025-05-28',
    status: 'Active',
    icon: Home,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    riskLevel: 'Moderate-High',
    ytdReturn: 15.2
  },
  {
    id: 4,
    name: 'High-Yield Savings',
    type: 'Savings',
    accountNumber: '****5634',
    balance: 75000,
    change: 250,
    changePercent: 0.33,
    assetTypes: ['Cash', 'Money Market'],
    lastUpdated: '2025-05-29',
    status: 'Active',
    icon: Banknote,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    riskLevel: 'Low',
    ytdReturn: 4.2
  },
  {
    id: 5,
    name: 'Corporate Bond Portfolio',
    type: 'Fixed Income',
    accountNumber: '****9173',
    balance: 180000,
    change: 3200,
    changePercent: 1.81,
    assetTypes: ['Corporate Bonds', 'Treasury Bills'],
    lastUpdated: '2025-05-29',
    status: 'Active',
    icon: Building2,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    riskLevel: 'Low-Moderate',
    ytdReturn: 6.8
  }
];

const accountTypes = ['All', 'Investment', 'Retirement', 'Real Estate', 'Savings', 'Fixed Income'];

type Account = typeof accountsData[number];

export default function AccountAggregationPage() {
  const [selectedType, setSelectedType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  // Filter accounts
  const filteredAccounts = accountsData.filter(account => {
    const matchesType = selectedType === 'All' || account.type === selectedType;
    const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.accountNumber.includes(searchTerm);
    return matchesType && matchesSearch;
  });

  // Calculate totals
  const totalBalance = filteredAccounts.reduce((sum, account) => sum + account.balance, 0);
  const totalChange = filteredAccounts.reduce((sum, account) => sum + account.change, 0);
  const totalChangePercent = totalBalance > 0 ? (totalChange / (totalBalance - totalChange)) * 100 : 0;

  const formatCurrency = (amount: string | number | bigint) => {
    const numericAmount = typeof amount === 'string' ? Number(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericAmount);
  };

  const formatPercent = (percent: number) => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  const handleViewDetails = (account: Account) => {
    setSelectedAccount(account);
  };

  const closeDetails = () => {
    setSelectedAccount(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Account Aggregation</h1>
        <p className="text-slate-600">Overview of all your accounts and portfolios</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Balance</p>
              <p className="text-2xl md:text-3xl font-bold text-slate-900">{formatCurrency(totalBalance)}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Change</p>
              <p className={`text-2xl md:text-3xl font-bold ${totalChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(totalChange)}
              </p>
            </div>
            <div className={`p-3 rounded-full ${totalChange >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              {totalChange >= 0 ? (
                <TrendingUp className={`h-6 w-6 ${totalChange >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              ) : (
                <TrendingDown className="h-6 w-6 text-red-600" />
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Performance</p>
              <p className={`text-2xl md:text-3xl font-bold ${totalChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercent(totalChangePercent)}
              </p>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <BarChart3 className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Account Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-slate-500" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {accountTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Accounts List */}
      <div className="space-y-4">
        {filteredAccounts.map((account) => {
          const Icon = account.icon;
          return (
            <div key={account.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className={`p-3 rounded-lg ${account.bgColor}`}>
                    <Icon className={`h-6 w-6 ${account.color}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-900 truncate">{account.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          account.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {account.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500">Account</p>
                        <p className="font-medium text-slate-900">{account.accountNumber}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Balance</p>
                        <p className="font-bold text-lg text-slate-900">{formatCurrency(account.balance)}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Change</p>
                        <div className="flex items-center space-x-1">
                          {account.change >= 0 ? (
                            <ArrowUpRight className="h-4 w-4 text-green-600" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-600" />
                          )}
                          <span className={`font-medium ${account.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(Math.abs(account.change))} ({formatPercent(account.changePercent)})
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-500">YTD Return</p>
                        <p className="font-medium text-green-600">+{account.ytdReturn}%</p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {account.assetTypes.map((asset, index) => (
                        <span key={index} className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                          {asset}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleViewDetails(account)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                  <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredAccounts.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No accounts found</h3>
          <p className="text-slate-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Account Details Modal */}
      {selectedAccount && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Account Details</h3>
                <button
                  onClick={closeDetails}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MoreVertical className="h-5 w-5 text-gray-500 rotate-45" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${selectedAccount.bgColor}`}>
                    <selectedAccount.icon className={`h-8 w-8 ${selectedAccount.color}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{selectedAccount.name}</h4>
                    <p className="text-sm text-gray-500">{selectedAccount.type} • {selectedAccount.accountNumber}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Current Balance</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(selectedAccount.balance)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Change</p>
                    <p className={`text-xl font-bold ${selectedAccount.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(selectedAccount.change)}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Risk Level</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedAccount.riskLevel}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">YTD Return</p>
                    <p className="text-lg font-semibold text-green-600">+{selectedAccount.ytdReturn}%</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Asset Types</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedAccount.assetTypes.map((asset, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {asset}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Last updated: {new Date(selectedAccount.lastUpdated).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={closeDetails}
                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Manage Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}