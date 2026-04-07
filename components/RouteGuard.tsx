'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useGame } from '@/lib/game-context';

// 需要守卫的路由映射
const GUARDED_ROUTES: Record<string, number> = {
  '/timeline': 1,
  '/map': 2,
  '/achievements': 3,
  '/future': 4,
  '/diary': 5,
  '/pets': 6,
};

// 白名单路由（永远放行）
const WHITELIST_ROUTES = ['/album', '/admin', '/intro'];

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLevelUnlocked, showToast, isHydrated } = useGame();
  const [isAllowed, setIsAllowed] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 强制重新检查，无视缓存
    const checkAccess = () => {
      if (!isHydrated) {
        setIsChecking(true);
        return;
      }

      setIsChecking(true);

      // 首页和白名单路由始终允许
      if (pathname === '/' || pathname === '' || WHITELIST_ROUTES.some(route => pathname.startsWith(route))) {
        setIsAllowed(true);
        setIsChecking(false);
        return;
      }

      // 检查当前路由是否需要守卫
      let requiredLevel: number | null = null;

      // 精确匹配
      if (GUARDED_ROUTES[pathname]) {
        requiredLevel = GUARDED_ROUTES[pathname];
      } else {
        // 前缀匹配
        for (const [route, level] of Object.entries(GUARDED_ROUTES)) {
          if (pathname.startsWith(route + '/') || pathname === route) {
            requiredLevel = level;
            break;
          }
        }
      }

      if (requiredLevel && !isLevelUnlocked(requiredLevel)) {
        // 未解锁，强制重定向到首页
        setIsAllowed(false);
        showToast('嘘，不能作弊哦，请先在首页完成解密~', 'error');

        // 使用 replace 而不是 push，避免用户通过后退按钮返回
        router.replace('/');
      } else {
        setIsAllowed(true);
      }

      setIsChecking(false);
    };

    checkAccess();

    // 监听路由变化
    const handleRouteChange = () => {
      checkAccess();
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, [pathname, isLevelUnlocked, showToast, router, isHydrated]);

  // 如果未 hydration 或正在检查，显示加载状态
  if (!isHydrated || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF5F5] to-[#FFE4E1]">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#E35D6A] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-[#7C444F]">加载中...</p>
        </div>
      </div>
    );
  }

  // 如果不允许访问，显示拦截页面
  if (!isAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF5F5] to-[#FFE4E1]">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-[#7C444F] mb-2">关卡未解锁</h2>
          <p className="text-[#9B6A6C]">正在返回首页...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
