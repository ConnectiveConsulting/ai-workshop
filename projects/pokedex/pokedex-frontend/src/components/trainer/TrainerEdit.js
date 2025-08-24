import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  useGetTrainerByIdQuery,
  useCreateTrainerMutation,
  useUpdateTrainerMutation
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

const TrainerEdit = ({ trainerId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Determine if we're in edit mode
  const isEditMode = Boolean(trainerId);
  const formName = isEditMode ? 'editTrainer' : 'newTrainer';
  
  // RTK Query hooks
  const {
    data: existingTrainer,
    error: fetchError,
    isLoading: isFetching
  } = useGetTrainerByIdQuery(parseInt(trainerId), {
    skip: !isEditMode
  });
  
  const [createTrainer, {
    isLoading: isCreating,
    error: createError
  }] = useCreateTrainerMutation();
  
  const [updateTrainer, {
    isLoading: isUpdating,
    error: updateError
  }] = useUpdateTrainerMutation();

  // UI state from Redux
  const formState = useSelector(selectFormState(formName)) || {};
  const isSubmitting = formState.isSubmitting || isCreating || isUpdating;
  const formData = formState.data || {};
  const formErrors = formState.errors || {};
  
  // Initialize form when component mounts or when existing Trainer data loads
  useEffect(() => {
    if (isEditMode && existingTrainer) {
      // Edit mode - populate with existing data
      dispatch(openForm({
        formName,
        initialData: {
          name: existingTrainer.name || '',
          region: existingTrainer.region || '',
          email: existingTrainer.email || '',
          phone: existingTrainer.phone || ''
        }
      }));
    } else if (!isEditMode) {
      console.log('Initializing create form with empty data');
      // Create mode - initialize with empty data
      dispatch(openForm({
        formName,
        initialData: {
          name: '',
          region: '',
          email: '',
          phone: ''
        }
      }));
    }
  }, [dispatch, formName, isEditMode, existingTrainer]);

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
    if (!formData.region?.trim()) errors.region = 'Region is required';
    
    if (Object.keys(errors).length > 0) {
      dispatch(setFormErrors({ formName, errors }));
      return;
    }

    try {
      dispatch(setFormSubmitting({ formName, isSubmitting: true }));
      
      const trainerData = {
        name: formData.name.trim(),
        region: formData.region.trim(),
        email: formData.email?.trim() || undefined,
        phone: formData.phone?.trim() || undefined
      };

      if (isEditMode) {
        // Update existing Trainer
        console.log('Updating Trainer with data:', {
          id: parseInt(trainerId),
          ...trainerData
        });
		await updateTrainer({
          id: trainerId,
          ...trainerData
          }).unwrap();
        
        dispatch(addNotification({
          type: 'success',
          title: 'Success!',
          message: `${formData.name} has been updated successfully.`
        }));
      } else {
        // Create new Trainer
        await createTrainer(trainerData).unwrap();
        
        dispatch(addNotification({
          type: 'success',
          title: 'Success!',
          message: `${formData.name} has been created successfully.`
        }));
      }
      
      // Success - reset form and navigate back
      dispatch(resetForm(formName));
      dispatch(closeForm(formName));
      navigate('/trainers');
      
    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} Trainer:`, err);
      const errorMessage = `Failed to ${isEditMode ? 'update' : 'create'} Trainer. Please try again.`;
      
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
  }, [dispatch, formName, formData, isEditMode, trainerId, createTrainer, updateTrainer, navigate]);

  const handleCancel = useCallback(() => {
    dispatch(resetForm(formName));
    dispatch(closeForm(formName));
    navigate('/trainers');
  }, [dispatch, formName, navigate]);

  // Loading and error states
  if (isEditMode && isFetching) {
    return <div className="loading">Loading Trainer data...</div>;
  }
  
  if (isEditMode && fetchError) {
    return (
      <div className="error">
        Error: {fetchError?.data?.message || fetchError?.message || 'Failed to load Trainer data'}
      </div>
    );
  }

  // Don't render form until we have data for edit mode
  if (isEditMode && !existingTrainer) {
    return <div className="loading">Loading...</div>;
  }

  const currentError = formErrors.submit || createError || updateError;

  return (
    <div className="trainer-edit">
      <div className="form-header">
        <h2>{isEditMode ? 'Edit Trainer' : 'Create New Trainer'}</h2>
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

      <div className="trainer-form-container">
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
            <label htmlFor="email">Email (Optional):</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ''}
              onChange={handleInputChange}
              placeholder="trainer@example.com"
              disabled={isSubmitting}
            />
            {formErrors.email && <div className="field-error">{formErrors.email}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone (Optional):</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone || ''}
              onChange={handleInputChange}
              placeholder="(555) 123-4567"
              disabled={isSubmitting}
            />
            {formErrors.phone && <div className="field-error">{formErrors.phone}</div>}
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-success" disabled={isSubmitting}>
              {isSubmitting
                ? (isEditMode ? 'Updating...' : 'Creating...')
                : (isEditMode ? 'Update Trainer' : 'Create Trainer')
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

export default TrainerEdit;