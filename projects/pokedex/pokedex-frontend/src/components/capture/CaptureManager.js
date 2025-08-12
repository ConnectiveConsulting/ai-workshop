import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PokemonService from '../../services/PokemonService';
import TrainerService from '../../services/TrainerService';
import CaptureService from '../../services/CaptureService';

const CaptureManager = () => {
  const [pokemon, setPokemon] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [captures, setCaptures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state
  const [selectedPokemon, setSelectedPokemon] = useState('');
  const [selectedTrainer, setSelectedTrainer] = useState('');
  const [captureDate, setCaptureDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch Pokemon
      const pokemonData = await PokemonService.getAllPokemon();
      setPokemon(pokemonData);
      
      // Fetch Trainers
      const trainersData = await TrainerService.getAllTrainers();
      setTrainers(trainersData);
      
      // Fetch Captures
      const capturesData = await CaptureService.getAllCaptures();
      setCaptures(capturesData);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!selectedPokemon || !selectedTrainer || !captureDate) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setLoading(true);
      
      const captureData = {
        pokemonId: parseInt(selectedPokemon),
        trainerId: parseInt(selectedTrainer),
        captureDate: new Date(captureDate).toISOString()
      };
      
      await CaptureService.createCapture(captureData);
      
      // Reset form
      setSelectedPokemon('');
      setSelectedTrainer('');
      setCaptureDate(new Date().toISOString().split('T')[0]);
      setError(null);
      
      // Refresh captures
      await fetchData();
    } catch (err) {
      console.error('Error creating capture:', err);
      setError('Failed to create capture. Please try again.');
      setLoading(false);
    }
  };

  const handleDeleteCapture = async (pokemonId, trainerId) => {
    if (window.confirm('Are you sure you want to release this Pokémon?')) {
      try {
        setLoading(true);
        await CaptureService.deleteCapture(pokemonId, trainerId);
        await fetchData();
      } catch (err) {
        console.error('Error deleting capture:', err);
        setError('Failed to delete capture. Please try again.');
        setLoading(false);
      }
    }
  };

  if (loading) return <div className="loading">Loading capture data...</div>;

  if (loading && pokemon.length === 0 && trainers.length === 0) {
    return <div className="loading">Loading capture data...</div>;
  }

  return (
    <div className="capture-manager">
      <h2>Capture Manager</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="capture-form-container">
        <h3>Assign Pokémon to Trainer</h3>
        
        <form onSubmit={handleSubmit} className="capture-form">
          <div className="form-group">
            <label htmlFor="pokemon">Pokémon:</label>
            <select
              id="pokemon"
              value={selectedPokemon}
              onChange={(e) => setSelectedPokemon(e.target.value)}
              required
            >
              <option value="">Select a Pokémon</option>
              {pokemon.map((poke) => (
                <option key={poke.id} value={poke.id}>
                  {poke.name}
                </option>
              ))}
            </select>
            {pokemon.length === 0 && !loading && (
              <div className="empty-message">
                <p>No Pokémon available.</p>
                <Link to="/pokemon" className="btn btn-sm btn-primary">Add Pokémon</Link>
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="trainer">Trainer:</label>
            <select
              id="trainer"
              value={selectedTrainer}
              onChange={(e) => setSelectedTrainer(e.target.value)}
              required
            >
              <option value="">Select a Trainer</option>
              {trainers.map((trainer) => (
                <option key={trainer.id} value={trainer.id}>
                  {trainer.name}
                </option>
              ))}
            </select>
            {trainers.length === 0 && !loading && (
              <div className="empty-message">
                <p>No Trainers available.</p>
                <Link to="/trainers" className="btn btn-sm btn-primary">Add Trainer</Link>
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="captureDate">Capture Date:</label>
            <input
              type="date"
              id="captureDate"
              value={captureDate}
              onChange={(e) => setCaptureDate(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || pokemon.length === 0 || trainers.length === 0}
          >
            {loading ? 'Creating...' : 'Create Capture'}
          </button>
        </form>
      </div>
      
      <div className="captures-list-container">
        <h3>Existing Captures</h3>
        {loading && captures.length === 0 ? (
          <div className="loading">Loading captures...</div>
        ) : captures.length === 0 ? (
          <p>No captures found.</p>
        ) : (
          <table className="captures-table">
            <thead>
              <tr>
                <th>Pokémon</th>
                <th>Trainer</th>
                <th>Capture Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {captures.map((capture) => (
                <tr key={`${capture.pokemonId}-${capture.trainerId}`}>
                  <td>
                    <Link to={`/pokemon/${capture.pokemonId}`}>
                      {capture.pokemon ? capture.pokemon.name : `Pokémon #${capture.pokemonId}`}
                    </Link>
                  </td>
                  <td>
                    <Link to={`/trainers/${capture.trainerId}`}>
                      {capture.trainer ? capture.trainer.name : `Trainer #${capture.trainerId}`}
                    </Link>
                  </td>
                  <td>{new Date(capture.captureDate).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteCapture(capture.pokemonId, capture.trainerId)}
                      className="btn btn-danger btn-sm"
                      disabled={loading}
                    >
                      Release
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CaptureManager;