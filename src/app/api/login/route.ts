import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (email === 'demo@bluemarina.com' && password === 'demo123') {
    return NextResponse.json({ success: true, name: 'Johner Anderson' });
  }
  return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
}
