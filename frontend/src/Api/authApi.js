import { create } from "zustand";
import axios from "axios";
const URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/auth"
    : "/api/auth";
axios.defaults.withCredentials = true;
export const useAuthApi = create((set) => ({
  user: null,
  error: null,
  isLoading: false,
  isAuthenticated: false,
  isCheckingAuth: true,
  message: null,

  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${URL}/signup`, {
        name,
        email,
        password,
      });
      set({
        user: response.data.user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error Singing up",
        isLoading: false,
      });
      throw error;
    }
  },
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${URL}/login`, {
        email,
        password,
      });
      set({
        user: response.data.user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error Logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${URL}/logout`);
      set({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error Logging out",
        isLoading: false,
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${URL}/check-auth`);
      set({
        user: response.data.user,
        isLoading: false,
        isAuthenticated: true,
        isCheckingAuth: false,
        error: null,
      });
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      set({
        error: null,
        isCheckingAuth: false,
        isAuthenticated: false,
      });
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${URL}/verify-email`, { code });
      set({
        user: response.data.user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },
  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${URL}/reset-password/${token}`, {
        password,
      });
      set({
        isLoading: false,
        error: null,
        message: response.data.message,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Error resetting password",
        isLoading: false,
      });
      throw error;
    }
  },
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${URL}/forgot-password`, { email });
      set({
        isLoading: false,
        error: null,
        message: response.data.message,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Error forgotting password",
        isLoading: false,
      });
      throw error;
    }
  },
  settingUsername: async (username) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${URL}/set-username`, { username });
      set({
        user: response.data.user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Error setting username",
        isLoading: false,
      });
      throw error;
    }
  },
}));
