// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axiosInstance from "@/api/axiosInstance"; // Adjust this as per your path

// export const fetchSessions = createAsyncThunk(
//   "sessions/fetchSessions",
//   async () => {
//     const response = await axiosInstance.get("https://randomuser.me/api/");
//     return response.data;
//   },
// );

// const sessionSlice = createSlice({
//   name: "sessions",
//   initialState: {
//     sessions: [], // Start with an empty array
//     selectedSessionId: null,
//     status: "idle",
//     error: null,
//   },
//   reducers: {
//     setSelectedSessionId: (state, action) => {
//       state.selectedSessionId = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchSessions.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchSessions.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.sessions = action.payload; // Action payload should be the sessions array
//       })
//       .addCase(fetchSessions.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message;
//       });
//   },
// });

// // Export the correct action
// export const { setSelectedSessionId } = sessionSlice.actions;

// export default sessionSlice.reducer;
