'use client';
import { Button } from './ui/button';

export function LogoutButton() {
  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' });
  };

  return (
    <Button onClick={logout} variant="outline" size="sm">
      登出
    </Button>
  );
}
