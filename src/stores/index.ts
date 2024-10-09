import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import threadReducer from "./threadSlice";
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    thread: threadReducer,
    users: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
