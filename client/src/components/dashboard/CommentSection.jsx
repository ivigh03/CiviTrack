import { useState } from "react";

export default function CommentSection({ comments }) {
  const [text, setText] = useState("");

  return (
    <div className="comments">
      <h3>Comments</h3>

      <div className="comment-list">
        {comments.map((c, i) => (
          <div key={i} className="comment">
            <strong>{c.user}</strong>
            <p>{c.text}</p>
          </div>
        ))}
      </div>

      <div className="comment-input">
        <input
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button>Add</button>
      </div>
    </div>
  );
}