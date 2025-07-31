"use client"
import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Share2, 
  Eye,
  X,
  Calendar,
  FileType,
  Search,
  Filter,
  Grid,
  List,
  File,
  PieChart,
  Receipt,
  Shield,
  TrendingUp,
  Users,
  LucideProps
} from 'lucide-react';

// Mock documents data
const documentsData = [
  {
    id: 1,
    name: 'Portfolio Performance Report Q2 2025',
    type: 'PDF',
    category: 'Reports',
    size: '2.4 MB',
    date: '2025-05-28',
    description: 'Quarterly performance analysis and market insights',
    icon: TrendingUp,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    id: 2,
    name: 'Investment Agreement - Amendment 3',
    type: 'PDF',
    category: 'Contracts',
    size: '1.8 MB',
    date: '2025-05-25',
    description: 'Updated terms and conditions for investment portfolio',
    icon: Shield,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    id: 3,
    name: 'Monthly Invoice - May 2025',
    type: 'PDF',
    category: 'Invoices',
    size: '524 KB',
    date: '2025-05-20',
    description: 'Management fees and transaction costs',
    icon: Receipt,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  {
    id: 4,
    name: 'Risk Assessment Report',
    type: 'PDF',
    category: 'Reports',
    size: '3.1 MB',
    date: '2025-05-15',
    description: 'Comprehensive risk analysis for current holdings',
    icon: PieChart,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    id: 5,
    name: 'Account Opening Documentation',
    type: 'PDF',
    category: 'Contracts',
    size: '1.2 MB',
    date: '2025-01-10',
    description: 'Initial account setup and KYC documents',
    icon: Users,
    color: 'text-teal-600',
    bgColor: 'bg-teal-100'
  },
  {
    id: 6,
    name: 'Tax Summary 2024',
    type: 'XLSX',
    category: 'Reports',
    size: '890 KB',
    date: '2025-01-31',
    description: 'Annual tax summary for reporting purposes',
    icon: FileText,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100'
  }
];

const categories = ['All', 'Reports', 'Contracts', 'Invoices'];

type DocumentType = {
  id: number;
  name: string;
  type: string;
  category: string;
  size: string;
  date: string;
  description: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  color: string;
  bgColor: string;
};

type PreviewModalState = {
  isOpen: boolean;
  document: DocumentType | null;
};

export default function DocumentsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [previewModal, setPreviewModal] = useState<PreviewModalState>({ isOpen: false, document: null });

  // Filter documents based on category and search
  const filteredDocuments = documentsData.filter(doc => {
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownload = async (doc: DocumentType | null) => {
    if (!doc) return;
    try {
      const res = await fetch(`/api/documents/${doc.id}`);
      if (!res.ok) throw new Error('Failed to download');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${doc.name}.${doc.type.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Download failed');
    }
  };

  const handleShare = async (doc: DocumentType | null) => {
    if (!doc) return;
    try {
      const res = await fetch(`/api/documents/${doc.id}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const blob = await res.blob();
      const file = new globalThis.File([blob], `${doc.name}.${doc.type.toLowerCase()}`, { type: blob.type });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: doc.name,
          text: doc.description,
          files: [file]
        });
      } else {
        const url = window.URL.createObjectURL(blob);
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error(err);
      alert('Share failed');
    }
  };

  const handlePreview = (document: { id: number; name: string; type: string; category: string; size: string; date: string; description: string; icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>; color: string; bgColor: string; }) => {
    setPreviewModal({ isOpen: true, document });
  };

  const closePreview = () => {
    setPreviewModal({ isOpen: false, document: null });
  };

  const formatDate = (dateString: string | number | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Documents</h1>
          <p className="text-slate-600">Access and manage your important financial documents</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-4">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-slate-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((document) => {
              const Icon = document.icon;
              return (
                <div key={document.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${document.bgColor}`}>
                      <Icon className={`h-6 w-6 ${document.color}`} />
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePreview(document)}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(document)}
                        className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleShare(document)}
                        className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Share"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">{document.name}</h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{document.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(document.date)}
                      </span>
                      <span className="flex items-center">
                        <FileType className="h-4 w-4 mr-1" />
                        {document.size}
                      </span>
                    </div>
                    <span className="px-2 py-1 bg-slate-100 rounded-full text-xs font-medium">
                      {document.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-slate-900">Document</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-900">Category</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-900">Date</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-900">Size</th>
                    <th className="text-right py-4 px-6 font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((document) => {
                    const Icon = document.icon;
                    return (
                      <tr key={document.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${document.bgColor}`}>
                              <Icon className={`h-5 w-5 ${document.color}`} />
                            </div>
                            <div>
                              <h4 className="font-medium text-slate-900">{document.name}</h4>
                              <p className="text-sm text-slate-500">{document.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 bg-slate-100 rounded-full text-sm font-medium text-slate-700">
                            {document.category}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-600">{formatDate(document.date)}</td>
                        <td className="py-4 px-6 text-slate-600">{document.size}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handlePreview(document)}
                              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Preview"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDownload(document)}
                              className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Download"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleShare(document)}
                              className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Share"
                            >
                              <Share2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <File className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No documents found</h3>
            <p className="text-slate-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* Preview Modal */}
        {previewModal.isOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" onClick={closePreview}>
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Document Preview</h3>
                  <button
                    onClick={closePreview}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                {previewModal.document && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${previewModal.document.bgColor}`}>
                        <previewModal.document.icon className={`h-6 w-6 ${previewModal.document.color}`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{previewModal.document.name}</h4>
                        <p className="text-sm text-gray-500">{previewModal.document.category} • {previewModal.document.size}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700 mb-2">Description:</p>
                      <p className="text-gray-900">{previewModal.document.description}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700 mb-2">Document Details:</p>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Date:</span> {formatDate(previewModal.document.date)}</p>
                        <p><span className="font-medium">Type:</span> {previewModal.document.type}</p>
                        <p><span className="font-medium">Size:</span> {previewModal.document.size}</p>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 bg-white text-center">
                      <object
                        data={`/api/documents/${previewModal.document.id}`}
                        type="application/pdf"
                        className="w-full h-96"
                      >
                        <p className="text-gray-600">Preview unavailable.</p>
                      </object>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={() => handleDownload(previewModal.document)}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </button>
                      <button
                        onClick={() => handleShare(previewModal.document)}
                        className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Share2 className="h-4 w-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}