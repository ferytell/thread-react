import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchThreads, Threads } from "../../stores/threadSlice"; // Assuming you will create this slice later
import { RootState } from "../../stores";
import { AppDispatch } from "../../stores";
import "./index.css";

const ThreadList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { threads, loading } = useSelector((state: RootState) => state.thread);

  useEffect(() => {
    dispatch(fetchThreads());
  }, [dispatch]);

  console.log("data retrived==", threads);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Threads</h1>
      <Link to="/create-thread">Create New Thread</Link>
      <div className="thread-list">
        {threads.map((thread: Threads) => (
          <div key={thread.id} className="thread-item">
            <Link to={`/thread/${thread.id}`}>
              <h2>{thread.title}</h2>
              {thread.body && <p>{stripHtml(thread.body).slice(0, 100)}...</p>}
              <div className="thread-meta">
                <span>By: {thread.ownerId}</span> |{" "}
                <span>Comments: {thread.totalComments}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
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
