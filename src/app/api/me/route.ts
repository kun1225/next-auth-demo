import { NextRequest, NextResponse } from 'next/server';
import { verify, JwtPayload } from 'jsonwebtoken';
import { users } from '@/lib/mockData';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return NextResponse.json({ message: '缺少 access_token' }, { status: 401 });
  }
  const token = auth.replace('Bearer ', '');

  try {
    const payload = verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
    const user = users.find(u => u.id === payload.userId);
    if (!user) {
      return NextResponse.json({ message: '用戶不存在' }, { status: 404 });
    }
    return NextResponse.json({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  } catch {
    return NextResponse.json({ message: 'access_token 無效' }, { status: 401 });
  }
}
