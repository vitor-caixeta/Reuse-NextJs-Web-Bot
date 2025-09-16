'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

type DecodedToken = { userId: number; exp: number };

export function useAuth(redirectTo: string = '/login') {
  const router = useRouter();
  const [user, setUser] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace(redirectTo);
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp < now) {
        localStorage.removeItem('token');
        router.replace(redirectTo);
      } else {
        setUser(decoded);
      }
    } catch {
      localStorage.removeItem('token');
      router.replace(redirectTo);
    }
  }, [router, redirectTo]);

  return user;
}
