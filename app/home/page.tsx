'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

type User = {
  id: number;
  email: string;
  name?: string;
};

type Weather = {
  name: string;
  weather?: { description: string }[];
  main?: { temp: number };
};

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [city, setCity] = useState('São Paulo');
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(false);
  const [dicas, setDicas] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Pega o token do localStorage e decodifica
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        // Supondo que você armazenou o user no payload
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Erro ao decodificar token:', e);
      }
    }

    const loadDicas = async () => {
      try {
        const res = await fetch('/api/tips');
        const data = await res.json();
        setDicas(data.map((d: any) => d.text));
      } catch (e) {
        console.error('Erro ao carregar dicas:', e);
      }
    };

    loadDicas();
  }, []);

  const loadWeather = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      const data = await res.json();
      setWeather(data);
    } catch (e) {
      console.error('Erro ao carregar clima:', e);
    }
    setLoading(false);
  };

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>
        Bem-vindo(a){user?.name ? `, ${user.name}` : ''} ao ReUse!
      </h1>
      <p style={styles.subtitle}>Plataforma de reuso e desperdício</p>

      {/* Clima */}
      <div style={styles.section}>
        <input
          value={city}
          onChange={e => setCity(e.target.value)}
          placeholder="Digite a cidade"
          style={styles.input}
        />
        <button style={styles.button} onClick={loadWeather}>
          Buscar Clima
        </button>
        {loading && <p>Carregando...</p>}
        {weather && (
          <div style={styles.weatherInfo}>
            <p>{weather.name} — {weather.weather?.[0]?.description}</p>
            <p>Temperatura: {weather.main?.temp}°C</p>
          </div>
        )}
      </div>

      {/* Dicas */}
      <div style={styles.section}>
        <h2>Dicas de Sustentabilidade</h2>
        {dicas.length > 0 ? (
          dicas.map((dica, i) => (
            <div key={i} style={styles.dicaCard}>
              {dica}
            </div>
          ))
        ) : (
          <p>Carregando dicas...</p>
        )}
      </div>

      {/* Botões */}
      <div style={styles.section}>
        <button style={styles.pointsButton} onClick={() => router.push('/points')}>
          Ver Pontos de Coleta próximos
        </button>        
        <button
          style={styles.profileButton}
          onClick={() => router.push('/profile')} 
        >
          Perfil / Sair
        </button>
      </div>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#fff',
    color: '#111',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginTop: 4,
  },
  section: {
    marginTop: 20,
    width: '100%',
    maxWidth: 600,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    padding: 10,
    borderRadius: 8,
    border: '1px solid #ddd',
    width: '80%',
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    padding: '10px 20px',
    borderRadius: 8,
    backgroundColor: '#2f855a',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    width: '80%',
    marginBottom: 8,
  },
  weatherInfo: {
    marginTop: 12,
    textAlign: 'center',
  },
  dicaCard: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    width: '80%',
    textAlign: 'center',
  },
  pointsButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#285e46',
    color: '#fff',
    border: 'none',
    width: '80%',
    marginTop: 12,
    cursor: 'pointer',
  },
  profileButton: {
    padding: 12,
    borderRadius: 8,
    border: '1px solid #2f855a',
    background: 'none',
    color: '#2f855a',
    width: '80%',
    marginTop: 8,
    cursor: 'pointer',
  },
};
