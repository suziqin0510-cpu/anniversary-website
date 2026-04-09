import { NextRequest, NextResponse } from 'next/server';
import {
  getWishes,
  saveWish,
  updateWish,
  deleteWish,
  seedWishes,
} from '@/lib/wish-store';

const DEFAULT_WISHES = [
  { title: '事业进阶', description: '搞定 AI 项目和所有回款，给我们的生活换个更硬核的动力引擎。', completed: false, iconKey: 'rocket' },
  { title: '全力支持', description: '陪你读完马来西亚 USM，那是你发光的舞台，而我会是你永远的头号粉丝。', completed: false, iconKey: 'heart' },
  { title: '终极小窝', description: '从租房到买房。我要给你买一套带超大落地窗的房子，让阳光铺满盼盼和石榴睡觉的地方。', completed: false, iconKey: 'home' },
  { title: '亚庇海滩婚礼测试', description: '等我们学成归来，在亚庇看落日的时候，先在海滩上彩排一场只属于我们四个（还有盼盼和石榴）的小婚礼。', completed: false, iconKey: 'beach' },
  { title: "一起领'红本本'", description: "搞定所有事业后，我们要手牵手去民政局，把你从'小公主'变成'苏太太'。", completed: false, iconKey: 'ring' },
  { title: '环球蜜月之旅', description: '结婚后，我要带你去世界打卡，把我们的小窝从昆明铺向地球的每一个角落。', completed: false, iconKey: 'honeymoon' },
  { title: '环球打卡', description: '等我回血，第一站我们就去亚庇看落日，然后是全世界。', completed: false, iconKey: 'plane' },
];

export async function GET() {
  try {
    let wishes = await getWishes();
    if (wishes.length === 0) {
      wishes = await seedWishes(DEFAULT_WISHES);
    }
    return NextResponse.json({ success: true, data: wishes });
  } catch (err) {
    console.error('GET /api/wishes error:', err);
    return NextResponse.json({ success: false, error: '读取愿望清单失败' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, iconKey } = body;
    if (!title || !description) {
      return NextResponse.json({ success: false, error: '标题和描述不能为空' }, { status: 400 });
    }
    const wish = await saveWish(title, description, iconKey);
    const wishes = await getWishes();
    return NextResponse.json({ success: true, data: wishes, wish });
  } catch (err) {
    console.error('POST /api/wishes error:', err);
    return NextResponse.json({ success: false, error: '保存愿望失败' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...patch } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: '缺少愿望 ID' }, { status: 400 });
    }
    const updated = await updateWish(id, patch);
    if (!updated) {
      return NextResponse.json({ success: false, error: '未找到该愿望' }, { status: 404 });
    }
    const wishes = await getWishes();
    return NextResponse.json({ success: true, data: wishes, wish: updated });
  } catch (err) {
    console.error('PUT /api/wishes error:', err);
    return NextResponse.json({ success: false, error: '更新愿望失败' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: '缺少愿望 ID' }, { status: 400 });
    }
    await deleteWish(id);
    const wishes = await getWishes();
    return NextResponse.json({ success: true, data: wishes });
  } catch (err) {
    console.error('DELETE /api/wishes error:', err);
    return NextResponse.json({ success: false, error: '删除愿望失败' }, { status: 500 });
  }
}
