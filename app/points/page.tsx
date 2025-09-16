'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface Point {
  name: string;
  lat?: number;
  lon?: number;
}

interface PointsPageProps {
  searchCity?: string;
}

export default function PointsPage({ searchCity }: PointsPageProps) {
  const initialCity = searchCity || 'São Paulo';
  const [city, setCity] = useState(initialCity);
  const [points, setPoints] = useState<Point[]>([]);
  const [loading, setLoading] = useState(false);

  // Simple geocoding via Nominatim
  const geocodeCity = async (cityName: string) => {
    try {
      const res = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: { q: cityName, format: 'json', limit: 1 },
      });
      if (res.data && res.data.length) {
        const { lat, lon } = res.data[0];
        return { lat: parseFloat(lat), lon: parseFloat(lon) };
      }
      return null;
    } catch (e) {
      console.error('geocodeCity', e);
      return null;
    }
  };

  const fetchCollectionPoints = async (lat: number, lon: number, radius = 5000) => {
    try {
      const res = await axios.get(`/api/points?lat=${lat}&lon=${lon}&radius=${radius}`);
      return res.data || [];
    } catch (e) {
      console.error('fetchCollectionPoints', e);
      return [];
    }
  };

  const loadPoints = async () => {
    try {
      const res = await fetch(`/api/points?city=${encodeURIComponent(city)}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      console.log('Pontos de coleta:', data.elements);
    } catch (e) {
      console.error('Erro ao buscar pontos:', e);
      alert('Não foi possível buscar os pontos de coleta');
    }
  };

  useEffect(() => {
    loadPoints();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Pontos de Coleta — {city}</h1>
      <div style={styles.searchContainer}>
        <input
          style={styles.input}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Digite a cidade"
        />
        <button style={styles.btn} onClick={loadPoints}>
          Buscar
        </button>
      </div>
      {loading ? (
        <p>Carregando...</p>
      ) : points.length > 0 ? (
        points.map((point, idx) => (
          <div key={idx} style={styles.card}>
            <strong>{point.name}</strong>
            <p>
              Lat: {point.lat?.toFixed(5)} Lon: {point.lon?.toFixed(5)}
            </p>
          </div>
        ))
      ) : (
        <p>Nenhum ponto encontrado.</p>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fff',
    color: '#111',
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 12,
  },
  searchContainer: {
    display: 'flex',
    width: '100%',
    maxWidth: 500,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: '1px solid #ddd',
    marginRight: 8,
  },
  btn: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#2f855a',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderStyle: 'solid',
    borderRadius: 8,
    width: '100%',
    maxWidth: 500,
    marginBottom: 8,
  },
};

