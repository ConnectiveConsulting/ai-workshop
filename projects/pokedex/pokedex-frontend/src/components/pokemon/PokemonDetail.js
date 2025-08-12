import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PokemonService from '../../services/PokemonService';

const PokemonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPokemon, setEditedPokemon] = useState(null);

  const fetchPokemon = async () => {
    try {
      setLoading(true);
      const data = await PokemonService.getPokemonById(id);
      setPokemon(data);
      setEditedPokemon(data);
      setError(null);
    } catch (err) {
      console.error(`Error fetching Pokemon with ID ${id}:`, err);
      setError('Failed to load Pokemon details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPokemon({
      ...editedPokemon,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await PokemonService.updatePokemon(id, editedPokemon);
      setPokemon(editedPokemon);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error(`Error updating Pokemon with ID ${id}:`, err);
      setError('Failed to update Pokemon. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this Pokemon?')) {
      try {
        setLoading(true);
        await PokemonService.deletePokemon(id);
        navigate('/pokemon');
      } catch (err) {
        console.error(`Error deleting Pokemon with ID ${id}:`, err);
        setError('Failed to delete Pokemon. Please try again.');
        setLoading(false);
      }
    }
  };

  if (loading) return <div className="loading">Loading Pokémon details...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!pokemon) return <div className="not-found">Pokémon not found</div>;

  if (loading) return <div className="loading">Loading Pokémon details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!pokemon) return <div className="not-found">Pokémon not found</div>;

  return (
    <div className="pokemon-detail">
      {isEditing ? (
        <div className="edit-form-container">
          <h2>Edit Pokémon</h2>
          <form onSubmit={handleSubmit} className="pokemon-form">
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={editedPokemon.name}
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
                value={editedPokemon.type}
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
                value={editedPokemon.imageUrl}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setIsEditing(false);
                  setEditedPokemon(pokemon);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="pokemon-header">
            <h2>{pokemon.name}</h2>
            <span className="pokemon-type">{pokemon.type}</span>
          </div>
          
          <div className="pokemon-content">
            <div className="pokemon-image-container">
              <img
                src={pokemon.imageUrl || 'https://placehold.co/300'}
                alt={pokemon.name}
                className="pokemon-detail-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/300';
                }}
              />
            </div>
            
            <div className="pokemon-info">
              <div className="info-item">
                <span className="label">ID:</span>
                <span className="value">{pokemon.id}</span>
              </div>
              <div className="info-item">
                <span className="label">Name:</span>
                <span className="value">{pokemon.name}</span>
              </div>
              <div className="info-item">
                <span className="label">Type:</span>
                <span className="value">{pokemon.type}</span>
              </div>
            </div>
          </div>
          
          <div className="actions">
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="btn btn-danger"
            >
              Delete
            </button>
            <Link to="/pokemon" className="btn btn-back">
              Back to Pokémon List
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default PokemonDetail;