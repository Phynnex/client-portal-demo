import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { conversationId, message } = await request.json();
  if (!conversationId || !message) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  // simple echo response
  return NextResponse.json({ reply: "Thank you for your message. We'll get back to you shortly." });
}
