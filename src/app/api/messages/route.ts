import { NextResponse } from 'next/server';
import type { Message } from '@/types';

const messagesData: Record<string, Message[]> = {
  '1': [
    {
      id: 1,
      senderId: 1,
      senderName: 'Sarah Johnson',
      content: "Good afternoon, John! I hope you're having a great day.",
      timestamp: '2025-05-29T14:00:00Z',
      type: 'received',
    },
    {
      id: 2,
      senderId: 'user',
      senderName: '',
      content: 'Hello Sarah! Yes, thank you. How are things on your end?',
      timestamp: '2025-05-29T14:05:00Z',
      type: 'sent',
    },
    {
      id: 3,
      senderId: 1,
      senderName: 'Sarah Johnson',
      content: "Great! I wanted to update you on your portfolio performance. We've seen some excellent returns this quarter.",
      timestamp: '2025-05-29T14:10:00Z',
      type: 'received',
    },
    {
      id: 4,
      senderId: 'user',
      senderName: '',
      content: 'That sounds wonderful! Can you share the details?',
      timestamp: '2025-05-29T14:15:00Z',
      type: 'sent',
    },
    {
      id: 5,
      senderId: 1,
      senderName: 'Sarah Johnson',
      content: "Absolutely! Your Q2 report is ready for review. The portfolio performance exceeded expectations with a 12.4% YTD return. I'll send over the detailed analysis shortly.",
      timestamp: '2025-05-29T15:30:00Z',
      type: 'received',
    },
  ],
  '2': [
    {
      id: 1,
      senderId: 2,
      senderName: 'Mike Chen',
      content: "Hi John, I hope you're doing well. I wanted to reach out about some new investment opportunities.",
      timestamp: '2025-05-29T09:30:00Z',
      type: 'received',
    },
    {
      id: 2,
      senderId: 'user',
      senderName: '',
      content: "Hi Mike! I'm interested to hear about them.",
      timestamp: '2025-05-29T09:45:00Z',
      type: 'sent',
    },
    {
      id: 3,
      senderId: 2,
      senderName: 'Mike Chen',
      content: "Let's schedule a call to discuss the new investment opportunities.",
      timestamp: '2025-05-29T10:15:00Z',
      type: 'received',
    },
  ],
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get('conversationId');
  if (!conversationId) {
    return NextResponse.json({ error: 'conversationId is required' }, { status: 400 });
  }
  return NextResponse.json(messagesData[conversationId] || []);
}

export async function POST(request: Request) {
  const { conversationId, message } = await request.json();
  if (!conversationId || !message) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  // simple echo response
  return NextResponse.json({ reply: "Thank you for your message. We'll get back to you shortly." });
}
