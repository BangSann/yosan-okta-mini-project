import { createSlice } from "@reduxjs/toolkit";

interface userSlice {
  user: object;
}

const initialState: userSlice = {
  user: {
    nama: "",
  },
};

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export default userSlice.reducer;
export const { setUser } = userSlice.actions;
