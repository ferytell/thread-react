import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchCurrentUser } from "../../stores/userSlice";
import "./index.css"; // Import component-specific CSS
import Button from "@mui/material/Button";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const AddComment: React.FC = () => {
  // const dispatch = useAppDispatch();
  // const { currentUser, loading, error } = useAppSelector(
  //   (state) => state.users
  // )

  // useEffect(() => {
  //   dispatch(fetchCurrentUser());
  // }, [dispatch]);

  // if (loading) {
  //   return <p>Loading user information...</p>;
  // }

  // if (error) {
  //   return <p className="error">Error: {error}</p>;
  // }

  // if (!currentUser) {
  //   return <p>No user information available.</p>;
  // }

  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Comments
        </AccordionSummary>
        <AccordionDetails>
          <TextField id="standard-basic" label="Standard" variant="standard" />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default AddComment;
