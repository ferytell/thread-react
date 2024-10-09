import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token"), // Initialize with token from localStorage
  loading: false,
  error: null,
};

export const login = createAsyncThunk<
  string, // Return type (token)
  { email: string; password: string }, // Argument type
  { rejectValue: string } // ThunkAPI type for reject
>("auth/login", async (credentials, thunkAPI) => {
  try {
    const response = await api.post("/login", credentials);
    const token = response.data.data.token;
    // Save token to localStorage
    console.log(token, "=====d=f=d=fd");
    localStorage.setItem("token", token);
    return token;
  } catch (error: any) {
    // Extract error message
    const message = error.response?.data?.message || "Failed to login";
    return thunkAPI.rejectWithValue(message);
  }
});

// Async thunk for user registration
export const register = createAsyncThunk<
  string, // Return type (token)
  { name: string; email: string; password: string }, // Argument type
  { rejectValue: string } // ThunkAPI type for reject
>("auth/register", async (userData, thunkAPI) => {
  try {
    const response = await api.post("/register", userData);
    const token = response.data.data.token;
    // Save token to localStorage
    localStorage.setItem("token", token);
    return token;
  } catch (error: any) {
    // Extract error message
    const message = error.response?.data?.message || "Failed to register";
    return thunkAPI.rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Optional: Define a logout action
    logout(state) {
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    // Handle login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload; // Set the token
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to login";
      });

    // Handle register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload; // Set the token
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to register";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
