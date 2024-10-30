import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  downvoteThread,
  fetchThreadById,
  neutralvoteThread,
  resetCommentSuccess,
  upvoteThread,
} from "../../stores/threadSlice"; // Assuming you will create this slice
import { RootState } from "../../stores";
import { AppDispatch } from "../../stores";
import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Chip,
  Tooltip,
  IconButton,
} from "@mui/material";
import "./index.css";
import AddComment from "../add-comment";
import {
  Tag,
  SentimentSatisfied,
  SentimentVerySatisfied,
  MoodBad,
} from "@mui/icons-material";
import parse from "html-react-parser";
import Comments from "../comments";

const ThreadDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { thread, loading, commentSuccess } = useSelector(
    (state: RootState) => state.thread
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchThreadById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (commentSuccess && id) {
      dispatch(fetchThreadById(id));
      dispatch(resetCommentSuccess()); // Reset the success flag
    }
  }, [commentSuccess, dispatch, id]);

  const upvoteCommentAct = () => {
    console.log("I dont knwo");
    dispatch(upvoteThread({ threadId: id }));
  };
  const neutralvoteComment = () => {
    console.log("nettt");
    dispatch(neutralvoteThread({ threadId: id }));
  };
  const downvoteComment = () => {
    console.log("doenVote");
    dispatch(downvoteThread({ threadId: id }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!thread) {
    return <div>Thread not found</div>;
  }
  const {
    title = "",
    body = "",
    owner = "",
    comments = "",
    createdAt = "",
    category = "",
    upVotesBy,
    downVotesBy,
  } = thread?.data?.detailThread || {};
  console.log(
    // thread.data.detailThread,
    "\\=============================",

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
          <img src={owner.avatar} alt="user" className="imageProfile"></img>
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
          <Typography variant="body2">{parse(body)}</Typography>
          <AddComment threadId={id} />
          <Comments items={comments} threadId={id} />
        </CardContent>
        <CardActions sx={{ display: "flex", flexDirection: "column" }}>
          {/* <Button size="small">add Comments</Button> */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Tooltip title="This is Good">
              <IconButton onClick={upvoteCommentAct} size="small">
                <SentimentVerySatisfied fontSize="large" />
              </IconButton>
            </Tooltip>
            <Typography variant="caption">{upVotesBy.length}</Typography>
          </div>

          <Tooltip title="This is Mid">
            <IconButton onClick={neutralvoteComment} size="small">
              <SentimentSatisfied fontSize="large" />
            </IconButton>
          </Tooltip>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Tooltip title="This is Bad">
              <IconButton onClick={downvoteComment} size="small">
                <MoodBad fontSize="large" />
              </IconButton>
            </Tooltip>
            <Typography variant="caption">{downVotesBy.length}</Typography>
          </div>
        </CardActions>
      </Card>
    </div>
  );
};

export default ThreadDetail;
