import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function POST() {
  // 實務上可在這裡處理 refresh token 黑名單等
  const cookieStore = await cookies();
  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');

  redirect('/');
}
