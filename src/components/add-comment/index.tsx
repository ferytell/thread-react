import React, { useState } from "react";
import { useAppDispatch } from "../hooks";
import { postComment } from "../../stores/threadSlice";
import "./index.css"; // Import component-specific CSS

import {
  // Accordion,
  // AccordionDetails,
  // AccordionSummary,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  // DialogTitle,
  // DialogContentText,
  Box,
  Avatar,
  Typography,
} from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import ReactQuill from "react-quill";

interface AddCommentProps {
  threadId?: string;
}

const AddComment: React.FC<AddCommentProps> = ({ threadId }) => {
  const dispatch = useAppDispatch();
  // const { currentUser, loading, error } = useAppSelector(
  //   (state) => state.users
  // );
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

  const avatar = localStorage.getItem("avatar");
  const userName = localStorage.getItem("userName");

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="text" onClick={handleClickOpen}>
        Add Comment
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: submitComment,
        }}
      >
        <DialogContent>
          <Box display="flex" alignItems="center">
            <Avatar
              src={avatar || undefined}
              sx={{ margin: "8px" }}
              alt="testing jee"
            />
            <Typography variant="subtitle1" fontWeight="bold">
              {userName}
            </Typography>
          </Box>
          <TextField
            style={{ minWidth: "550px" }}
            autoFocus
            required
            margin="dense"
            label="put comment here"
            type="text"
            fullWidth
            variant="standard"
            onChange={changeHandler}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={submitComment}>Post Comment</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddComment;
