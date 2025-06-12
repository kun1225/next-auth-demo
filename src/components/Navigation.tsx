import Link from 'next/link';
import { getUser } from '@/lib/auth';
import { LogoutButton } from './LogoutButton';

export async function Navigation() {
  const user = await getUser();

  return (
    <nav className="p-4 bg-gray-100 flex gap-4 items-center">
      <Link href="/" className="hover:text-blue-600">
        首頁
      </Link>
      {user && (
        <Link href="/profile" className="hover:text-blue-600">
          個人資料
        </Link>
      )}
      {user?.role === 'admin' && (
        <Link href="/admin" className="hover:text-blue-600">
          管理員專區
        </Link>
      )}
      {user && (
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-gray-600">
            歡迎, {user.name} ({user.role})
          </span>
          <LogoutButton />
        </div>
      )}
    </nav>
  );
}
