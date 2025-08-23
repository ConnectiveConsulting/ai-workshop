import React, { useCallback, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  useGetTrainerByIdQuery, 
  useUpdateTrainerMutation, 
  useDeleteTrainerMutation,
  useGetCapturesByTrainerIdQuery,
  useDeleteCaptureMutation
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

const TrainerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // RTK Query hooks
  const {
    data: trainer,
    error: trainerError,
    isLoading: isTrainerLoading,
    isError: isTrainerError
  } = useGetTrainerByIdQuery(id, {
    skip: !id
  });

  const {
    data: captures = [],
    error: capturesError,
    isLoading: isCapturesLoading,
    isError: isCapturesError
  } = useGetCapturesByTrainerIdQuery(id, {
    skip: !id
  });
  
  const [updateTrainer, { 
    isLoading: isUpdating, 
    error: updateError 
  }] = useUpdateTrainerMutation();
  
  const [deleteTrainer, { 
    isLoading: isDeleting 
  }] = useDeleteTrainerMutation();

  const [deleteCapture, { 
    isLoading: isReleasingCapture 
  }] = useDeleteCaptureMutation();

  // UI state from Redux - using a form named with the trainer ID for uniqueness
  const formName = `editTrainer_${id}`;
  const formState = useSelector(selectFormState(formName));
  const isEditing = formState?.isOpen || false;
  const isSubmitting = formState?.isSubmitting || isUpdating;
  const formData = useMemo(() => formState?.data || {}, [formState?.data]);
  const formErrors = formState?.errors || {};

  // Initialize form data when trainer loads
  useEffect(() => {
    if (trainer && isEditing && !formData.name) {
      dispatch(updateFormData({ 
        formName, 
        field: 'name', 
        value: trainer.name || ''
      }));
      dispatch(updateFormData({ 
        formName, 
        field: 'region', 
        value: trainer.region || ''
      }));
      dispatch(updateFormData({ 
        formName, 
        field: 'email', 
        value: trainer.email || ''
      }));
      dispatch(updateFormData({ 
        formName, 
        field: 'phone', 
        value: trainer.phone || ''
      }));
    }
  }, [trainer, isEditing, formData.name, dispatch, formName]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    dispatch(updateFormData({ 
      formName, 
      field: name, 
      value 
    }));
  }, [dispatch, formName]);

  const handleStartEdit = useCallback(() => {
    if (trainer) {
      dispatch(openForm({ 
        formName,
        initialData: {
          name: trainer.name || '',
          region: trainer.region || '',
          email: trainer.email || '',
          phone: trainer.phone || ''
        }
      }));
    }
  }, [dispatch, formName, trainer]);

  const handleCancelEdit = useCallback(() => {
    dispatch(closeForm(formName));
    dispatch(resetForm(formName));
  }, [dispatch, formName]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Basic validation
    const errors = {};
    if (!formData.name?.trim()) errors.name = 'Name is required';
    if (!formData.region?.trim()) errors.region = 'Region is required';
    
    if (Object.keys(errors).length > 0) {
      dispatch(setFormErrors({ formName, errors }));
      return;
    }

    try {
      dispatch(setFormSubmitting({ formName, isSubmitting: true }));
      
      await updateTrainer({
        id: parseInt(id),
        name: formData.name.trim(),
        region: formData.region.trim(),
        email: formData.email?.trim() || undefined,
        phone: formData.phone?.trim() || undefined
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
      console.error('Error updating Trainer:', err);
      dispatch(setFormErrors({ 
        formName, 
        errors: { submit: 'Failed to update Trainer. Please try again.' }
      }));
      dispatch(addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update Trainer. Please try again.'
      }));
    }
  }, [dispatch, updateTrainer, formData, formName, id]);

  const handleDelete = useCallback(() => {
    if (!trainer) return;
    
    dispatch(openConfirmDialog({
      title: 'Delete Trainer',
      message: `Are you sure you want to delete ${trainer.name}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {
        try {
          await deleteTrainer(parseInt(id)).unwrap();
          dispatch(addNotification({
            type: 'success',
            title: 'Success!',
            message: `${trainer.name} has been deleted successfully.`
          }));
          navigate('/trainers');
        } catch (err) {
          console.error('Error deleting Trainer:', err);
          dispatch(addNotification({
            type: 'error',
            title: 'Error',
            message: 'Failed to delete Trainer. Please try again.'
          }));
        }
      }
    }));
  }, [dispatch, deleteTrainer, trainer, id, navigate]);

  const handleReleaseCapture = useCallback((capture) => {
    const pokemonName = capture.pokemon?.name || `Pokémon #${capture.pokemonId}`;
    
    dispatch(openConfirmDialog({
      title: 'Release Pokémon',
      message: `Are you sure you want to release ${pokemonName}? This action cannot be undone.`,
      confirmText: 'Release',
      cancelText: 'Cancel',
      type: 'warning',
      onConfirm: async () => {
        try {
          await deleteCapture({
            pokemonId: capture.pokemonId,
            trainerId: parseInt(id)
          }).unwrap();
          dispatch(addNotification({
            type: 'success',
            title: 'Success!',
            message: `${pokemonName} has been released successfully.`
          }));
        } catch (err) {
          console.error('Error releasing Pokémon:', err);
          dispatch(addNotification({
            type: 'error',
            title: 'Error',
            message: 'Failed to release Pokémon. Please try again.'
          }));
        }
      }
    }));
  }, [dispatch, deleteCapture, id]);

  // Loading and error states
  const isLoading = isTrainerLoading || isCapturesLoading;
  const error = trainerError || capturesError;
  const isError = isTrainerError || isCapturesError;

  if (isLoading) return <div className="loading">Loading Trainer details...</div>;
  if (isError) return <div className="error">Error: {error?.data?.message || error?.message || 'Failed to load Trainer details'}</div>;
  if (!trainer) return <div className="not-found">Trainer not found</div>;

  return (
    <div className="trainer-detail">
      {isEditing ? (
        <div className="edit-form-container">
          <h2>Edit Trainer</h2>
          
          {(formErrors.submit || updateError) && (
            <div className="error-message">
              {formErrors.submit || updateError?.data?.message || updateError?.message || 'An error occurred'}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="trainer-form">
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
              <label htmlFor="region">Region:</label>
              <input
                type="text"
                id="region"
                name="region"
                value={formData.region || ''}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
              {formErrors.region && <div className="field-error">{formErrors.region}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                disabled={isSubmitting}
                placeholder="trainer@example.com"
              />
              {formErrors.email && <div className="field-error">{formErrors.email}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone:</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                disabled={isSubmitting}
                placeholder="(555) 123-4567"
              />
              {formErrors.phone && <div className="field-error">{formErrors.phone}</div>}
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
          <div className="trainer-header">
            <h2>{trainer.name}</h2>
            <span className="trainer-region">Region: {trainer.region}</span>
          </div>
          
          <div className="trainer-content">
            <div className="trainer-info">
              <div className="info-item">
                <span className="label">ID:</span>
                <span className="value">{trainer.id}</span>
              </div>
              <div className="info-item">
                <span className="label">Name:</span>
                <span className="value">{trainer.name}</span>
              </div>
              <div className="info-item">
                <span className="label">Region:</span>
                <span className="value">{trainer.region}</span>
              </div>
              {trainer.email && (
                <div className="info-item">
                  <span className="label">Email:</span>
                  <span className="value">{trainer.email}</span>
                </div>
              )}
              {trainer.phone && (
                <div className="info-item">
                  <span className="label">Phone:</span>
                  <span className="value">{trainer.phone}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="trainer-pokemon">
            <h3>Captured Pokémon</h3>
            {isCapturesLoading ? (
              <div className="loading">Loading captures...</div>
            ) : isCapturesError ? (
              <div className="error">Failed to load captures</div>
            ) : captures.length === 0 ? (
              <p>This trainer hasn't captured any Pokémon yet.</p>
            ) : (
              <div className="captures-list">
                {captures.map((capture) => (
                  <div key={capture.pokemonId} className="capture-item">
                    <div className="capture-info">
                      <Link to={`/pokemon/${capture.pokemonId}`}>
                        {capture.pokemon ? capture.pokemon.name : `Pokémon #${capture.pokemonId}`}
                      </Link>
                      <span className="capture-date">
                        Captured on: {new Date(capture.captureDate).toLocaleDateString()}
                      </span>
                    </div>
                    <button
                      onClick={() => handleReleaseCapture(capture)}
                      className="btn btn-danger btn-sm"
                      disabled={isReleasingCapture}
                    >
                      Release
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {(isUpdating || isDeleting || isReleasingCapture) && <div className="loading">Processing...</div>}
          
          <div className="actions">
            <button
              onClick={handleStartEdit}
              className="btn btn-primary"
              disabled={isUpdating || isDeleting || isReleasingCapture}
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="btn btn-danger"
              disabled={isUpdating || isDeleting || isReleasingCapture}
            >
              Delete
            </button>
            <Link to="/trainers" className="btn btn-back">
              Back to Trainers List
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default TrainerDetail;