import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../../stores";
import { useAppDispatch } from "../hooks";
import { useSelector } from "react-redux";
import { logout } from "../../stores/authSlice";
import reactLogo from "../../assets/img/react.svg";
import Button from "@mui/material/Button";
import PersonIcon from "@mui/icons-material/Person";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import "./index.css"; // Optional: Create and style the navbar

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    // Optionally, navigate to home or login page
  };

  const handleProfile = () => {
    navigate("/users");
  };

  const handleMyProfile = () => {
    navigate("/me");
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="leftside">
          <img src={reactLogo} className="logo" alt="Vite logo" />
          <Link to="/" className="navbar-brand">
            Dicoding Forum
          </Link>
        </div>

        <div className="navbar-links">
          {token ? (
            <>
              <Button
                variant="contained"
                onClick={handleClick}
                className="btn btn-logout"
              >
                <PersonIcon /> User
              </Button>

              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                <MenuItem onClick={handleMyProfile}>My account</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-login">
                Login
              </Link>
              <Link to="/register" className="btn btn-register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
