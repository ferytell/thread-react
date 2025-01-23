import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchThreads,
  createThread,
  fetchThreadById,
  EnhancedThread,
} from "../../stores/threadSlice"; // Assuming you will create this slice later
import { RootState } from "../../stores";
import { AppDispatch } from "../../stores";
import "./index.css";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Typography,
} from "@mui/material";
import * as Yup from "yup";
import { formatDistanceToNow, isValid } from "date-fns";
import { fetchCurrentUser } from "../../stores/userSlice";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppSelector } from "../hooks";
import ReactQuill from "react-quill";

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

const ThreadList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  //const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentUser, loading: userLoading } = useSelector(
    (state: RootState) => state.users
  );
  const { loading: newThreadLoading } = useSelector(
    (state: RootState) => state.thread
  );

  // const {
  //   thread,
  // loading: threadLoading,
  // commentSuccess,
  // } = useSelector((state: RootState) => state.thread);
  const token = useSelector((state: RootState) => state.auth.token);
  const [isi, setIsi] = useState("");
  //const [bodyError, setBodyError] = useState<string | null>(null);
  const [open, setOpen] = useState(false); // Modal open/close state
  const [enhancedThreads, setEnhancedThreads] = useState<EnhancedThread[]>([]);
  //const { owner = "" } = thread?.data?.detailThread || {};

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateThreadFormInputs>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    setValue("body", isi); // Update the 'body' form field whenever 'isi' changes
  }, [isi, setValue]);

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

  useEffect(() => {
    dispatch(fetchThreads());
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token]);

  useEffect(() => {
    const fetchThreadsWithOwners = async () => {
      try {
        const threadsResponse = await dispatch(fetchThreads());
        const threads = threadsResponse.payload;
        const threadsWithOwners = await Promise.all(
          threads.map(async (thread: EnhancedThread) => {
            try {
              const fullThread = await dispatch(fetchThreadById(thread.id));
              const owner = fullThread.payload.data.detailThread.owner.name;
              return { ...thread, owner };
            } catch (err) {
              console.error(
                `Failed to fetch owner for thread ${thread.id}`,
                err
              );
              return { ...thread, owner: null };
            }
          })
        );

        setEnhancedThreads(threadsWithOwners); // Save threads with owner data to state
      } catch (error) {
        console.error("Failed to fetch threads with owners", error);
      }
    };

    fetchThreadsWithOwners();
  }, [dispatch]);

  useEffect(() => {
    if (currentUser && !userLoading) {
      // Store current user's name in localStorage after it is loaded
      try {
        localStorage.setItem("userName", currentUser.name);
        localStorage.setItem("avatar", currentUser.avatar);
        localStorage.setItem("id", currentUser.id);
      } catch (error) {
        console.error("Error storing user details in localStorage", error);
      }
    }
  }, [currentUser, userLoading]);

  const { loading, error } = useAppSelector((state) => state.thread);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const formattedDate = (createdAt: string | undefined) => {
    if (!createdAt) return "Unknown time"; // Handle missing values
    const date = new Date(createdAt);
    return isValid(date) ? formatDistanceToNow(date) + " ago" : "Invalid time";
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Threads</h1>

      {token ? (
        <div className="button-create">
          <Button
            variant="contained"
            color="primary"
            startIcon={<HistoryEduIcon />}
            className="button-create"
            onClick={handleOpen}
          >
            New{" "}
          </Button>
        </div>
      ) : (
        <div></div>
      )}

      <div className="thread-list">
        {enhancedThreads.map((thread: EnhancedThread) => (
          <div key={thread.id} className="thread-item">
            <Link to={`/thread/${thread.id}`}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <h2>{thread.title}</h2>
                <Typography variant="body2" color="textSecondary" ml={1}>
                  • {formattedDate(thread.createdAt)} ago
                </Typography>
              </div>
              {thread.body && (
                <Typography>
                  {stripHtml(thread.body).slice(0, 100)}...
                </Typography>
              )}
              <div className="thread-meta">
                <span>By: {thread.owner || "Unknown"}</span> |{" "}
                {/* it easyer for backend to change it to name than I create memo */}
                <span>Comments: {thread.totalComments}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>

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
                  // setBodyError(null);
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
            disabled={newThreadLoading}
          >
            {newThreadLoading ? (
              <CircularProgress size={24} />
            ) : (
              "Create Thread"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

// Utility function to strip HTML tags from the thread body
const stripHtml = (html: string): string => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

export default ThreadList;
