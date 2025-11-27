import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const USERS_KEY = 'tm_users';
const CURRENT_USER_KEY = 'tm_current_user';

const demoUser = {
  id: 'demo-user',
  name: 'Demo Admin',
  email: 'demo@aurora.com',
  password: 'DemoPass123'
};

const getUsers = () => {
  const stored = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  if (!stored.find((u) => u.email === demoUser.email)) {
    const next = [...stored, demoUser];
    localStorage.setItem(USERS_KEY, JSON.stringify(next));
    return next;
  }
  return stored;
};

const setUsers = (data) => localStorage.setItem(USERS_KEY, JSON.stringify(data));

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = (email, password) => {
    const users = getUsers();
    const found = users.find((u) => u.email === email.toLowerCase());
    if (!found || found.password !== password) {
      throw new Error('Invalid email or password.');
    }
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(found));
    setUser(found);
  };

  const signup = (name, email, password) => {
    const users = getUsers();
    if (users.some((u) => u.email === email.toLowerCase())) {
      throw new Error('An account with this email already exists.');
    }
    const newUser = {
      id: crypto.randomUUID(),
      name,
      email: email.toLowerCase(),
      password
    };
    users.push(newUser);
    setUsers(users);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
  };

  const updateProfile = ({ name, email, password }) => {
    if (!user) {
      throw new Error('You must be logged in to update your profile.');
    }
    const users = getUsers();
    const existing = users.find((u) => u.id === user.id);
    if (!existing) {
      throw new Error('Account not found.');
    }
    const normalizedEmail = email ? email.toLowerCase() : existing.email;
    if (
      normalizedEmail !== existing.email &&
      users.some((u) => u.email === normalizedEmail)
    ) {
      throw new Error('Email is already in use.');
    }
    const updatedUser = {
      ...existing,
      name: name?.trim() || existing.name,
      email: normalizedEmail,
      password: password?.trim() ? password : existing.password
    };
    const nextUsers = users.map((u) => (u.id === existing.id ? updatedUser : u));
    setUsers(nextUsers);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      signup,
      logout,
      updateProfile
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

