import { NextResponse } from 'next/server';

const notificationsData = [
  {
    id: 1,
    title: 'Portfolio Performance Update',
    message: 'Your portfolio has gained 2.3% this week, outperforming the market.',
    type: 'success',
    timestamp: '2025-05-29T10:30:00Z',
    read: false,
    icon: 'TrendingUp',
  },
  {
    id: 2,
    title: 'Document Processing Complete',
    message: 'Your Q2 tax documents have been processed and are ready for download.',
    type: 'info',
    timestamp: '2025-05-29T09:15:00Z',
    read: false,
    icon: 'FileText',
  },
  {
    id: 3,
    title: 'Upcoming Task Deadline',
    message: 'KYC document upload is due in 7 days. Please complete soon.',
    type: 'warning',
    timestamp: '2025-05-28T16:45:00Z',
    read: true,
    icon: 'AlertCircle',
  },
  {
    id: 4,
    title: 'New Message from Advisor',
    message: 'Sarah Johnson sent you a message about your investment strategy.',
    type: 'info',
    timestamp: '2025-05-28T14:20:00Z',
    read: true,
    icon: 'User',
  },
  {
    id: 5,
    title: 'Security Alert',
    message: 'New device login detected from Chrome on Windows. Was this you?',
    type: 'warning',
    timestamp: '2025-05-27T11:30:00Z',
    read: false,
    icon: 'Shield',
  },
];

export async function GET() {
  return NextResponse.json(notificationsData);
}
