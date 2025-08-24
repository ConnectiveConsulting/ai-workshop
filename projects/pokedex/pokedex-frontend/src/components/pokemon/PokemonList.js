import React from 'react';
import { Link } from 'react-router-dom';
import {
  useGetAllPokemonQuery
} from '../../store/api';

const PokemonList = () => {
  // RTK Query hooks
  const {
    data: pokemon = [],
    error,
    isLoading,
    isError
  } = useGetAllPokemonQuery();

  // Loading and error states
  if (isLoading) return <div className="loading">Loading Pokémon...</div>;
  if (isError) return <div className="error">Error: {error?.data?.message || error?.message || 'Failed to load Pokemon'}</div>;

  return (
    <div className="pokemon-list">
      <div className="list-header">
        <h2>Pokémon List</h2>
        <Link to="/pokemon/create" className="btn btn-primary">
          Add New Pokémon
        </Link>
      </div>
      
      {pokemon.length === 0 ? (
        <p>No Pokémon found.</p>
      ) : (
        <div className="pokemon-grid">
          {pokemon.map((poke) => (
            <div key={poke.id} className="pokemon-card">
              <img
                src={poke.imageUrl || 'https://placehold.co/150'}
                alt={poke.name}
                className="pokemon-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/150';
                }}
              />
              <h3>{poke.name}</h3>
              <p>Type: {poke.type}</p>
              <div className="card-actions">
                <Link to={`/pokemon/${poke.id}/edit`} className="btn btn-primary">
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PokemonList;