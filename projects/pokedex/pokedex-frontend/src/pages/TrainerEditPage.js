import React from 'react';
import { useParams } from 'react-router-dom';
import { TrainerEdit } from '../components/trainer';

const TrainerEditPage = () => {
  const { id } = useParams();
  
  return (
    <div className="trainer-edit-page">
      <TrainerEdit trainerId={id} />
    </div>
  );
};

export default TrainerEditPage;