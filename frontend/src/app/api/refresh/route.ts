import { NextRequest, NextResponse } from 'next/server';
import { verify, sign, JwtPayload } from 'jsonwebtoken';

const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || 'refresh_secret';
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';

// 實務上 refresh token 需存資料庫，這裡簡化
export async function POST(req: NextRequest) {
  const { refresh_token } = await req.json();
  if (!refresh_token) {
    return NextResponse.json(
      { message: '缺少 refresh_token' },
      { status: 400 }
    );
  }
  try {
    const payload = verify(refresh_token, REFRESH_TOKEN_SECRET) as JwtPayload;

    // refresh token rotation: 產生新 tokenId
    const newRefreshToken = sign(
      { userId: payload.userId, tokenId: Date.now(), role: payload.role },
      REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    const newAccessToken = sign(
      { userId: payload.userId, role: payload.role },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    return NextResponse.json({
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    });
  } catch {
    return NextResponse.json(
      { message: 'refresh_token 無效' },
      { status: 401 }
    );
  }
}
