import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="hero">
        <h1>Welcome to the Pokédex</h1>
        <p>Explore the world of Pokémon and their trainers</p>
      </div>
      
      <div className="features">
        <div className="feature-card">
          <h2>Pokémon</h2>
          <p>Browse and discover Pokémon</p>
          <Link to="/pokemon" className="btn btn-primary">View Pokémon</Link>
        </div>
        
        <div className="feature-card">
          <h2>Trainers</h2>
          <p>Meet the trainers from different regions</p>
          <Link to="/trainers" className="btn btn-primary">View Trainers</Link>
        </div>
        
        <div className="feature-card">
          <h2>Captures</h2>
          <p>Manage Pokémon captures by trainers</p>
          <Link to="/captures" className="btn btn-primary">Manage Captures</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;