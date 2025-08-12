import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <h1 className="logo">Pokédex</h1>
        <nav className="nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/pokemon" className="nav-link">Pokémon</Link>
            </li>
            <li className="nav-item">
              <Link to="/trainers" className="nav-link">Trainers</Link>
            </li>
            <li className="nav-item">
              <Link to="/captures" className="nav-link">Captures</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;