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
import { AppDispatch, RootState } from "../../stores";

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
import { formatDistanceToNow, isValid } from "date-fns";

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

  //useDispatch

  const upvoteCommentAct = () => {
    dispatch(upvoteThread({ threadId: id }));
  };
  const neutralvoteComment = () => {
    dispatch(neutralvoteThread({ threadId: id }));
  };
  const downvoteComment = () => {
    dispatch(downvoteThread({ threadId: id }));
  };

  const formattedDate = (createdAt: string | undefined) => {
    if (!createdAt) return "Unknown time"; // Handle missing values
    const date = new Date(createdAt);
    return isValid(date) ? formatDistanceToNow(date) + " ago" : "Invalid time";
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

  return (
    <div className="container">
      <Typography component="div">By: {owner.name}</Typography>
      <h2>Comments</h2>
      <ul></ul>
      <Card sx={{ display: "flex", flexDirection: "row" }}>
        <div className="imgageContainer">
          <img src={owner.avatar} alt="user" className="imageProfile"></img>

          <Typography
            component="div"
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
            component="div"
            variant="body2"
            color="textSecondary"
            ml={1}
          >
            {formattedDate(createdAt)} ago
          </Typography>
          <Typography variant="h5" component="div">
            {title}
          </Typography>

          <Chip
            sx={{ paddingX: "8px", paddingY: "14px" }}
            icon={<Tag sx={{ fontSize: 14 }} />}
            label={category}
          />
          <Typography component="div" variant="body2">
            {parse(body)}
          </Typography>
          <AddComment threadId={id} />
          <Comments items={comments} threadId={id} />
        </CardContent>
        <CardActions sx={{ display: "flex", flexDirection: "column" }}>
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
            <Typography component="div" variant="caption">
              {upVotesBy?.length}
            </Typography>
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
            <Typography component="div" variant="caption">
              {downVotesBy?.length}
            </Typography>
          </div>
        </CardActions>
      </Card>
    </div>
  );
};

export default ThreadDetail;
