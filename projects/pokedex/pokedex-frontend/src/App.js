import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout';
import {
  HomePage,
  PokemonListPage,
  PokemonCreatePage,
  PokemonEditPage,
  TrainerListPage,
  TrainerDetailPage,
  CaptureManagerPage
} from './pages';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pokemon/create" element={<PokemonCreatePage />} />
            <Route path="/pokemon/:id/edit" element={<PokemonEditPage />} />
            <Route path="/pokemon" element={<PokemonListPage />} />
            <Route path="/trainers" element={<TrainerListPage />} />
            <Route path="/trainers/:id" element={<TrainerDetailPage />} />
            <Route path="/captures" element={<CaptureManagerPage />} />
          </Routes>
        </main>
        <footer className="footer">
          <div className="container">
            <p>&copy; {new Date().getFullYear()} Pokédex App</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
