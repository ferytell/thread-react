import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchThreadById } from "../../stores/threadSlice"; // Assuming you will create this slice
import { RootState } from "../../stores";
import { AppDispatch } from "../../stores";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Chip,
} from "@mui/material";
import "./index.css";
import AddComment from "../add-comment";
import { Tag } from "@mui/icons-material";

const ThreadDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { thread, loading } = useSelector((state: RootState) => state.thread);

  useEffect(() => {
    if (id) {
      dispatch(fetchThreadById(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!thread) {
    return <div>Thread not found</div>;
  }
  const { title, body, owner, comments, createdAt, category } =
    thread.data.detailThread;
  console.log(
    thread.data.detailThread,
    "\\=============================",
    title,
    body,
    owner,
    comments
  );

  return (
    <div className="container">
      {/* <h1>{thread.data.detailThread}</h1>
      <p>{thread.data}</p> */}
      <p>By: {owner.name}</p>
      <h2>Comments</h2>
      <ul>
        {/* {thread.data.detailThread.map((comment: any) => (
          <li key={comment.id}>
            <p>{comment.body}</p>
            <p>By: {comment.author.name}</p>
          </li>
        ))} */}
      </ul>
      <Card sx={{ display: "flex", flexDirection: "row" }}>
        <div className="imgageContainer">
          <img
            src={owner.avatar}
            alt="Girl in a jacket"
            className="imageProfile"
          ></img>
          {/* <CardMedia
            sx={{ height: 140 }}
            image={owner.avatar}
            title="green iguana"
          /> */}
          <Typography
            gutterBottom
            sx={{
              color: "text.secondary",
              fontSize: 14,
              fontWeight: "bold",
              marginLeft: "25%",
              marginRight: "25%",
            }}
          >
            {owner.name}
          </Typography>
        </div>

        <CardContent>
          <Typography
            gutterBottom
            sx={{ color: "text.secondary", fontSize: 14 }}
          >
            {createdAt}
          </Typography>
          <Typography variant="h5" component="div">
            {title}
          </Typography>
          {/* <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
            adjective
          </Typography> */}
          <Chip
            sx={{ paddingX: "8px", paddingY: "14px" }}
            icon={<Tag sx={{ fontSize: 14 }} />}
            label={category}
          />
          <Typography variant="body2">{body}</Typography>
          <AddComment />
        </CardContent>
        <CardActions>
          {/* <Button size="small">add Comments</Button> */}
        </CardActions>
      </Card>
    </div>
  );
};

export default ThreadDetail;
