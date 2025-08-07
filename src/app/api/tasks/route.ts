import { NextResponse } from 'next/server';

const tasksData = [
  {
    id: 1,
    title: 'Upload KYC Documents',
    description: 'Please upload your updated Know Your Customer documents for regulatory compliance.',
    priority: 'high',
    status: 'pending',
    dueDate: '2025-06-05',
    category: 'compliance',
    icon: 'Upload',
    createdAt: '2025-05-20',
  },
  {
    id: 2,
    title: 'Review Investment Agreement Amendment',
    description: 'New terms and conditions require your review and digital signature.',
    priority: 'medium',
    status: 'in-progress',
    dueDate: '2025-06-10',
    category: 'legal',
    icon: 'FileText',
    createdAt: '2025-05-25',
  },
  {
    id: 3,
    title: 'Schedule Quarterly Portfolio Review',
    description: 'Book your Q2 portfolio review meeting with your advisor.',
    priority: 'medium',
    status: 'pending',
    dueDate: '2025-06-15',
    category: 'meeting',
    icon: 'Calendar',
    createdAt: '2025-05-28',
  },
  {
    id: 4,
    title: 'Update Risk Assessment Profile',
    description: 'Annual risk tolerance assessment is due for review.',
    priority: 'low',
    status: 'completed',
    dueDate: '2025-05-30',
    category: 'profile',
    icon: 'Shield',
    createdAt: '2025-05-15',
  },
  {
    id: 5,
    title: 'Verify Bank Account Information',
    description: 'Confirm your linked bank account details for dividend payments.',
    priority: 'high',
    status: 'pending',
    dueDate: '2025-06-01',
    category: 'banking',
    icon: 'CreditCard',
    createdAt: '2025-05-29',
  },
];

export async function GET() {
  return NextResponse.json(tasksData);
}
