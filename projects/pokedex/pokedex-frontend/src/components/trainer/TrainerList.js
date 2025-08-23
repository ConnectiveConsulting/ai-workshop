import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  useGetAllTrainersQuery, 
  useCreateTrainerMutation, 
  useDeleteTrainerMutation 
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

const TrainerList = () => {
  const dispatch = useDispatch();
  
  // RTK Query hooks
  const {
    data: trainers = [],
    error,
    isLoading,
    isError
  } = useGetAllTrainersQuery();
  
  const [createTrainer, { 
    isLoading: isCreating, 
    error: createError 
  }] = useCreateTrainerMutation();
  
  const [deleteTrainer, { 
    isLoading: isDeleting 
  }] = useDeleteTrainerMutation();

  // UI state from Redux
  const formState = useSelector(selectFormState('newTrainer'));
  const showForm = formState.isOpen;
  const isSubmitting = formState.isSubmitting || isCreating;
  const formData = formState.data;
  const formErrors = formState.errors;

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    dispatch(updateFormData({ 
      formName: 'newTrainer', 
      field: name, 
      value 
    }));
  }, [dispatch]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Basic validation
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.region.trim()) errors.region = 'Region is required';
    
    if (Object.keys(errors).length > 0) {
      dispatch(setFormErrors({ formName: 'newTrainer', errors }));
      return;
    }

    try {
      dispatch(setFormSubmitting({ formName: 'newTrainer', isSubmitting: true }));
      
      await createTrainer({
        name: formData.name.trim(),
        region: formData.region.trim(),
        email: formData.email?.trim() || undefined,
        phone: formData.phone?.trim() || undefined
      }).unwrap();
      
      // Success - reset form and close
      dispatch(resetForm('newTrainer'));
      dispatch(closeForm('newTrainer'));
      dispatch(addNotification({
        type: 'success',
        title: 'Success!',
        message: `${formData.name} has been created successfully.`
      }));
      
    } catch (err) {
      console.error('Error creating Trainer:', err);
      dispatch(setFormErrors({ 
        formName: 'newTrainer', 
        errors: { submit: 'Failed to create Trainer. Please try again.' }
      }));
      dispatch(addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to create Trainer. Please try again.'
      }));
    }
  }, [dispatch, createTrainer, formData]);

  const handleDelete = useCallback((trainer) => {
    dispatch(openConfirmDialog({
      title: 'Delete Trainer',
      message: `Are you sure you want to delete ${trainer.name}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {
        try {
          await deleteTrainer(trainer.id).unwrap();
          dispatch(addNotification({
            type: 'success',
            title: 'Success!',
            message: `${trainer.name} has been deleted successfully.`
          }));
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
  }, [dispatch, deleteTrainer]);

  const handleToggleForm = useCallback(() => {
    if (showForm) {
      dispatch(closeForm('newTrainer'));
    } else {
      dispatch(openForm({ 
        formName: 'newTrainer',
        initialData: {
          name: '',
          region: '',
          email: '',
          phone: ''
        }
      }));
    }
  }, [dispatch, showForm]);

  // Loading and error states
  if (isLoading) return <div className="loading">Loading Trainers...</div>;
  if (isError) return <div className="error">Error: {error?.data?.message || error?.message || 'Failed to load Trainers'}</div>;

  return (
    <div className="trainer-list">
      <div className="list-header">
        <h2>Trainers List</h2>
        <button
          className="btn btn-primary"
          onClick={handleToggleForm}
          disabled={isSubmitting}
        >
          {showForm ? 'Cancel' : 'Add New Trainer'}
        </button>
      </div>

      {(formErrors.submit || createError) && (
        <div className="error-message">
          {formErrors.submit || createError?.data?.message || createError?.message || 'An error occurred'}
        </div>
      )}

      {showForm && (
        <div className="trainer-form-container">
          <h3>Add New Trainer</h3>
          <form onSubmit={handleSubmit} className="trainer-form">
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
              <label htmlFor="region">Region:</label>
              <input
                type="text"
                id="region"
                name="region"
                value={formData.region}
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
                value={formData.email}
                onChange={handleInputChange}
                disabled={isSubmitting}
                placeholder="trainer@example.com"
              />
              {formErrors.email && <div className="field-error">{formErrors.email}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone (Optional):</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={isSubmitting}
                placeholder="(555) 123-4567"
              />
              {formErrors.phone && <div className="field-error">{formErrors.phone}</div>}
            </div>
            <button type="submit" className="btn btn-success" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Trainer'}
            </button>
          </form>
        </div>
      )}

      {(isLoading || isDeleting) && <div className="loading">Loading...</div>}
      
      {trainers.length === 0 ? (
        <p>No Trainers found.</p>
      ) : (
        <div className="trainer-grid">
          {trainers.map((trainer) => (
            <div key={trainer.id} className="trainer-card">
              <h3>{trainer.name}</h3>
              <p>Region: {trainer.region}</p>
              {trainer.email && <p>Email: {trainer.email}</p>}
              {trainer.phone && <p>Phone: {trainer.phone}</p>}
              <div className="card-actions">
                <Link to={`/trainers/${trainer.id}`} className="btn btn-info">
                  View Details
                </Link>
                <button
                  onClick={() => handleDelete(trainer)}
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

export default TrainerList;