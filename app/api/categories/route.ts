import { NextResponse } from 'next/server';
import { getAllCategories } from '@/lib/data';

export async function GET() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json(categories);
  } catch (err) {
    console.error('[API/categories] error:', err);
    return NextResponse.json([]);
  }
}
