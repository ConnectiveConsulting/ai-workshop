import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  useGetAllPokemonQuery, 
  useCreatePokemonMutation, 
  useDeletePokemonMutation 
} from '../../store/api';
import {
  selectFormState,
  openForm,
  closeForm,
  updateFormData,
  setFormSubmitting,
  setFormErrors,
  resetForm,
  addNotification,
  openConfirmDialog
} from '../../store/slices/uiSlice';

const PokemonList = () => {
  const dispatch = useDispatch();
  
  // RTK Query hooks
  const {
    data: pokemon = [],
    error,
    isLoading,
    isError
  } = useGetAllPokemonQuery();
  
  const [createPokemon, { 
    isLoading: isCreating, 
    error: createError 
  }] = useCreatePokemonMutation();
  
  const [deletePokemon, { 
    isLoading: isDeleting 
  }] = useDeletePokemonMutation();

  // UI state from Redux
  const formState = useSelector(selectFormState('newPokemon'));
  const showForm = formState.isOpen;
  const isSubmitting = formState.isSubmitting || isCreating;
  const formData = formState.data;
  const formErrors = formState.errors;

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    dispatch(updateFormData({ 
      formName: 'newPokemon', 
      field: name, 
      value 
    }));
  }, [dispatch]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Basic validation
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.type.trim()) errors.type = 'Type is required';
    
    if (Object.keys(errors).length > 0) {
      dispatch(setFormErrors({ formName: 'newPokemon', errors }));
      return;
    }

    try {
      dispatch(setFormSubmitting({ formName: 'newPokemon', isSubmitting: true }));
      
      await createPokemon({
        name: formData.name.trim(),
        type: formData.type.trim(),
        imageUrl: formData.imageUrl.trim() || undefined
      }).unwrap();
      
      // Success - reset form and close
      dispatch(resetForm('newPokemon'));
      dispatch(closeForm('newPokemon'));
      dispatch(addNotification({
        type: 'success',
        title: 'Success!',
        message: `${formData.name} has been created successfully.`
      }));
      
    } catch (err) {
      console.error('Error creating Pokemon:', err);
      dispatch(setFormErrors({ 
        formName: 'newPokemon', 
        errors: { submit: 'Failed to create Pokemon. Please try again.' }
      }));
      dispatch(addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to create Pokemon. Please try again.'
      }));
    }
  }, [dispatch, createPokemon, formData]);

  const handleDelete = useCallback((pokemon) => {
    dispatch(openConfirmDialog({
      title: 'Delete Pokemon',
      message: `Are you sure you want to delete ${pokemon.name}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {
        try {
          await deletePokemon(pokemon.id).unwrap();
          dispatch(addNotification({
            type: 'success',
            title: 'Success!',
            message: `${pokemon.name} has been deleted successfully.`
          }));
        } catch (err) {
          console.error('Error deleting Pokemon:', err);
          dispatch(addNotification({
            type: 'error',
            title: 'Error',
            message: 'Failed to delete Pokemon. Please try again.'
          }));
        }
      }
    }));
  }, [dispatch, deletePokemon]);

  const handleToggleForm = useCallback(() => {
    if (showForm) {
      dispatch(closeForm('newPokemon'));
    } else {
      dispatch(openForm({ 
        formName: 'newPokemon',
        initialData: {
          name: '',
          type: '',
          imageUrl: ''
        }
      }));
    }
  }, [dispatch, showForm]);

  // Loading and error states
  if (isLoading) return <div className="loading">Loading Pokémon...</div>;
  if (isError) return <div className="error">Error: {error?.data?.message || error?.message || 'Failed to load Pokemon'}</div>;

  return (
    <div className="pokemon-list">
      <div className="list-header">
        <h2>Pokémon List</h2>
        <button
          className="btn btn-primary"
          onClick={handleToggleForm}
          disabled={isSubmitting}
        >
          {showForm ? 'Cancel' : 'Add New Pokémon'}
        </button>
      </div>

      {(formErrors.submit || createError) && (
        <div className="error-message">
          {formErrors.submit || createError?.data?.message || createError?.message || 'An error occurred'}
        </div>
      )}

      {showForm && (
        <div className="pokemon-form-container">
          <h3>Add New Pokémon</h3>
          <form onSubmit={handleSubmit} className="pokemon-form">
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
              {formErrors.name && <div className="field-error">{formErrors.name}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="type">Type:</label>
              <input
                type="text"
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
              {formErrors.type && <div className="field-error">{formErrors.type}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="imageUrl">Image URL:</label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/image.png"
                disabled={isSubmitting}
              />
              {formErrors.imageUrl && <div className="field-error">{formErrors.imageUrl}</div>}
            </div>
            <button type="submit" className="btn btn-success" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Pokémon'}
            </button>
          </form>
        </div>
      )}

      {(isLoading || isDeleting) && <div className="loading">Loading...</div>}
      
      {pokemon.length === 0 ? (
        <p>No Pokémon found.</p>
      ) : (
        <div className="pokemon-grid">
          {pokemon.map((poke) => (
            <div key={poke.id} className="pokemon-card">
              <img
                src={poke.imageUrl || 'https://placehold.co/150'}
                alt={poke.name}
                className="pokemon-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/150';
                }}
              />
              <h3>{poke.name}</h3>
              <p>Type: {poke.type}</p>
              <div className="card-actions">
                <Link to={`/pokemon/${poke.id}`} className="btn btn-info">
                  View Details
                </Link>
                <button
                  onClick={() => handleDelete(poke)}
                  className="btn btn-danger"
                  disabled={isDeleting}
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

export default PokemonList;