import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

interface ThreadState {
  threads: Threads[];
  thread: any | null;
  loading: boolean;
  error: string | null;
  commentSuccess: boolean;
}

const initialState: ThreadState = {
  threads: [],
  thread: null,
  loading: false,
  error: null,
  commentSuccess: false,
};

export interface Threads {
  body: string;
  category: string;
  createdAt: string;
  downVotesBy: string[];
  id: string;
  ownerId: string;
  title: string;
  totalComments: number;
  upVotesBy: string[];
}

// Async thunk for fetching threads
export const fetchThreads = createAsyncThunk(
  "threads/fetchThreads",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/threads");
      return response.data.data.threads;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Async thunk for fetching a single thread by ID
export const fetchThreadById = createAsyncThunk(
  "threads/fetchThreadById",
  async (id: string, thunkAPI) => {
    try {
      const response = await api.get(`/threads/${id}`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Async thunk for creating a thread
export const createThread = createAsyncThunk<
  Threads, // Return type
  { title: string; body: string }, // Argument type
  { rejectValue: string } // ThunkAPI type for reject
>("threads/createThread", async (threadData, thunkAPI) => {
  try {
    const response = await api.post("/threads", threadData);
    return response.data.data.thread; // Ensure this path is correct
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to create thread";
    return thunkAPI.rejectWithValue(message);
  }
});

// Async thunk for posting a comment
export const postComment = createAsyncThunk(
  "threads/postComment",
  async (
    { threadId, content }: { threadId: string | undefined; content: string },
    thunkAPI
  ) => {
    try {
      const response = await api.post(`/threads/${threadId}/comments`, {
        content,
      });

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Async thunk for upvote a thread
export const upvoteThread = createAsyncThunk(
  "threads/upvoteThread",
  async ({ threadId }: { threadId: string | undefined }, thunkAPI) => {
    try {
      const response = await api.post(`/threads/${threadId}/up-vote`, {});
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const downvoteThread = createAsyncThunk(
  "threads/downvoteThread",
  async ({ threadId }: { threadId: string | undefined }, thunkAPI) => {
    try {
      const response = await api.post(`/threads/${threadId}/down-vote`, {});
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const neutralvoteThread = createAsyncThunk(
  "threads/neutralvoteThread",
  async ({ threadId }: { threadId: string | undefined }, thunkAPI) => {
    try {
      const response = await api.post(`/threads/${threadId}/neutral-vote`, {});
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const threadSlice = createSlice({
  name: "threads",
  initialState,
  reducers: {
    resetCommentSuccess(state) {
      state.commentSuccess = false;
    },
  },
  extraReducers: (builder) => {
    // Fetching threads
    builder
      .addCase(fetchThreads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.loading = false;
        state.threads = action.payload;
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetching a single thread
    builder
      .addCase(fetchThreadById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThreadById.fulfilled, (state, action) => {
        state.loading = false;
        state.thread = action.payload;
      })
      .addCase(fetchThreadById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Handle createThread**
    builder
      .addCase(createThread.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createThread.fulfilled, (state, action) => {
        state.loading = false;
        state.threads.unshift(action.payload); // Add the new thread to the top
        state.thread = action.payload; // Optionally set the current thread
      })
      .addCase(createThread.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create thread";
      });

    // Posting a comment
    builder
      .addCase(postComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postComment.fulfilled, (state, action) => {
        state.loading = false;
        if (state.thread) {
          console.log("call this== add comments");
          if (!state.thread.comments) {
            state.thread.comments = []; // Initialize comments if undefined
          }
          state.thread.comments.push(action.payload);
        }
        state.commentSuccess = true;
      })
      .addCase(postComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Async thunk for upvote a comment
    builder
      .addCase(upvoteThread.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(upvoteThread.fulfilled, (state, action) => {
        state.loading = false;
        if (state.thread) {
          console.log("call this== upvote comments");
          if (!state.thread.comments) {
            state.thread.comments = [];
          }
          state.thread.comments.push(action.payload);
        }
      })
      .addCase(upvoteThread.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(downvoteThread.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downvoteThread.fulfilled, (state, action) => {
        state.loading = false;
        if (state.thread) {
          if (!state.thread.comments) {
            state.thread.comments = [];
          }
          state.thread.comments.push(action.payload);
        }
      })
      .addCase(downvoteThread.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(neutralvoteThread.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(neutralvoteThread.fulfilled, (state, action) => {
        state.loading = false;
        if (state.thread) {
          if (!state.thread.comments) {
            state.thread.comments = [];
          }
          state.thread.comments.push(action.payload);
        }
      })
      .addCase(neutralvoteThread.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetCommentSuccess } = threadSlice.actions;
export default threadSlice.reducer;
