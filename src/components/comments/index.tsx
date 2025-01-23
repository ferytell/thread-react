import React, { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import parse from "html-react-parser";
import { formatDistanceToNow } from "date-fns";
import "./index.css"; // Import component-specific CSS
import { useAppDispatch } from "../hooks";
import { downVoteComment, upVoteComment } from "../../stores/threadSlice";

// import {
//   Accordion,
//   AccordionDetails,
//   AccordionSummary,
//   TextField,
//   Button,
// } from "@mui/material";
//import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import { useAppDispatch } from "../hooks";

interface CommentsProps {
  items: Comment[];
  threadId?: string;
}

interface Comment {
  content: string;
  createdAt: string;
  downVotesBy: DownVotesBy[];
  id: string;
  owner: Owner;
  upVotesBy: DownVotesBy[];
}

interface Owner {
  avatar: string;
  name: string;
  id: string;
}

interface DownVotesBy {
  id: string;
}

const Comments: React.FC<CommentsProps> = ({ items, threadId }) => {
  const dispatch = useAppDispatch();
  const [showReply] = useState(false);

  const upvoteCommentAct = (commentId: string) => {
    dispatch(upVoteComment({ threadId, commentId }));
  };
  const downvoteCommentAct = (commentId: string) => {
    dispatch(downVoteComment({ threadId, commentId }));
  };

  const Content: React.FC<CommentsProps> = ({ items }) => {
    return (
      <>
        {items.map((comment, index) => (
          <React.Fragment key={comment.id}>
            <Box display="flex" alignItems="center">
              <Avatar
                src={comment.owner.avatar}
                sx={{ margin: "8px" }}
                alt="testing jee"
              />
              <Typography variant="subtitle1" fontWeight="bold">
                {comment.owner.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" ml={1}>
                • {formatDistanceToNow(new Date(comment.createdAt))} ago
              </Typography>
            </Box>
            <Typography
              variant="body1"
              mt={1}
              sx={{ marginInlineStart: "50px" }}
            >
              {parse(comment.content)}
            </Typography>
            {/* ----======================================================================---- */}
            <Stack direction="row" spacing={1} mt={1}>
              <Typography variant="caption">
                {comment.upVotesBy.length}
              </Typography>
              <Tooltip title="Upvote">
                <IconButton
                  onClick={() => upvoteCommentAct(comment.id)}
                  size="small"
                >
                  <ThumbUpAltOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Typography variant="caption">
                {comment.downVotesBy.length}
              </Typography>
              <Tooltip title="Downvote">
                <IconButton
                  onClick={() => downvoteCommentAct(comment.id)}
                  size="small"
                >
                  <ThumbDownAltOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </React.Fragment>
        ))}
      </>
    );
  };

  return (
    <Box display="flex" mb={3}>
      <Box ml={2} flex="1">
        {items.length > 0 ? <Content items={items} /> : <div></div>}

        {showReply && (
          <Box mt={2} ml={4}>
            {/* <AddComment threadId={threadId} parentId={comment.id} /> */}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Comments;
