'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, register } from '../service/auth';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handle = async () => {
    if (!email || !password) return alert('Preencha email e senha');

    const fn = mode === 'login' ? login : register;
    const res = await fn(email, password, name);

    console.log('Resposta da API:', res);

    if (res?.token) {
      router.push('/home'); // redireciona para /home
    } else {
      alert(res.error || 'Erro ao autenticar');
    }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', height:'100vh', padding:20 }}>
      <h1>ReUse!</h1>

      {mode === 'register' && (
        <input
          placeholder="Nome"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 10 }}
        />
      )}

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ width: '100%', padding: 10, marginBottom: 10 }}
      />
      <input
        placeholder="Senha"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ width: '100%', padding: 10, marginBottom: 10 }}
      />

      <button onClick={handle} style={{ width: '100%', padding: 10, background:'#2f855a', color:'#fff', marginBottom:10 }}>
        {mode === 'login' ? 'Entrar' : 'Registrar'}
      </button>

      <button
        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        style={{ background:'none', color:'#2f855a' }}
      >
        {mode === 'login' ? 'Criar nova conta' : 'Já tenho conta'}
      </button>
    </div>
  );
}
