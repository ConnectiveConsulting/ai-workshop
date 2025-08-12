import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import TrainerService from '../../services/TrainerService';
import CaptureService from '../../services/CaptureService';

const TrainerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trainer, setTrainer] = useState(null);
  const [captures, setCaptures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTrainer, setEditedTrainer] = useState(null);

  const fetchTrainer = async () => {
    try {
      setLoading(true);
      const data = await TrainerService.getTrainerById(id);
      setTrainer(data);
      setEditedTrainer(data);
      setError(null);
    } catch (err) {
      console.error(`Error fetching Trainer with ID ${id}:`, err);
      setError('Failed to load Trainer details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCaptures = async () => {
    try {
      const data = await CaptureService.getCapturesByTrainerId(id);
      setCaptures(data);
    } catch (err) {
      console.error(`Error fetching captures for Trainer with ID ${id}:`, err);
      // We don't set the main error state here to still show trainer details
      console.log('Failed to load captures. Please try again later.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchTrainer();
      await fetchCaptures();
    };
    
    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTrainer({
      ...editedTrainer,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await TrainerService.updateTrainer(id, editedTrainer);
      setTrainer(editedTrainer);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error(`Error updating Trainer with ID ${id}:`, err);
      setError('Failed to update Trainer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this Trainer?')) {
      try {
        setLoading(true);
        await TrainerService.deleteTrainer(id);
        navigate('/trainers');
      } catch (err) {
        console.error(`Error deleting Trainer with ID ${id}:`, err);
        setError('Failed to delete Trainer. Please try again.');
        setLoading(false);
      }
    }
  };

  const handleReleaseCapture = async (pokemonId) => {
    if (window.confirm('Are you sure you want to release this Pokémon?')) {
      try {
        setLoading(true);
        await CaptureService.deleteCapture(pokemonId, id);
        await fetchCaptures();
        setLoading(false);
      } catch (err) {
        console.error(`Error releasing Pokémon with ID ${pokemonId}:`, err);
        setError('Failed to release Pokémon. Please try again.');
        setLoading(false);
      }
    }
  };

  if (loading) return <div className="loading">Loading Trainer details...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!trainer) return <div className="not-found">Trainer not found</div>;

  if (loading) return <div className="loading">Loading Trainer details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!trainer) return <div className="not-found">Trainer not found</div>;

  return (
    <div className="trainer-detail">
      {isEditing ? (
        <div className="edit-form-container">
          <h2>Edit Trainer</h2>
          <form onSubmit={handleSubmit} className="trainer-form">
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={editedTrainer.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="region">Region:</label>
              <input
                type="text"
                id="region"
                name="region"
                value={editedTrainer.region}
                onChange={handleInputChange}
                required
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
                  setEditedTrainer(trainer);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="trainer-header">
            <h2>{trainer.name}</h2>
            <span className="trainer-region">Region: {trainer.region}</span>
          </div>
          
          <div className="trainer-content">
            <div className="trainer-info">
              <div className="info-item">
                <span className="label">ID:</span>
                <span className="value">{trainer.id}</span>
              </div>
              <div className="info-item">
                <span className="label">Name:</span>
                <span className="value">{trainer.name}</span>
              </div>
              <div className="info-item">
                <span className="label">Region:</span>
                <span className="value">{trainer.region}</span>
              </div>
            </div>
          </div>
          
          <div className="trainer-pokemon">
            <h3>Captured Pokémon</h3>
            {captures.length === 0 ? (
              <p>This trainer hasn't captured any Pokémon yet.</p>
            ) : (
              <div className="captures-list">
                {captures.map((capture) => (
                  <div key={capture.pokemonId} className="capture-item">
                    <div className="capture-info">
                      <Link to={`/pokemon/${capture.pokemonId}`}>
                        {capture.pokemon ? capture.pokemon.name : `Pokémon #${capture.pokemonId}`}
                      </Link>
                      <span className="capture-date">
                        Captured on: {new Date(capture.captureDate).toLocaleDateString()}
                      </span>
                    </div>
                    <button
                      onClick={() => handleReleaseCapture(capture.pokemonId)}
                      className="btn btn-danger btn-sm"
                    >
                      Release
                    </button>
                  </div>
                ))}
              </div>
            )}
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
            <Link to="/trainers" className="btn btn-back">
              Back to Trainers List
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default TrainerDetail;