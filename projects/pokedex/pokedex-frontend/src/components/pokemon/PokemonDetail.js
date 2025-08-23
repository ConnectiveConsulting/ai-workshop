import React, { useCallback, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  useGetPokemonByIdQuery, 
  useUpdatePokemonMutation, 
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

const PokemonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // RTK Query hooks
  const {
    data: pokemon,
    error,
    isLoading,
    isError
  } = useGetPokemonByIdQuery(id, {
    skip: !id
  });
  
  const [updatePokemon, { 
    isLoading: isUpdating, 
    error: updateError 
  }] = useUpdatePokemonMutation();
  
  const [deletePokemon, { 
    isLoading: isDeleting 
  }] = useDeletePokemonMutation();

  // UI state from Redux - using a form named with the pokemon ID for uniqueness
  const formName = `editPokemon_${id}`;
  const formState = useSelector(selectFormState(formName));
  const isEditing = formState?.isOpen || false;
  const isSubmitting = formState?.isSubmitting || isUpdating;
  const formData = useMemo(() => formState?.data || {}, [formState?.data]);
  const formErrors = formState?.errors || {};

  // Initialize form data when pokemon loads
  useEffect(() => {
    if (pokemon && isEditing && !formData.name) {
      dispatch(updateFormData({ 
        formName, 
        field: 'name', 
        value: pokemon.name || ''
      }));
      dispatch(updateFormData({ 
        formName, 
        field: 'type', 
        value: pokemon.type || ''
      }));
      dispatch(updateFormData({ 
        formName, 
        field: 'imageUrl', 
        value: pokemon.imageUrl || ''
      }));
    }
  }, [pokemon, isEditing, formData.name, dispatch, formName]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    dispatch(updateFormData({ 
      formName, 
      field: name, 
      value 
    }));
  }, [dispatch, formName]);

  const handleStartEdit = useCallback(() => {
    if (pokemon) {
      dispatch(openForm({ 
        formName,
        initialData: {
          name: pokemon.name || '',
          type: pokemon.type || '',
          imageUrl: pokemon.imageUrl || ''
        }
      }));
    }
  }, [dispatch, formName, pokemon]);

  const handleCancelEdit = useCallback(() => {
    dispatch(closeForm(formName));
    dispatch(resetForm(formName));
  }, [dispatch, formName]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Basic validation
    const errors = {};
    if (!formData.name?.trim()) errors.name = 'Name is required';
    if (!formData.type?.trim()) errors.type = 'Type is required';
    
    if (Object.keys(errors).length > 0) {
      dispatch(setFormErrors({ formName, errors }));
      return;
    }

    try {
      dispatch(setFormSubmitting({ formName, isSubmitting: true }));
      
      await updatePokemon({
        id: parseInt(id),
        name: formData.name.trim(),
        type: formData.type.trim(),
        imageUrl: formData.imageUrl?.trim() || undefined
      }).unwrap();
      
      // Success - close form
      dispatch(closeForm(formName));
      dispatch(resetForm(formName));
      dispatch(addNotification({
        type: 'success',
        title: 'Success!',
        message: `${formData.name} has been updated successfully.`
      }));
      
    } catch (err) {
      console.error('Error updating Pokemon:', err);
      dispatch(setFormErrors({ 
        formName, 
        errors: { submit: 'Failed to update Pokemon. Please try again.' }
      }));
      dispatch(addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update Pokemon. Please try again.'
      }));
    }
  }, [dispatch, updatePokemon, formData, formName, id]);

  const handleDelete = useCallback(() => {
    if (!pokemon) return;
    
    dispatch(openConfirmDialog({
      title: 'Delete Pokemon',
      message: `Are you sure you want to delete ${pokemon.name}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {
        try {
          await deletePokemon(parseInt(id)).unwrap();
          dispatch(addNotification({
            type: 'success',
            title: 'Success!',
            message: `${pokemon.name} has been deleted successfully.`
          }));
          navigate('/pokemon');
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
  }, [dispatch, deletePokemon, pokemon, id, navigate]);

  // Loading and error states
  if (isLoading) return <div className="loading">Loading Pokémon details...</div>;
  if (isError) return <div className="error">Error: {error?.data?.message || error?.message || 'Failed to load Pokemon details'}</div>;
  if (!pokemon) return <div className="not-found">Pokémon not found</div>;

  return (
    <div className="pokemon-detail">
      {isEditing ? (
        <div className="edit-form-container">
          <h2>Edit Pokémon</h2>
          
          {(formErrors.submit || updateError) && (
            <div className="error-message">
              {formErrors.submit || updateError?.data?.message || updateError?.message || 'An error occurred'}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="pokemon-form">
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name || ''}
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
                value={formData.type || ''}
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
                value={formData.imageUrl || ''}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
              {formErrors.imageUrl && <div className="field-error">{formErrors.imageUrl}</div>}
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancelEdit}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="pokemon-header">
            <h2>{pokemon.name}</h2>
            <span className="pokemon-type">{pokemon.type}</span>
          </div>
          
          <div className="pokemon-content">
            <div className="pokemon-image-container">
              <img
                src={pokemon.imageUrl || 'https://placehold.co/300'}
                alt={pokemon.name}
                className="pokemon-detail-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/300';
                }}
              />
            </div>
            
            <div className="pokemon-info">
              <div className="info-item">
                <span className="label">ID:</span>
                <span className="value">{pokemon.id}</span>
              </div>
              <div className="info-item">
                <span className="label">Name:</span>
                <span className="value">{pokemon.name}</span>
              </div>
              <div className="info-item">
                <span className="label">Type:</span>
                <span className="value">{pokemon.type}</span>
              </div>
            </div>
          </div>
          
          {(isUpdating || isDeleting) && <div className="loading">Processing...</div>}
          
          <div className="actions">
            <button
              onClick={handleStartEdit}
              className="btn btn-primary"
              disabled={isUpdating || isDeleting}
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="btn btn-danger"
              disabled={isUpdating || isDeleting}
            >
              Delete
            </button>
            <Link to="/pokemon" className="btn btn-back">
              Back to Pokémon List
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default PokemonDetail;