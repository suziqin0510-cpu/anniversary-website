import { NextRequest, NextResponse } from 'next/server';
import { getLetters, saveLetter } from '@/lib/letter-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content } = body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: '信件内容不能为空' }, { status: 400 });
    }

    const letter = await saveLetter(content.trim());
    return NextResponse.json({ success: true, letter });
  } catch (error) {
    console.error('保存信件失败:', error);
    return NextResponse.json({ error: '保存失败，请稍后重试' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const letters = await getLetters();
    return NextResponse.json({ success: true, letters });
  } catch (error) {
    console.error('读取信件失败:', error);
    return NextResponse.json({ error: '读取失败' }, { status: 500 });
  }
}
