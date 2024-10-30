import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { postComment } from "../../stores/threadSlice";
import "./index.css"; // Import component-specific CSS

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  TextField,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface AddCommentProps {
  threadId?: string;
}

const AddComment: React.FC<AddCommentProps> = ({ threadId }) => {
  const dispatch = useAppDispatch();
  const { currentUser, loading, error } = useAppSelector(
    (state) => state.users
  );
  const [content, setContent] = useState("");

  // useEffect(() => {

  // }, [dispatch]);
  const submitComment = () => {
    console.log("I dont knwo");
    dispatch(postComment({ threadId, content }));
  };

  const changeHandler = (e: any) => {
    setContent(e.target.value);
  };

  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Add Comments
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            id="standard-basic"
            label="Input Comment here"
            variant="standard"
            onChange={changeHandler}
          />
        </AccordionDetails>
        <Button type="submit" onClick={submitComment}>
          Submit Comment
        </Button>
      </Accordion>
    </div>
  );
};

export default AddComment;
