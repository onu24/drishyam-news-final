import { NextRequest, NextResponse } from 'next/server';
import { searchArticles } from '@/lib/data';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') || '';
  if (!q.trim() || q.trim().length < 2) {
    return NextResponse.json([]);
  }
  try {
    const results = await searchArticles(q);
    return NextResponse.json(results.slice(0, 5));
  } catch (err) {
    console.error('[API/search] error:', err);
    return NextResponse.json([]);
  }
}
