import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

// Define TypeScript interfaces for User and UserState
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface UsersResponse {
  status: string;
  message: string;
  data: {
    users: User[];
  };
}

interface CurrentUserResponse {
  status: string;
  message: string;
  data: {
    user: User;
  };
}

interface UserState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: UserState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
};

// Async thunk to fetch all users
export const fetchUsers = createAsyncThunk<
  User[], // Return type
  void, // Argument type
  { rejectValue: string } // ThunkAPI type for reject
>("users/fetchUsers", async (_, thunkAPI) => {
  try {
    const response = await api.get<UsersResponse>("/users");
    if (response.data.status !== "success") {
      return thunkAPI.rejectWithValue(response.data.message);
    }
    return response.data.data.users;
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to fetch users";
    return thunkAPI.rejectWithValue(message);
  }
});

// Async thunk to fetch current user
export const fetchCurrentUser = createAsyncThunk<
  User, // Return type
  void, // Argument type
  { rejectValue: string }
>("users/fetchCurrentUser", async (_, thunkAPI) => {
  try {
    const response = await api.get<CurrentUserResponse>("/users/me");
    if (response.data.status !== "success") {
      return thunkAPI.rejectWithValue(response.data.message);
    }
    return response.data.data.user;
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Failed to fetch current user";
    return thunkAPI.rejectWithValue(message);
  }
});

// Create the user slice
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    // Optional: Define synchronous actions here if needed
  },
  extraReducers: (builder) => {
    // Handle fetchUsers
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
      });

    // Handle fetchCurrentUser
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch current user";
      });
  },
});

export default userSlice.reducer;
