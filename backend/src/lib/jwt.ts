import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';
const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN_DAYS = 7;

export interface TokenPayload {
  sub: number; // user id
  type: 'access' | 'refresh';
  jti: string; // JWT ID
  iat?: number;
  exp?: number;
}

export interface GeneratedTokens {
  accessToken: string;
  refreshToken: string;
}

export async function generateTokens(
  userId: number,
  deviceInfo?: any
): Promise<GeneratedTokens> {
  const jti = uuidv4();

  const accessToken = jwt.sign(
    {
      sub: userId,
      type: 'access',
      jti: jti,
    } as TokenPayload,
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );

  const refreshToken = crypto.randomBytes(32).toString('hex');
  const hashedRefreshToken = crypto
    .createHash('sha256')
    .update(refreshToken)
    .digest('hex');

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_IN_DAYS); // 7 天後過期

  await db('refresh_tokens').insert({
    user_id: userId,
    token_hash: hashedRefreshToken,
    expires_at: expiresAt,
    device_info: deviceInfo ? JSON.stringify(deviceInfo) : null,
  });

  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

    if (
      typeof decoded === 'object' &&
      decoded !== null &&
      'sub' in decoded &&
      'type' in decoded &&
      'jti' in decoded
    ) {
      const tokenPayload = decoded as unknown as TokenPayload;
      if (tokenPayload.type !== 'access') {
        throw new Error('Invalid token type');
      }
      return tokenPayload;
    } else {
      throw new Error('Invalid token payload');
    }
  } catch (error) {
    throw error;
  }
}

export async function verifyRefreshToken(
  token: string
): Promise<{ userId: number; tokenHash: string }> {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const refreshTokenRecord = await db('refresh_tokens')
    .where({
      token_hash: hashedToken,
      revoked_at: null,
    })
    .where('expires_at', '>', new Date())
    .first();

  if (!refreshTokenRecord) {
    throw new Error('Invalid or expired refresh token');
  }

  return {
    userId: refreshTokenRecord.user_id,
    tokenHash: hashedToken,
  };
}

export async function revokeRefreshToken(tokenHash: string): Promise<void> {
  await db('refresh_tokens')
    .where('token_hash', tokenHash)
    .update({ revoked_at: new Date() });
}

export async function revokeAccessToken(
  jti: string,
  userId: number
): Promise<void> {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 15);

  await db('revoked_tokens').insert({
    jti,
    user_id: userId,
    expires_at: expiresAt,
  });
}

export async function isTokenRevoked(jti: string): Promise<boolean> {
  const revokedToken = await db('revoked_tokens').where('jti', jti).first();

  return !!revokedToken;
}

export async function revokeAllUserTokens(userId: number): Promise<void> {
  await db('refresh_tokens')
    .where('user_id', userId)
    .whereNull('revoked_at')
    .update({ revoked_at: new Date() });
}
