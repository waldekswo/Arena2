import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=151';

function PokemonList() {
  const [pokemon, setPokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState({ loading: true, error: null });

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPokemon() {
      try {
        const response = await fetch(API_URL, { signal: controller.signal });
        if (!response.ok) {
          throw new Error('Nie udało się pobrać listy Pokémonów.');
        }

        const data = await response.json();
        setPokemon(data.results);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setStatus({ loading: false, error: error.message });
        }
        return;
      }

      setStatus({ loading: false, error: null });
    }

    fetchPokemon();

    return () => controller.abort();
  }, []);

  const filteredPokemon = useMemo(() => {
    if (!searchTerm.trim()) {
      return pokemon;
    }

    return pokemon.filter(({ name }) => name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [pokemon, searchTerm]);

  if (status.loading) {
    return <p className="status">Ładowanie katalogu Pokémonów...</p>;
  }

  if (status.error) {
    return <p className="status error">{status.error}</p>;
  }

  return (
    <section aria-labelledby="pokemon-list-heading" className="pokemon-list">
      <div className="list-header">
        <h2 id="pokemon-list-heading">Katalog Pokémonów</h2>
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Szukaj po nazwie (np. pikachu)"
          aria-label="Szukaj pokemona"
        />
      </div>
      <ul>
        {filteredPokemon.map(({ name }, index) => (
          <li key={name}>
            <Link to={`/pokemon/${name}`} className="pokemon-link">
              <span className="pokemon-index">#{index + 1}</span>
              <span className="pokemon-name">{name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default PokemonList;
