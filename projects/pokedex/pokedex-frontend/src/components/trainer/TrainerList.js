import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TrainerService from '../../services/TrainerService';

const TrainerList = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newTrainer, setNewTrainer] = useState({
    name: '',
    region: ''
  });

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const data = await TrainerService.getAllTrainers();
      setTrainers(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching Trainers:', err);
      setError('Failed to load Trainers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTrainer({
      ...newTrainer,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await TrainerService.createTrainer(newTrainer);
      // Reset form
      setNewTrainer({
        name: '',
        region: ''
      });
      setShowForm(false);
      // Refresh the list
      await fetchTrainers();
    } catch (err) {
      console.error('Error creating Trainer:', err);
      setError('Failed to create Trainer. Please try again.');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this Trainer?')) {
      try {
        setLoading(true);
        await TrainerService.deleteTrainer(id);
        await fetchTrainers();
      } catch (err) {
        console.error('Error deleting Trainer:', err);
        setError('Failed to delete Trainer. Please try again.');
        setLoading(false);
      }
    }
  };

  if (loading) return <div className="loading">Loading Trainers...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="trainer-list">
      <div className="list-header">
        <h2>Trainers List</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Trainer'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="trainer-form-container">
          <h3>Add New Trainer</h3>
          <form onSubmit={handleSubmit} className="trainer-form">
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newTrainer.name}
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
                value={newTrainer.region}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-success">
              Create Trainer
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading Trainers...</div>
      ) : trainers.length === 0 ? (
        <p>No Trainers found.</p>
      ) : (
        <div className="trainer-grid">
          {trainers.map((trainer) => (
            <div key={trainer.id} className="trainer-card">
              <h3>{trainer.name}</h3>
              <p>Region: {trainer.region}</p>
              <div className="card-actions">
                <Link to={`/trainers/${trainer.id}`} className="btn btn-info">
                  View Details
                </Link>
                <button
                  onClick={() => handleDelete(trainer.id)}
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

export default TrainerList;