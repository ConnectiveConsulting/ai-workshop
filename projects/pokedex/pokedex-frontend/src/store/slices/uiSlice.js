import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Global loading state
  isLoading: false,
  
  // Notifications system
  notifications: [],
  
  // Modal states
  modals: {
    pokemonDetail: false,
    trainerDetail: false,
    captureForm: false,
    confirmDelete: false,
    pokemonForm: false,
    trainerForm: false,
  },
  
  // Form states
  forms: {
    newPokemon: {
      isOpen: false,
      isSubmitting: false,
      data: {
        name: '',
        type: '',
        level: 1,
        hp: 0,
        attack: 0,
        defense: 0,
        speed: 0,
      },
      errors: {},
    },
    editPokemon: {
      isOpen: false,
      isSubmitting: false,
      data: {
        name: '',
        type: '',
        imageUrl: '',
      },
      errors: {},
    },
    newTrainer: {
      isOpen: false,
      isSubmitting: false,
      data: {
        name: '',
        region: '',
        email: '',
        phone: '',
      },
      errors: {},
    },
    captureForm: {
      isOpen: false,
      isSubmitting: false,
      data: {
        pokemonId: null,
        trainerId: null,
        captureDate: new Date().toISOString().split('T')[0],
      },
      errors: {},
    },
  },
  
  // Global filter states
  filters: {
    pokemonType: '',
    trainerRegion: '',
    searchTerm: '',
  },
  
  // UI preferences
  theme: 'light',
  sidebarOpen: true,
  viewMode: 'grid', // 'grid' | 'list'
  
  // Confirmation dialog state
  confirmDialog: {
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: null,
    type: 'default', // 'default' | 'danger' | 'warning'
  },
  
  // Active page/view state
  activeView: {
    currentPage: 'home',
    selectedPokemonId: null,
    selectedTrainerId: null,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Global loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    // Notification management
    addNotification: (state, action) => {
      const notification = {
        id: Date.now() + Math.random(),
        type: 'info', // 'info' | 'success' | 'warning' | 'error'
        title: '',
        message: '',
        duration: 5000,
        ...action.payload,
      };
      state.notifications.push(notification);
    },
    
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    // Modal management
    openModal: (state, action) => {
      const { modalName } = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = true;
      }
    },
    
    closeModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = false;
      }
    },
    
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((modal) => {
        state.modals[modal] = false;
      });
    },
    
    // Form management
    openForm: (state, action) => {
      const { formName, initialData } = action.payload;
      if (state.forms.hasOwnProperty(formName)) {
        state.forms[formName].isOpen = true;
        if (initialData) {
          state.forms[formName].data = { ...state.forms[formName].data, ...initialData };
        }
      }
    },
    
    closeForm: (state, action) => {
      const formName = action.payload;
      if (state.forms.hasOwnProperty(formName)) {
        state.forms[formName].isOpen = false;
        state.forms[formName].isSubmitting = false;
        state.forms[formName].errors = {};
      }
    },
    
    updateFormData: (state, action) => {
      const { formName, field, value } = action.payload;
      if (state.forms.hasOwnProperty(formName)) {
        state.forms[formName].data[field] = value;
        // Clear field-specific error when user starts typing
        if (state.forms[formName].errors[field]) {
          delete state.forms[formName].errors[field];
        }
      }
    },
    
    setFormSubmitting: (state, action) => {
      const { formName, isSubmitting } = action.payload;
      if (state.forms.hasOwnProperty(formName)) {
        state.forms[formName].isSubmitting = isSubmitting;
      }
    },
    
    setFormErrors: (state, action) => {
      const { formName, errors } = action.payload;
      if (state.forms.hasOwnProperty(formName)) {
        state.forms[formName].errors = errors;
        state.forms[formName].isSubmitting = false;
      }
    },
    
    resetForm: (state, action) => {
      const formName = action.payload;
      if (state.forms.hasOwnProperty(formName)) {
        const formConfig = initialState.forms[formName];
        state.forms[formName] = { ...formConfig };
      }
    },
    
    // Global filter management
    setGlobalFilter: (state, action) => {
      const { filterType, value } = action.payload;
      if (state.filters.hasOwnProperty(filterType)) {
        state.filters[filterType] = value;
      }
    },
    
    clearGlobalFilters: (state) => {
      state.filters = {
        pokemonType: '',
        trainerRegion: '',
        searchTerm: '',
      };
    },
    
    // UI preferences
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    
    // Confirmation dialog
    openConfirmDialog: (state, action) => {
      state.confirmDialog = {
        ...state.confirmDialog,
        isOpen: true,
        ...action.payload,
      };
    },
    
    closeConfirmDialog: (state) => {
      state.confirmDialog = {
        ...initialState.confirmDialog,
      };
    },
    
    // Active view management
    setActiveView: (state, action) => {
      const { page, pokemonId, trainerId } = action.payload;
      state.activeView.currentPage = page;
      if (pokemonId !== undefined) {
        state.activeView.selectedPokemonId = pokemonId;
      }
      if (trainerId !== undefined) {
        state.activeView.selectedTrainerId = trainerId;
      }
    },
    
    clearActiveSelection: (state) => {
      state.activeView.selectedPokemonId = null;
      state.activeView.selectedTrainerId = null;
    },
  },
});

// Export actions
export const {
  setLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  closeAllModals,
  openForm,
  closeForm,
  updateFormData,
  setFormSubmitting,
  setFormErrors,
  resetForm,
  setGlobalFilter,
  clearGlobalFilters,
  toggleTheme,
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  setViewMode,
  openConfirmDialog,
  closeConfirmDialog,
  setActiveView,
  clearActiveSelection,
} = uiSlice.actions;

// Selectors
export const selectIsLoading = (state) => state.ui.isLoading;
export const selectNotifications = (state) => state.ui.notifications;
export const selectModals = (state) => state.ui.modals;
export const selectModalState = (modalName) => (state) => state.ui.modals[modalName];
export const selectForms = (state) => state.ui.forms;
export const selectFormState = (formName) => (state) => state.ui.forms[formName];
export const selectGlobalFilters = (state) => state.ui.filters;
export const selectTheme = (state) => state.ui.theme;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectViewMode = (state) => state.ui.viewMode;
export const selectConfirmDialog = (state) => state.ui.confirmDialog;
export const selectActiveView = (state) => state.ui.activeView;

// Compound selectors
export const selectIsAnyModalOpen = (state) => {
  return Object.values(state.ui.modals).some(isOpen => isOpen);
};

export const selectIsAnyFormOpen = (state) => {
  return Object.values(state.ui.forms).some(form => form.isOpen);
};

export const selectActiveNotificationsCount = (state) => {
  return state.ui.notifications.length;
};

export default uiSlice.reducer;