import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const user = await getUser();

  if (!user) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="bg-white p-8 rounded shadow max-w-md">
        <h1 className="text-2xl font-bold mb-4">個人資料頁面</h1>
        <p className="mb-4">
          這是一個需要認證的頁面，任何已登入的用戶都可以訪問。
        </p>
        <div className="text-sm text-gray-600">
          <h3 className="font-semibold mb-2">測試說明：</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>未登入用戶會被重定向到首頁</li>
            <li>已登入的 admin 和 user 都可以訪問</li>
            <li>此頁面由 middleware 保護</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
