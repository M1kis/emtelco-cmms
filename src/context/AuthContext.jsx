import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../lib/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('emtelco_cmms_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const valid = INITIAL_USERS.find(u => u.id === parsed.id || u.rol === parsed.rol);
        if (valid) return valid;
      } catch (e) {
        console.warn('Error recuperando usuario:', e);
      }
    }
    return INITIAL_USERS[0]; // Default: Administrador TICS
  });

  const [availableUsers] = useState(INITIAL_USERS);

  const switchUser = (userId) => {
    const found = availableUsers.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
      localStorage.setItem('emtelco_cmms_user', JSON.stringify(found));
    }
  };

  const isAdmin = currentUser?.rol === 'ADMIN';
  const isTechnician = currentUser?.rol === 'TECNICO';

  return (
    <AuthContext.Provider value={{
      currentUser,
      switchUser,
      availableUsers,
      isAdmin,
      isTechnician
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
