import React, { createContext, useContext, useReducer, useMemo } from 'react';

// State shape
interface AppState {
  theme: 'light' | 'dark' | 'system';
  isLoading: boolean;
  notifications: Notification[];
  preferences: {
    reducedMotion: boolean;
    highContrast: boolean;
  };
  ui: {
    hasOpenModals: boolean;
    openModalIds: Set<string>;
  };
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
}

// Action types
type AppAction = 
  | { type: 'SET_THEME'; payload: AppState['theme'] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'timestamp'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<AppState['preferences']> }
  | { type: 'REGISTER_MODAL'; payload: string }
  | { type: 'UNREGISTER_MODAL'; payload: string };

// Initial state
const initialState: AppState = {
  theme: 'system',
  isLoading: false,
  notifications: [],
  preferences: {
    reducedMotion: false,
    highContrast: false,
  },
  ui: {
    hasOpenModals: false,
    openModalIds: new Set(),
  },
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'ADD_NOTIFICATION': {
      const notification: Notification = {
        ...action.payload,
        id: crypto.randomUUID(),
        timestamp: new Date(),
      };
      return { 
        ...state, 
        notifications: [...state.notifications, notification] 
      };
    }
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
    
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload },
      };
    
    case 'REGISTER_MODAL': {
      const newOpenModalIds = new Set(state.ui.openModalIds);
      newOpenModalIds.add(action.payload);
      return {
        ...state,
        ui: {
          ...state.ui,
          hasOpenModals: true,
          openModalIds: newOpenModalIds,
        },
      };
    }
    
    case 'UNREGISTER_MODAL': {
      const newOpenModalIds = new Set(state.ui.openModalIds);
      newOpenModalIds.delete(action.payload);
      return {
        ...state,
        ui: {
          ...state.ui,
          hasOpenModals: newOpenModalIds.size > 0,
          openModalIds: newOpenModalIds,
        },
      };
    }
    
    default:
      return state;
  }
};

// Context types
interface AppContextType {
  state: AppState;
  actions: {
    setTheme: (theme: AppState['theme']) => void;
    setLoading: (loading: boolean) => void;
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
    removeNotification: (id: string) => void;
    updatePreferences: (preferences: Partial<AppState['preferences']>) => void;
    registerModal: (modalId: string) => void;
    unregisterModal: (modalId: string) => void;
  };
}

// Create contexts - split for performance
const AppStateContext = createContext<AppState | undefined>(undefined);
const AppActionsContext = createContext<AppContextType['actions'] | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Memoized actions to prevent unnecessary re-renders
  const actions = useMemo(() => ({
    setTheme: (theme: AppState['theme']) => {
      dispatch({ type: 'SET_THEME', payload: theme });
    },
    
    setLoading: (loading: boolean) => {
      dispatch({ type: 'SET_LOADING', payload: loading });
    },
    
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => {
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    },
    
    removeNotification: (id: string) => {
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
    },
    
    updatePreferences: (preferences: Partial<AppState['preferences']>) => {
      dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
    },
    
    registerModal: (modalId: string) => {
      dispatch({ type: 'REGISTER_MODAL', payload: modalId });
    },
    
    unregisterModal: (modalId: string) => {
      dispatch({ type: 'UNREGISTER_MODAL', payload: modalId });
    },
  }), []);

  return (
    <AppStateContext.Provider value={state}>
      <AppActionsContext.Provider value={actions}>
        {children}
      </AppActionsContext.Provider>
    </AppStateContext.Provider>
  );
};

// Custom hooks
export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
};

export const useAppActions = () => {
  const context = useContext(AppActionsContext);
  if (context === undefined) {
    throw new Error('useAppActions must be used within an AppProvider');
  }
  return context;
};

// Convenience hook that combines both
export const useApp = () => ({
  state: useAppState(),
  actions: useAppActions(),
});

export default AppProvider;