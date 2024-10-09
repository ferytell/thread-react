import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchCurrentUser } from "../../stores/userSlice";
import "./index.css"; // Import component-specific CSS

const CurrentUser: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentUser, loading, error } = useAppSelector(
    (state) => state.users
  );

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  if (loading) {
    return <p>Loading user information...</p>;
  }

  if (error) {
    return <p className="error">Error: {error}</p>;
  }

  if (!currentUser) {
    return <p>No user information available.</p>;
  }

  return (
    <div className="current-user-container">
      <h2>My Profile</h2>
      <div className="user-card">
        <img
          src={currentUser.avatar}
          alt={`${currentUser.name}'s avatar`}
          className="avatar"
        />
        <div className="user-details">
          <p>
            <strong>ID:</strong> {currentUser.id}
          </p>
          <p>
            <strong>Name:</strong> {currentUser.name}
          </p>
          <p>
            <strong>Email:</strong> {currentUser.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrentUser;
