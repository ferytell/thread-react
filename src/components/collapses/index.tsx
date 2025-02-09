import { CaretDownOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import React, { useState } from "react";
import "./Collapse.css";

interface CollapseProps {
  header: React.ReactNode; // Content for the header
  children: React.ReactNode; // Content to collapse
  defaultActive?: boolean; // Whether the collapse is open by default
}

const Collapses: React.FC<CollapseProps> = ({
  header,
  children,
  defaultActive = false,
}) => {
  const [isActive, setIsActive] = useState(defaultActive);

  const toggleCollapse = () => {
    setIsActive((prev) => !prev);
  };

  return (
    <div>
      <div
        onClick={toggleCollapse}
        style={{
          cursor: "pointer",
          padding: "10px",
          //   backgroundColor: "#f0f0f0",
          //   border: "1px solid #ddd",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
        }}
      >
        <CaretDownOutlined
          className="collapse-icon"
          style={{
            transform: `rotate(${isActive ? 180 : 0}deg)`,
            fontSize: "150%",
          }}
        />
        <div>{header}</div>
      </div>
      <div className={`collapse-content ${isActive ? "active" : ""}`}>
        {children}
      </div>
    </div>
  );
};

export default Collapses;
