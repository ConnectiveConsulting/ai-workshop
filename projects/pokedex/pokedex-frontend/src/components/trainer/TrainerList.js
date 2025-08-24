import React from 'react';
import { Link } from 'react-router-dom';
import {
  useGetAllTrainersQuery
} from '../../store/api';

const TrainerList = () => {
  // RTK Query hooks
  const {
    data: trainers = [],
    error,
    isLoading,
    isError
  } = useGetAllTrainersQuery();

  // Loading and error states
  if (isLoading) return <div className="loading">Loading Trainers...</div>;
  if (isError) return <div className="error">Error: {error?.data?.message || error?.message || 'Failed to load Trainers'}</div>;

  return (
    <div className="trainer-list">
      <div className="list-header">
        <h2>Trainers List</h2>
        <Link to="/trainers/create" className="btn btn-primary">
          Add New Trainer
        </Link>
      </div>
      
      {trainers.length === 0 ? (
        <p>No Trainers found.</p>
      ) : (
        <div className="trainer-grid">
          {trainers.map((trainer) => (
            <div key={trainer.id} className="trainer-card">
              <h3>{trainer.name}</h3>
              <p>Region: {trainer.region}</p>
              {trainer.email && <p>Email: {trainer.email}</p>}
              {trainer.phone && <p>Phone: {trainer.phone}</p>}
              <div className="card-actions">
                <Link to={`/trainers/${trainer.id}/edit`} className="btn btn-primary">
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

export default TrainerList;