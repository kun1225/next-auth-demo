import 'server-only';

import { verify, JwtPayload, sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import type { User } from '@/types/user';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || 'refresh_secret';

export async function getUser() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token');
  const refreshToken = cookieStore.get('refresh_token');

  if (!accessToken && !refreshToken) {
    return null;
  }

  if (accessToken) {
    return verify(accessToken.value, ACCESS_TOKEN_SECRET) as JwtPayload & User;
  }

  if (refreshToken) {
    const payload = verify(
      refreshToken.value,
      REFRESH_TOKEN_SECRET
    ) as JwtPayload & User;

    const newAccessToken = sign(
      { userId: payload.userId, role: payload.role, name: payload.name },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    const newRefreshToken = sign(
      { userId: payload.userId, role: payload.role, name: payload.name },
      REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    cookieStore.set('access_token', newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(Date.now() + 15 * 60 * 1000),
    });

    cookieStore.set('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return payload;
  }
}
