import React, { useState, useEffect, useRef } from "react";
import parse from "html-react-parser";
import "react-quill/dist/quill.core.css";
import { useLocation, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";

import "./style.css";

import like_before from "../../assets/like-before.png";
import like_after from "../../assets/like-after.png";
import comment from "../../assets/comment.png";
import {
  likePost,
  dislikePost,
  addComment,
  getComments,
} from "../../api/FeedApi";
import { Comment } from "../../components/feedView/Comment";
import { Loading } from "../../components/common/Loading";

import { io } from "socket.io-client";
import { elapsedTimePeriod } from "../../utils";

export const FeedView = () => {
  const { postId } = useParams();

  const { state } = useLocation();
  const { postUser, user_id, caption, title, createdAt } = state;
  let { likes } = state;

  const [value, setValue] = useState("");
  const [like, setLike] = useState({
    liked: false,
    liked_num: likes.liked_num,
  });

  const { isLoading, data, refetch } = useQuery(
    ["comments", postId],
    () => {
      return getComments(postId);
    },
    {
      onSuccess: () => {
        console.log(data);
      },
    }
  );

  const textareaRef = useRef(null);

  useEffect(() => {
    // if (likes.liked_user) {
    //   setLike((prev) => ({ ...prev, liked: true }));
    // }

    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${Math.max(
        textareaRef.current.scrollHeight,
        47
      )}px`;
    }

    return () => {};
  }, [value]);

  const handleLike = async () => {
    if (!like.liked) {
      likePost(postId)
        .then((res) => {
          if (res.data === "like updated") {
            setLike({ liked: true, liked_num: like.liked_num + 1 });
          }
        })
        .catch((err) => console.log(err));
    } else {
      dislikePost(postId).then((res) => {
        if (res.data === "like updated") {
          setLike({ liked: false, liked_num: like.liked_num - 1 });
        }
      });
    }
  };

  const onClickWriteComment = async () => {
    await addComment(postId, value);
    refetch();
    setValue("");
  };

  const [socketValue, setSocketValue] = useState(null);

  useEffect(() => {
    const socket = io("http://localhost:4000/comment");
    setSocketValue(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log(socketValue);
    if (socketValue && postId) {
      socketValue.emit("join", postId);
      socketValue.on("getNotification", (arg) => {
        console.log(arg);
      });
    }
    console.log("Getting Socket Data");
  }, [socketValue]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="feedview-wrapper">
      <div className="feedview-content">
        <div className="feedview-header">
          <img
            className="feedview-header-img"
            src={postUser.profile_pic}
            alt="profile picture"
          />
          <div className="feedview-header-name">
            <p>{postUser.username}</p>
            <h2>{title}</h2>
          </div>
          <span className="feedview-header-date">
            {elapsedTimePeriod(createdAt)}
          </span>
        </div>
        {/* Content */}
        <div className="ql-editor">{parse(caption)}</div>
        {/* INFO */}
        <div className="feedview-menus">
          <div className="feedview-menu">
            <h4>댓글 {data.length}개</h4>
            <img src={comment} />
          </div>
          <div className="feedview-menu">
            <h4>좋아요 {like.liked_num}개</h4>
            {like.liked ? (
              <img src={like_after} onClick={handleLike} />
            ) : (
              <img src={like_before} onClick={handleLike} />
            )}
          </div>
        </div>
        <div className="feedview-comment">
          <h4>댓글 쓰기</h4>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            placeholder="매너있는 댓글 작성 부탁드립니다."
          />
          <div style={{ textAlign: "right" }}>
            <button
              className="feedview-comment-btn"
              onClick={onClickWriteComment}
            >
              완료
            </button>
          </div>
        </div>
      </div>
      <div className="commenter">댓글들</div>
      <div className="comment_list">
        {data?.map((comment, index) => (
          <Comment
            key={comment._id}
            index={index}
            comment_id={comment._id}
            user_id={user_id}
            writer={comment.user}
            caption={comment.context}
            liked_user={comment.liked_user}
            liked_num={comment.liked_num}
            replies={comment.reply}
            refetchComments={refetch}
            updatedAt={comment.updatedAt}
            postId={postId}
          />
        ))}
      </div>
      {data.length === 0 && (
        <div className="comment_list_blank">
          <h3>현재 작성된 댓글이 없습니다. 가장 먼저 댓글을 작성해주세요.</h3>
        </div>
      )}
    </div>
  );
};
