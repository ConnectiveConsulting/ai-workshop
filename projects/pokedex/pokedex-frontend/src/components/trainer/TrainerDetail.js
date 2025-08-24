import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetTrainerByIdQuery } from '../../store/api';

const TrainerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // RTK Query hooks
  const {
    data: trainer,
    error,
    isLoading,
    isError
  } = useGetTrainerByIdQuery(id, {
    skip: !id
  });

  // Redirect to edit page when trainer data is loaded
  useEffect(() => {
    if (trainer) {
      navigate(`/trainers/${id}/edit`);
    }
  }, [trainer, id, navigate]);

  // Loading and error states
  if (isLoading) return <div className="loading">Loading Trainer details...</div>;
  if (isError) return <div className="error">Error: {error?.data?.message || error?.message || 'Failed to load Trainer details'}</div>;
  if (!trainer) return <div className="not-found">Trainer not found</div>;

  return (
    <div className="trainer-detail">
      <div className="loading">Redirecting to edit page...</div>
    </div>
  );
};

export default TrainerDetail;