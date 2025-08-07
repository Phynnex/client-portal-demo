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
import { Button, Input, Select } from '@/components/ui';
import { useQuery } from '@tanstack/react-query';
import type { Account } from '@/types';

const iconMap = { TrendingUp, Briefcase, Home, Banknote, Building2 };

const accountTypes = ['All', 'Investment', 'Retirement', 'Real Estate', 'Savings', 'Fixed Income'];

export default function AccountAggregationPage() {
  const [selectedType, setSelectedType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const { data: accountsData = [], isLoading, isError } = useQuery<Account[]>({
    queryKey: ['accounts'],
    queryFn: async () => {
      const res = await fetch('/api/accounts');
      if (!res.ok) {
        throw new Error('Failed to fetch accounts');
      }
      return res.json();
    },
  });

  if (isLoading) {
    return <div className="p-4 sm:p-6 lg:p-8">Loading accounts...</div>;
  }

  if (isError) {
    return <div className="p-4 sm:p-6 lg:p-8">Error loading accounts.</div>;
  }

  const SelectedIcon = selectedAccount ? iconMap[selectedAccount.icon as keyof typeof iconMap] : null;
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
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Account Aggregation</h1>
        <p className="text-slate-600 dark:text-slate-400">Overview of all your accounts and portfolios</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Total Balance</p>
              <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(totalBalance)}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Total Change</p>
              <p className={`text-2xl md:text-3xl font-bold ${totalChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>\
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

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Performance</p>
              <p className={`text-2xl md:text-3xl font-bold ${totalChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>\
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
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search accounts..."
              value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Account Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            <Select
              value={selectedType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedType(e.target.value)}
              className="px-3 py-2 dark:bg-slate-900 dark:text-slate-100"
            >
              {accountTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Accounts List */}
      <div className="space-y-4">
        {filteredAccounts.map((account) => {
          const Icon = iconMap[account.icon as keyof typeof iconMap];
          return (
            <div key={account.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className={`p-3 rounded-lg ${account.bgColor}`}>
                    <Icon className={`h-6 w-6 ${account.color}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">{account.name}</h3>
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
                        <p className="text-slate-500 dark:text-slate-400">Account</p>
                        <p className="font-medium text-slate-900 dark:text-slate-100">{account.accountNumber}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400">Balance</p>
                        <p className="font-bold text-lg text-slate-900 dark:text-slate-100">{formatCurrency(account.balance)}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400">Change</p>
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
                        <p className="text-slate-500 dark:text-slate-400">YTD Return</p>
                        <p className="font-medium text-green-600">+{account.ytdReturn}%</p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {account.assetTypes.map((asset, index) => (
                        <span key={index} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md text-xs font-medium">
                          {asset}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    onClick={() => handleViewDetails(account)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </Button>
                  <Button variant="ghost" className="p-2 text-slate-400 dark:text-slate-300 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
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
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">No accounts found</h3>
          <p className="text-slate-600 dark:text-slate-400">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Account Details Modal */}
      {selectedAccount && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Account Details</h3>
                <Button
                  onClick={closeDetails}
                  variant="ghost"
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <MoreVertical className="h-5 w-5 text-gray-500 dark:text-slate-400 rotate-45" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${selectedAccount.bgColor}`}>
                    {SelectedIcon && <SelectedIcon className={`h-8 w-8 ${selectedAccount.color}`} />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-slate-100">{selectedAccount.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-slate-400">{selectedAccount.type} • {selectedAccount.accountNumber}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-slate-300 mb-1">Current Balance</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-slate-100">{formatCurrency(selectedAccount.balance)}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-slate-300 mb-1">Change</p>
                    <p className={`text-xl font-bold ${selectedAccount.change >= 0 ? 'text-green-600' : 'text-red-600'}`}> 
                      {formatCurrency(selectedAccount.change)}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-slate-300 mb-1">Risk Level</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-slate-100">{selectedAccount.riskLevel}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-slate-300 mb-1">YTD Return</p>
                    <p className="text-lg font-semibold text-green-600">+{selectedAccount.ytdReturn}%</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-slate-300 mb-2">Asset Types</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedAccount.assetTypes.map((asset, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 rounded-full text-sm font-medium">
                        {asset}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-slate-600">
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    Last updated: {new Date(selectedAccount.lastUpdated).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    onClick={closeDetails}
                    className="flex-1 bg-gray-600 dark:bg-slate-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 dark:hover:bg-slate-700 transition-colors"
                  >
                    Close
                  </Button>
                  <Button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Manage Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}