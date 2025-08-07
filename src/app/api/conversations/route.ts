import { NextResponse } from 'next/server';

const conversationsData = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Portfolio Manager',
    avatar: null,
    lastMessage: 'Your Q2 report is ready for review. The portfolio performance exceeded expectations.',
    timestamp: '2025-05-29T15:30:00Z',
    unread: 2,
    online: true,
    type: 'advisor',
  },
  {
    id: 2,
    name: 'Mike Chen',
    role: 'Senior Advisor',
    avatar: null,
    lastMessage: "Let's schedule a call to discuss the new investment opportunities.",
    timestamp: '2025-05-29T10:15:00Z',
    unread: 0,
    online: false,
    type: 'advisor',
  },
  {
    id: 3,
    name: 'Blue Marina Support',
    role: 'Customer Support',
    avatar: null,
    lastMessage: 'Thank you for contacting us. Your document request has been processed.',
    timestamp: '2025-05-28T16:45:00Z',
    unread: 0,
    online: true,
    type: 'support',
  },
  {
    id: 4,
    name: 'Emma Davis',
    role: 'Tax Specialist',
    avatar: null,
    lastMessage: "I've updated your tax optimization strategy. Please review at your convenience.",
    timestamp: '2025-05-28T09:20:00Z',
    unread: 1,
    online: false,
    type: 'advisor',
  },
];

export async function GET() {
  return NextResponse.json(conversationsData);
}
