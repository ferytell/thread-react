import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchUsers } from "../../stores/userSlice";
import "./index.css"; // Import component-specific CSS

const UserList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector((state: any) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p className="error">Error: {error}</p>;
  }

  return (
    <div className="user-list-container">
      <h2>All Users</h2>
      <ul className="user-list">
        {users.map((user: any) => (
          <li key={user.id} className="user-item">
            <img
              src={user.avatar}
              alt={`${user.name}'s avatar`}
              className="avatar"
            />
            <div className="user-info">
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
