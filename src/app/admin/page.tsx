import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const user = await getUser();

  if (!user || user?.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">管理員專區</h1>
        <p>只有 admin 可以看到這個頁面。</p>
        <p className="text-sm text-gray-600 mt-2">
          此頁面由 middleware 保護，只有認證通過的 admin 用戶可以訪問。
        </p>
      </div>
    </div>
  );
}
