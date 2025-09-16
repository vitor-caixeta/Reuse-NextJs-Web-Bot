// app/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  email?: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Simula fetch do usuário (substitua pelo getCurrentUser real se existir API)
    const loadUser = async () => {
      // Aqui você pode chamar sua API real, por exemplo: /api/auth/user
      setUser({ email: 'usuario@teste.com' });
    };
    loadUser();
  }, []);

  const doLogout = async () => {
    // Aqui você pode chamar a API de logout real
    // await fetch('/api/auth/logout');
    router.replace('/'); // redireciona para login/home
  };

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>Perfil</h1>
      <p>{user ? user.email || JSON.stringify(user) : 'Sem usuário'}</p>
      <button style={styles.btn} onClick={doLogout}>Sair</button>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fff',
    color: '#111',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
  },
  btn: {
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#c53030',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    width: '30%',
  },
};
