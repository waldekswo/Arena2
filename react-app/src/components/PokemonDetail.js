import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

function PokemonDetail() {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: null });

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPokemon() {
      setStatus({ loading: true, error: null });

      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Nie udało się pobrać danych pokemona.');
        }

        const data = await response.json();
        setPokemon(data);
        setStatus({ loading: false, error: null });
      } catch (error) {
        if (error.name !== 'AbortError') {
          setStatus({ loading: false, error: 'Wystąpił problem podczas pobierania danych.' });
        }
      }
    }

    fetchPokemon();

    return () => controller.abort();
  }, [name]);

  if (status.loading) {
    return <p className="status">Ładowanie szczegółów pokemona...</p>;
  }

  if (status.error) {
    return (
      <div className="status error">
        <p>{status.error}</p>
        <Link to="/">Wróć do listy</Link>
      </div>
    );
  }

  if (!pokemon) {
    return null;
  }

  const artwork = pokemon.sprites?.other?.['official-artwork']?.front_default ?? pokemon.sprites?.front_default;

  return (
    <article className="pokemon-detail">
      <header>
        <div>
          <p className="label">Pokemon</p>
          <h2>{pokemon.name}</h2>
          <p className="subtle">ID: #{pokemon.id}</p>
        </div>
        {artwork && (
          <img src={artwork} alt={pokemon.name} loading="lazy" />
        )}
      </header>

      <section>
        <h3>Typy</h3>
        <ul className="tag-list">
          {pokemon.types.map(({ type }) => (
            <li key={type.name}>{type.name}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Umiejętności</h3>
        <ul className="tag-list">
          {pokemon.abilities.map(({ ability }) => (
            <li key={ability.name}>{ability.name}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Statystyki</h3>
        <dl className="stats">
          {pokemon.stats.map(({ stat, base_stat }) => (
            <div key={stat.name}>
              <dt>{stat.name}</dt>
              <dd>{base_stat}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Link to="/" className="back-link">← Wróć do listy</Link>
    </article>
  );
}

export default PokemonDetail;
