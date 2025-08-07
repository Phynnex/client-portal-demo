import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DocumentsPage from '../page';

const sampleDocuments = [
  {
    id: 1,
    name: 'Annual Report',
    type: 'PDF',
    category: 'Reports',
    size: '1MB',
    date: '2023-01-01',
    description: 'Annual financial report',
    icon: 'FileText',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
  },
  {
    id: 2,
    name: 'Client Contract',
    type: 'PDF',
    category: 'Contracts',
    size: '500KB',
    date: '2023-02-01',
    description: 'Contract details',
    icon: 'FileText',
    color: 'text-green-500',
    bgColor: 'bg-green-100',
  },
];

const renderPage = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <DocumentsPage />
    </QueryClientProvider>
  );
};

describe('DocumentsPage', () => {
  beforeEach(() => {
    (globalThis as any).fetch = jest.fn();
    jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => sampleDocuments,
    } as Response);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('filters documents based on search input and category selection', async () => {
    renderPage();

    // Wait for documents to load
    expect(await screen.findByText('Annual Report')).toBeInTheDocument();
    expect(screen.getByText('Client Contract')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText('Search documents...');
    await userEvent.type(searchInput, 'Contract');

    await waitFor(() => {
      expect(screen.getByText('Client Contract')).toBeInTheDocument();
      expect(screen.queryByText('Annual Report')).not.toBeInTheDocument();
    });

    await userEvent.clear(searchInput);
    const categorySelect = screen.getByRole('combobox');
    await userEvent.selectOptions(categorySelect, 'Reports');

    await waitFor(() => {
      expect(screen.getByText('Annual Report')).toBeInTheDocument();
      expect(screen.queryByText('Client Contract')).not.toBeInTheDocument();
    });
  });

  it('shows no documents found when filters yield no results', async () => {
    renderPage();

    await screen.findByText('Annual Report');

    const searchInput = screen.getByPlaceholderText('Search documents...');
    await userEvent.type(searchInput, 'Report');

    const categorySelect = screen.getByRole('combobox');
    await userEvent.selectOptions(categorySelect, 'Contracts');

    expect(await screen.findByText('No documents found')).toBeInTheDocument();
  });
});

