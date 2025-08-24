import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  useGetPokemonByIdQuery,
  useCreatePokemonMutation,
  useUpdatePokemonMutation
} from '../../store/api';
import {
  selectFormState,
  openForm,
  closeForm,
  updateFormData,
  setFormSubmitting,
  setFormErrors,
  resetForm,
  addNotification
} from '../../store/slices/uiSlice';

const PokemonEdit = ({ pokemonId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Determine if we're in edit mode
  const isEditMode = Boolean(pokemonId);
  const formName = isEditMode ? 'editPokemon' : 'newPokemon';
  
  // RTK Query hooks
  const {
    data: existingPokemon,
    error: fetchError,
    isLoading: isFetching
  } = useGetPokemonByIdQuery(pokemonId, {
    skip: !isEditMode
  });
  
  const [createPokemon, {
    isLoading: isCreating,
    error: createError
  }] = useCreatePokemonMutation();
  
  const [updatePokemon, {
    isLoading: isUpdating,
    error: updateError
  }] = useUpdatePokemonMutation();

  // UI state from Redux
  const formState = useSelector(selectFormState(formName)) || {};
  const isSubmitting = formState.isSubmitting || isCreating || isUpdating;
  const formData = formState.data || {};
  const formErrors = formState.errors || {};

  // Initialize form when component mounts or when existing Pokemon data loads
  useEffect(() => {
    if (isEditMode && existingPokemon) {
      // Edit mode - populate with existing data
      dispatch(openForm({ 
        formName,
        initialData: {
          name: existingPokemon.name || '',
          type: existingPokemon.type || '',
          imageUrl: existingPokemon.imageUrl || ''
        }
      }));
    } else if (!isEditMode) {
      // Create mode - initialize with empty data
      dispatch(openForm({ 
        formName,
        initialData: {
          name: '',
          type: '',
          imageUrl: ''
        }
      }));
    }
  }, [dispatch, formName, isEditMode, existingPokemon]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    dispatch(updateFormData({ 
      formName, 
      field: name, 
      value 
    }));
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
      
      const pokemonData = {
        name: formData.name.trim(),
        type: formData.type.trim(),
        imageUrl: formData.imageUrl?.trim() || undefined
      };

      if (isEditMode) {
        // Update existing Pokemon
        console.log('Updating Pokemon with data:', {
          id: pokemonId,
          ...pokemonData
        });
        await updatePokemon({
          id: pokemonId,
          ...pokemonData
        }).unwrap();
        
        dispatch(addNotification({
          type: 'success',
          title: 'Success!',
          message: `${formData.name} has been updated successfully.`
        }));
      } else {
        // Create new Pokemon
        await createPokemon(pokemonData).unwrap();
        
        dispatch(addNotification({
          type: 'success',
          title: 'Success!',
          message: `${formData.name} has been created successfully.`
        }));
      }
      
      // Success - reset form and navigate back
      dispatch(resetForm(formName));
      dispatch(closeForm(formName));
      navigate('/pokemon');
      
    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} Pokemon:`, err);
      const errorMessage = `Failed to ${isEditMode ? 'update' : 'create'} Pokemon. Please try again.`;
      
      dispatch(setFormErrors({ 
        formName, 
        errors: { submit: errorMessage }
      }));
      dispatch(addNotification({
        type: 'error',
        title: 'Error',
        message: errorMessage
      }));
    }
  }, [dispatch, formName, formData, isEditMode, pokemonId, createPokemon, updatePokemon, navigate]);

  const handleCancel = useCallback(() => {
    dispatch(resetForm(formName));
    dispatch(closeForm(formName));
    navigate('/pokemon');
  }, [dispatch, formName, navigate]);

  // Loading and error states
  if (isEditMode && isFetching) {
    return <div className="loading">Loading Pokémon data...</div>;
  }
  
  if (isEditMode && fetchError) {
    return (
      <div className="error">
        Error: {fetchError?.data?.message || fetchError?.message || 'Failed to load Pokemon data'}
      </div>
    );
  }

  // Don't render form until we have data for edit mode
  if (isEditMode && !existingPokemon) {
    return <div className="loading">Loading...</div>;
  }

  const currentError = formErrors.submit || createError || updateError;

  return (
    <div className="pokemon-edit">
      <div className="form-header">
        <h2>{isEditMode ? 'Edit Pokemon' : 'Create New Pokemon'}</h2>
        <button
          className="btn btn-secondary"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>

      {currentError && (
        <div className="error-message">
          {typeof currentError === 'string' 
            ? currentError 
            : currentError?.data?.message || currentError?.message || 'An error occurred'
          }
        </div>
      )}

      <div className="pokemon-form-container">
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
              placeholder="https://example.com/image.png"
              disabled={isSubmitting}
            />
            {formErrors.imageUrl && <div className="field-error">{formErrors.imageUrl}</div>}
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-success" disabled={isSubmitting}>
              {isSubmitting
                ? (isEditMode ? 'Updating...' : 'Creating...')
                : (isEditMode ? 'Update Pokémon' : 'Create Pokémon')
              }
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PokemonEdit;