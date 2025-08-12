import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PokemonService from '../../services/PokemonService';

const PokemonList = () => {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newPokemon, setNewPokemon] = useState({
    name: '',
    type: '',
    imageUrl: ''
  });

  const fetchPokemon = async () => {
    try {
      setLoading(true);
      const data = await PokemonService.getAllPokemon();
      setPokemon(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching Pokemon:', err);
      setError('Failed to load Pokemon. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPokemon({
      ...newPokemon,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await PokemonService.createPokemon(newPokemon);
      // Reset form
      setNewPokemon({
        name: '',
        type: '',
        imageUrl: ''
      });
      setShowForm(false);
      // Refresh the list
      await fetchPokemon();
    } catch (err) {
      console.error('Error creating Pokemon:', err);
      setError('Failed to create Pokemon. Please try again.');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this Pokemon?')) {
      try {
        setLoading(true);
        await PokemonService.deletePokemon(id);
        await fetchPokemon();
      } catch (err) {
        console.error('Error deleting Pokemon:', err);
        setError('Failed to delete Pokemon. Please try again.');
        setLoading(false);
      }
    }
  };

  if (loading) return <div className="loading">Loading Pokémon...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="pokemon-list">
      <div className="list-header">
        <h2>Pokémon List</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Pokémon'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="pokemon-form-container">
          <h3>Add New Pokémon</h3>
          <form onSubmit={handleSubmit} className="pokemon-form">
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newPokemon.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="type">Type:</label>
              <input
                type="text"
                id="type"
                name="type"
                value={newPokemon.type}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="imageUrl">Image URL:</label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={newPokemon.imageUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/image.png"
              />
            </div>
            <button type="submit" className="btn btn-success">
              Create Pokémon
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading Pokémon...</div>
      ) : pokemon.length === 0 ? (
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
                <Link to={`/pokemon/${poke.id}`} className="btn btn-info">
                  View Details
                </Link>
                <button
                  onClick={() => handleDelete(poke.id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PokemonList;