import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const filePath = id === '6'
    ? path.join(process.cwd(), 'public/documents/sample.xlsx')
    : path.join(process.cwd(), 'public/documents/sample.pdf');

  try {
    const fileBuffer = await fs.readFile(filePath);
    const ext = path.extname(filePath);
    const contentType = ext === '.xlsx'
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      : 'application/pdf';
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: { 'Content-Type': contentType }
    });
  } catch (error) {
    return new NextResponse('File not found', { status: 404 });
  }
}
