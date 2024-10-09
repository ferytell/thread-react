import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../stores";
import reactLogo from "../../assets/img/react.svg";
import Button from "@mui/material/Button";
import "./index.css";

const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="headerContainer">
      <div className="trademark">
        <img src={reactLogo} className="logo" alt="Vite logo" />
        <h1>Header</h1>
      </div>

      <div>
        <nav>
          <div>
            <Link to="/notes">notes</Link>
          </div>
          <div>
            <Link to="/arsip">arc</Link>
          </div>
        </nav>
      </div>
      <div>
        <Button
          variant="contained"
          className="butttonLogout"
          onClick={toggleMenu}
        >
          Profile
        </Button>

        {isMenuOpen && (
          <div className="dropdown-menu">
            <button className="">Profile</button>

            <button className="">logout</button>
            <button
              className=""
              style={{ color: "red" }}
              onClick={() => setIsMenuOpen(false)}
            >
              close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
