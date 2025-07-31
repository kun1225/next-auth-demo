import { NextRequest, NextResponse } from 'next/server';
import { verify, JwtPayload } from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';

// 定義路由配置
const routeConfig = {
  // 需要認證的路由
  protected: ['/admin', '/profile', '/dashboard'],
  // 需要 admin 角色的路由
  adminOnly: ['/admin'],
  // 需要特定角色的路由
  roleRequired: {
    '/admin': 'admin',
    // 可以擴展更多角色路由
    // '/manager': 'manager',
  },
  // 公開路由（不需要認證）
  public: ['/', '/login', '/register'],
};

interface CustomJwtPayload extends JwtPayload {
  userId: number;
  role: string;
}

/**
 * 檢查路徑是否匹配任何路由模式
 */
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(route => {
    // 支持精確匹配和前綴匹配
    return pathname === route || pathname.startsWith(route + '/');
  });
}

/**
 * 獲取路由所需的角色
 */
function getRequiredRole(pathname: string): string | null {
  for (const [route, role] of Object.entries(routeConfig.roleRequired)) {
    if (pathname === route || pathname.startsWith(route + '/')) {
      return role;
    }
  }
  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 跳過公開路由
  if (matchesRoute(pathname, routeConfig.public)) {
    return NextResponse.next();
  }

  // 如果不是受保護的路由，直接通過
  if (!matchesRoute(pathname, routeConfig.protected)) {
    return NextResponse.next();
  }

  // 從 cookie 獲取 access_token
  const token = request.cookies.get('access_token')?.value;

  if (!token) {
    console.log(`[Middleware] No token found for protected route: ${pathname}`);
    // 沒有 token，重定向到登入頁，並保存原始路徑
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // 驗證 token
    const payload = verify(token, ACCESS_TOKEN_SECRET) as CustomJwtPayload;

    // 檢查角色權限
    const requiredRole = getRequiredRole(pathname);
    if (requiredRole && payload.role !== requiredRole) {
      console.log(
        `[Middleware] Insufficient role for ${pathname}. Required: ${requiredRole}, User: ${payload.role}`
      );
      // 權限不足，重定向到首頁並顯示錯誤信息
      const homeUrl = new URL('/', request.url);
      homeUrl.searchParams.set('error', 'insufficient_permissions');
      return NextResponse.redirect(homeUrl);
    }

    console.log(
      `[Middleware] Access granted for user ${payload.userId} to ${pathname}`
    );

    // token 有效且權限足夠，允許訪問
    // 可以在 response headers 中添加用戶信息供頁面使用
    const response = NextResponse.next();
    response.headers.set('x-user-id', payload.userId.toString());
    response.headers.set('x-user-role', payload.role);

    return response;
  } catch (error) {
    console.error(
      `[Middleware] Token verification failed for ${pathname}:`,
      error
    );

    // token 無效，清除無效的 cookie 並重定向
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');

    return response;
  }
}

// 配置 middleware 匹配的路徑
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
