import { defineStore } from 'pinia';

export const useSessionStore = defineStore('session', {
    state: () => ({
        userId: 1, // Renamed to userId to emphasize it's the *user* session
        // You might also store other global session info here, e.g., userName, isAuthenticated
    }),
    actions: {
        setUserId(id) {
            this.userId = id;
            // Optional: Persist to localStorage for session continuity across the page reloads
            localStorage.setItem('activeUserId', id);
        },
        clearSession() {
            this.userId = null;
            localStorage.removeItem('activeUserId');
        },
        // Optional: An action to initialize the store from localStorage on an app load
        initializeSession() {
            const storedId = localStorage.getItem('activeUserId');
            if (storedId) {
              this.userId = storedId;
            }
        }
    },
    getters: {
        getUserId: (state) => state.userId,
        isAuthenticated: (state) => state.userId !== null,
    }
});