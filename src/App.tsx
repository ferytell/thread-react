import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import ThreadList from "./components/thread-list";
import ThreadDetail from "./components/thread-details";
import Login from "./components/login";
import Register from "./components/register";
import "./App.css";

import Navbar from "./components/navbar";
import PrivateRoute from "./components/PrivateRoute";
import UserList from "./components/user-list";
import { RootState } from "./stores";
import { useSelector } from "react-redux";
import CurrentUser from "./components/current-user";
import CreateThread from "./components/create-thread";

function App() {
  const token = useSelector((state: RootState) => state.auth.token);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ThreadList />} />
        <Route path="/thread/:id" element={<ThreadDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/users"
          element={token ? <UserList /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/me"
          element={token ? <CurrentUser /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/create-thread"
          element={token ? <CreateThread /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
