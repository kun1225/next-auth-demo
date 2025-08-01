import { NextRequest, NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { users } from '@/lib/mockData';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || 'refresh_secret';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return NextResponse.json({ message: '帳號或密碼錯誤' }, { status: 401 });
  }

  const cookieStore = await cookies();

  const accessToken = sign(
    { name: user.name, userId: user.id, role: user.role },
    ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = sign(
    {
      userId: user.id,
      tokenId: Date.now(),
      role: user.role,
    },
    REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  // 實務上 refresh token 需存資料庫，這裡簡化
  cookieStore.set('access_token', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    expires: new Date(Date.now() + 15 * 60 * 1000),
  });

  cookieStore.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return NextResponse.json({
    success: true,
    message: '登入成功',
    data: user,
  });
}
