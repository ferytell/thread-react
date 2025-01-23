/*
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../hooks";
import { createThread } from "../../stores/threadSlice";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import "./index.css"; // Import component-specific CSS

interface CreateThreadFormInputs {
  title: string;
  body: string;
}

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .max(100, "Title cannot exceed 100 characters"),
  body: Yup.string()
    .required("Body is required")
    .max(5000, "Body cannot exceed 5000 characters"),
});

const CreateThread: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.thread);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateThreadFormInputs>({
    resolver: yupResolver(validationSchema),
  });

  const [isi, setIsi] = useState("");
  const [bodyError, setBodyError] = useState<string | null>(null);

  useEffect(() => {
    setValue("body", isi); // Update the 'body' form field whenever 'isi' changes
  }, [isi, setValue]);

  const onSubmit = async (data: CreateThreadFormInputs) => {
    try {
      const resultAction = await dispatch(createThread(data));
      if (createThread.fulfilled.match(resultAction)) {
        reset(); // Reset the form
        setIsi(""); // Reset ReactQuill content
        navigate(`/`);
      }
    } catch (err) {
      console.error("Failed to create thread:", err);
    }
  };

  return (
    <div className="container">
      <div className="create-thread-form">
        <h1>Create New Thread</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Title</label>
            <input type="text" {...register("title")} />
            {errors.title && <p className="error">{errors.title.message}</p>}
          </div>
          <div className="form-group">
            <label>Body</label>
            <ReactQuill
              style={{
                backgroundColor: "white",
                color: "black",
                padding: "0px",
              }}
              value={isi}
              onChange={(content) => {
                setIsi(content);
                setBodyError(null); // Clear error when user types
              }}
              modules={{ toolbar: [["bold", "italic", "underline", "strike"]] }}
            />
            {errors.body && <p className="error">{errors.body.message}</p>}
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Thread"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateThread;
*/

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../hooks";
import { createThread } from "../../stores/threadSlice";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
} from "@mui/material";

interface CreateThreadFormInputs {
  title: string;
  body: string;
}

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .max(100, "Title cannot exceed 100 characters"),
  body: Yup.string()
    .required("Body is required")
    .max(5000, "Body cannot exceed 5000 characters"),
});

const CreateThread: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.thread);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateThreadFormInputs>({
    resolver: yupResolver(validationSchema),
  });

  const [isi, setIsi] = useState("");
  const [bodyError, setBodyError] = useState<string | null>(null);
  const [open, setOpen] = useState(false); // Modal open/close state

  useEffect(() => {
    setValue("body", isi); // Update the 'body' form field whenever 'isi' changes
  }, [isi, setValue]);

  console.log(bodyError);

  const onSubmit = async (data: CreateThreadFormInputs) => {
    try {
      const resultAction = await dispatch(createThread(data));
      if (createThread.fulfilled.match(resultAction)) {
        reset(); // Reset the form
        setIsi(""); // Reset ReactQuill content
        setOpen(false); // Close the modal
        navigate(`/`);
      }
    } catch (err) {
      console.error("Failed to create thread:", err);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      {/* Button to open modal */}
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Create New Thread
      </Button>

      {/* Modal/Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Create New Thread</DialogTitle>
        <DialogContent>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <TextField
                fullWidth
                label="Title"
                variant="outlined"
                {...register("title")}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </div>
            <div className="form-group" style={{ marginTop: "16px" }}>
              <label>Body</label>
              <ReactQuill
                style={{
                  backgroundColor: "white",
                  color: "black",
                  marginTop: "8px",
                }}
                value={isi}
                onChange={(content) => {
                  setIsi(content);
                  setBodyError(null); // Clear error when user types
                }}
                modules={{
                  toolbar: [["bold", "italic", "underline", "strike"]],
                }}
              />
              {errors.body && <p className="error">{errors.body.message}</p>}
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Create Thread"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateThread;
