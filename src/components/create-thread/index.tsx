import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../hooks";
import { createThread } from "../../stores/threadSlice";
import { useNavigate } from "react-router-dom";
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
    formState: { errors },
  } = useForm<CreateThreadFormInputs>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: CreateThreadFormInputs) => {
    try {
      const resultAction = await dispatch(createThread(data));
      if (createThread.fulfilled.match(resultAction)) {
        reset(); // Reset the form
        navigate(`/thread/${resultAction.payload.id}`); // Navigate to the new thread's detail page
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
            <textarea {...register("body")} rows={10}></textarea>
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
