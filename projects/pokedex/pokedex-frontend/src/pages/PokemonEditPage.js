import React from 'react';
import { useParams } from 'react-router-dom';
import { PokemonEdit } from '../components/pokemon';

const PokemonEditPage = () => {
  const { id } = useParams();
  
  return (
    <div className="pokemon-edit-page">
      <PokemonEdit pokemonId={id} />
    </div>
  );
};

export default PokemonEditPage;