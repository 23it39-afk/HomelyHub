
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",

  initialState: {
    user: null,
    success: false,
    loading: false,
    error: null,
    isAuthenticated: false,
  },

  reducers: {
    // ================= SIGNUP =================

    getSignupRequest(state) {
      state.loading = true;
      state.error = null;
    },

    getSingupDetails(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },

    // ================= LOGIN =================

    getLoginRequest(state) {
      state.loading = true;
      state.error = null;
    },

    getLoginDetails(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },

    // ================= ERROR =================

    getError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // ================= CURRENT USER =================

    getCurrentRequest(state) {
      state.loading = true;
      state.error = null;
    },

    getCurrentUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },

    // ================= UPDATE USER =================

    getUpdateUserRequest(state) {
      state.loading = true;
      state.error = null;
    },

    // ================= LOGOUT =================

    getLogoutRequest(state) {
      state.loading = true;
      state.error = null;
    },

    getLogout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },

    // ================= PASSWORD =================

    getPasswordRequest(state) {
      state.loading = true;
      state.error = null;
    },

    getPasswordSuccess(state, action) {
      state.success = action.payload;
      state.loading = false;
      state.error = null;
    },

    // ================= CLEAR ERROR =================

    clearError(state) {
      state.error = null;
    },
  },
});

export const userAction = userSlice.actions;

export default userSlice.reducer;
