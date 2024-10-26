import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: null,
  isAuthenticated: null,
  id: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.username = action.payload.username;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.id = action.payload.id;
    },
    clearUser: () => initialState,
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
