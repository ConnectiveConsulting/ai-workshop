import React, { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  useGetAllPokemonQuery, 
  useGetAllTrainersQuery,
  useGetAllCapturesQuery,
  useCreateCaptureMutation,
  useDeleteCaptureMutation
} from '../../store/api';
import {
  selectFormState,
  updateFormData,
  setFormSubmitting,
  setFormErrors,
  resetForm,
  addNotification,
  openConfirmDialog
} from '../../store/slices/uiSlice';

const CaptureManager = () => {
  const dispatch = useDispatch();
  
  // RTK Query hooks - leveraging cached data from other components
  const {
    data: pokemon = [],
    error: pokemonError,
    isLoading: isPokemonLoading,
    isError: isPokemonError
  } = useGetAllPokemonQuery();
  
  const {
    data: trainers = [],
    error: trainersError,
    isLoading: isTrainersLoading,
    isError: isTrainersError
  } = useGetAllTrainersQuery();

  const {
    data: captures = [],
    error: capturesError,
    isLoading: isCapturesLoading,
    isError: isCapturesError
  } = useGetAllCapturesQuery();
  
  const [createCapture, { 
    isLoading: isCreating, 
    error: createError 
  }] = useCreateCaptureMutation();
  
  const [deleteCapture, { 
    isLoading: isDeleting 
  }] = useDeleteCaptureMutation();

  // UI state from Redux
  const formState = useSelector(selectFormState('captureForm'));
  const isSubmitting = formState.isSubmitting || isCreating;
  const formData = formState.data;
  const formErrors = formState.errors;

  // Memoized selectors for optimized rendering
  const availablePokemon = useMemo(() => {
    if (!pokemon.length || !captures.length) return pokemon;
    
    // Show all Pokemon, but we could filter to show only uncaptured ones if needed
    return pokemon.sort((a, b) => a.name.localeCompare(b.name));
  }, [pokemon, captures]);

  const availableTrainers = useMemo(() => {
    return trainers.sort((a, b) => a.name.localeCompare(b.name));
  }, [trainers]);

  // Enhanced captures with Pokemon and Trainer names from cached data
  const enhancedCaptures = useMemo(() => {
    return captures.map(capture => {
      const pokemonData = pokemon.find(p => p.id === capture.pokemonId);
      const trainerData = trainers.find(t => t.id === capture.trainerId);
      
      return {
        ...capture,
        pokemon: pokemonData,
        trainer: trainerData
      };
    }).sort((a, b) => new Date(b.captureDate) - new Date(a.captureDate));
  }, [captures, pokemon, trainers]);

  // Loading and error states
  const isLoading = isPokemonLoading || isTrainersLoading || isCapturesLoading;
  const hasError = isPokemonError || isTrainersError || isCapturesError;
  const error = pokemonError || trainersError || capturesError;

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    dispatch(updateFormData({ 
      formName: 'captureForm', 
      field: name, 
      value 
    }));
  }, [dispatch]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Validation
    const errors = {};
    if (!formData.pokemonId) errors.pokemonId = 'Please select a Pokémon';
    if (!formData.trainerId) errors.trainerId = 'Please select a Trainer';
    if (!formData.captureDate) errors.captureDate = 'Please select a capture date';
    
    // Check if this capture already exists
    const existingCapture = captures.find(c => 
      c.pokemonId === parseInt(formData.pokemonId) && 
      c.trainerId === parseInt(formData.trainerId)
    );
    
    if (existingCapture) {
      errors.submit = 'This Pokémon is already captured by this Trainer';
    }
    
    if (Object.keys(errors).length > 0) {
      dispatch(setFormErrors({ formName: 'captureForm', errors }));
      return;
    }

    try {
      dispatch(setFormSubmitting({ formName: 'captureForm', isSubmitting: true }));
      
      const captureData = {
        pokemonId: parseInt(formData.pokemonId),
        trainerId: parseInt(formData.trainerId),
        captureDate: new Date(formData.captureDate).toISOString()
      };
      
      await createCapture(captureData).unwrap();
      
      // Success - reset form
      dispatch(resetForm('captureForm'));
      
      const pokemonName = pokemon.find(p => p.id === captureData.pokemonId)?.name || 'Pokémon';
      const trainerName = trainers.find(t => t.id === captureData.trainerId)?.name || 'Trainer';
      
      dispatch(addNotification({
        type: 'success',
        title: 'Capture Created!',
        message: `${pokemonName} has been assigned to ${trainerName} successfully.`
      }));
      
    } catch (err) {
      console.error('Error creating capture:', err);
      dispatch(setFormErrors({ 
        formName: 'captureForm', 
        errors: { submit: 'Failed to create capture. Please try again.' }
      }));
      dispatch(addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to create capture. Please try again.'
      }));
    }
  }, [dispatch, createCapture, formData, captures, pokemon, trainers]);

  const handleDeleteCapture = useCallback((capture) => {
    const pokemonName = capture.pokemon?.name || `Pokémon #${capture.pokemonId}`;
    const trainerName = capture.trainer?.name || `Trainer #${capture.trainerId}`;
    
    dispatch(openConfirmDialog({
      title: 'Release Pokémon',
      message: `Are you sure you want to release ${pokemonName} from ${trainerName}? This action cannot be undone.`,
      confirmText: 'Release',
      cancelText: 'Cancel',
      type: 'warning',
      onConfirm: async () => {
        try {
          await deleteCapture({
            pokemonId: capture.pokemonId,
            trainerId: capture.trainerId
          }).unwrap();
          
          dispatch(addNotification({
            type: 'success',
            title: 'Pokémon Released!',
            message: `${pokemonName} has been released from ${trainerName} successfully.`
          }));
        } catch (err) {
          console.error('Error deleting capture:', err);
          dispatch(addNotification({
            type: 'error',
            title: 'Error',
            message: 'Failed to release Pokémon. Please try again.'
          }));
        }
      }
    }));
  }, [dispatch, deleteCapture]);

  // Show loading state while any data is loading
  if (isLoading && pokemon.length === 0 && trainers.length === 0 && captures.length === 0) {
    return <div className="loading">Loading capture data...</div>;
  }

  return (
    <div className="capture-manager">
      <h2>Capture Manager</h2>
      
      {hasError && (
        <div className="error-message">
          Error loading data: {error?.data?.message || error?.message || 'Please try again later.'}
        </div>
      )}
      
      <div className="capture-form-container">
        <h3>Assign Pokémon to Trainer</h3>
        
        {(formErrors.submit || createError) && (
          <div className="error-message">
            {formErrors.submit || createError?.data?.message || createError?.message || 'An error occurred'}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="capture-form">
          <div className="form-group">
            <label htmlFor="pokemonId">Pokémon:</label>
            <select
              id="pokemonId"
              name="pokemonId"
              value={formData.pokemonId || ''}
              onChange={handleInputChange}
              required
              disabled={isSubmitting || isPokemonLoading}
            >
              <option value="">Select a Pokémon</option>
              {availablePokemon.map((poke) => (
                <option key={poke.id} value={poke.id}>
                  {poke.name} ({poke.type})
                </option>
              ))}
            </select>
            {formErrors.pokemonId && <div className="field-error">{formErrors.pokemonId}</div>}
            
            {pokemon.length === 0 && !isPokemonLoading && (
              <div className="empty-message">
                <p>No Pokémon available.</p>
                <Link to="/pokemon" className="btn btn-sm btn-primary">Add Pokémon</Link>
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="trainerId">Trainer:</label>
            <select
              id="trainerId"
              name="trainerId"
              value={formData.trainerId || ''}
              onChange={handleInputChange}
              required
              disabled={isSubmitting || isTrainersLoading}
            >
              <option value="">Select a Trainer</option>
              {availableTrainers.map((trainer) => (
                <option key={trainer.id} value={trainer.id}>
                  {trainer.name} ({trainer.region})
                </option>
              ))}
            </select>
            {formErrors.trainerId && <div className="field-error">{formErrors.trainerId}</div>}
            
            {trainers.length === 0 && !isTrainersLoading && (
              <div className="empty-message">
                <p>No Trainers available.</p>
                <Link to="/trainers" className="btn btn-sm btn-primary">Add Trainer</Link>
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="captureDate">Capture Date:</label>
            <input
              type="date"
              id="captureDate"
              name="captureDate"
              value={formData.captureDate || ''}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              max={new Date().toISOString().split('T')[0]}
            />
            {formErrors.captureDate && <div className="field-error">{formErrors.captureDate}</div>}
          </div>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || pokemon.length === 0 || trainers.length === 0 || isLoading}
          >
            {isSubmitting ? 'Creating...' : 'Create Capture'}
          </button>
        </form>
      </div>
      
      <div className="captures-list-container">
        <h3>Existing Captures ({enhancedCaptures.length})</h3>
        
        {isCapturesLoading ? (
          <div className="loading">Loading captures...</div>
        ) : isCapturesError ? (
          <div className="error">Failed to load captures. Please try again.</div>
        ) : enhancedCaptures.length === 0 ? (
          <p>No captures found. Create your first capture above!</p>
        ) : (
          <>
            <div className="captures-summary">
              <p>
                Total captures: {enhancedCaptures.length} | 
                Unique Pokémon: {new Set(enhancedCaptures.map(c => c.pokemonId)).size} | 
                Active Trainers: {new Set(enhancedCaptures.map(c => c.trainerId)).size}
              </p>
            </div>
            
            <table className="captures-table">
              <thead>
                <tr>
                  <th>Pokémon</th>
                  <th>Trainer</th>
                  <th>Capture Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enhancedCaptures.map((capture) => (
                  <tr key={`${capture.pokemonId}-${capture.trainerId}`}>
                    <td>
                      <Link to={`/pokemon/${capture.pokemonId}`} className="link-primary">
                        {capture.pokemon ? (
                          <>
                            <strong>{capture.pokemon.name}</strong>
                            <span className="text-muted"> ({capture.pokemon.type})</span>
                          </>
                        ) : (
                          `Pokémon #${capture.pokemonId}`
                        )}
                      </Link>
                    </td>
                    <td>
                      <Link to={`/trainers/${capture.trainerId}`} className="link-primary">
                        {capture.trainer ? (
                          <>
                            <strong>{capture.trainer.name}</strong>
                            <span className="text-muted"> ({capture.trainer.region})</span>
                          </>
                        ) : (
                          `Trainer #${capture.trainerId}`
                        )}
                      </Link>
                    </td>
                    <td>{new Date(capture.captureDate).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteCapture(capture)}
                        className="btn btn-danger btn-sm"
                        disabled={isDeleting}
                        title="Release this Pokémon"
                      >
                        {isDeleting ? 'Releasing...' : 'Release'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
      
      {(isLoading || isDeleting) && (
        <div className="loading-overlay">
          <div className="loading">Processing...</div>
        </div>
      )}
    </div>
  );
};

export default CaptureManager;