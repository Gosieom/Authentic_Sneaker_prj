import { create } from 'zustand';

export const useUIStore = create((set) => ({
  sidebarOpen: false,
  currentPage: 'dashboard',
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCurrentPage: (page) => set({ currentPage: page })
}));