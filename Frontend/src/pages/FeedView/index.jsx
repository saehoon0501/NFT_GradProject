import React, { useState, useEffect, useRef } from "react";
import { Button } from "@mui/material";
import parse from "html-react-parser";
import "react-quill/dist/quill.core.css";
import { useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import "./style.css";

import like_before from "../../assets/like-before.png";
import like_after from "../../assets/like-after.png";
import comment from "../../assets/comment.png";
import {
  likePost,
  dislikePost,
  addComment,
  getComment,
} from "../../api/FeedApi";
import { Comment } from "../../components/feedView/Comment";

export const FeedView = () => {
  const { state } = useLocation();
  const { post_id, writer_profile, user_id, caption, title} = state;
  let { likes } = state;

  const [value, setValue] = useState("");
  const [like, setLike] = useState({
    liked: false,
    liked_user: likes.liked_user,
  });

  const queryClient = useQueryClient();

  const { isLoading, data } = useQuery(
    ["comments", post_id],
    () => getComment(post_id),
    {
      onSuccess: () => {
        console.log(data);
      },
    }
  );

  const commentMutate = useMutation(["comments", post_id], addComment, {
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", post_id]);
    },
  });

  const textareaRef = useRef(null);

  useEffect(() => {
    if (like.liked_user.includes(user_id) && like.liked === false) {
      setLike((prev) => ({ ...prev, liked: true }));
    }

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
      likePost(post_id, likes)
        .then((res) => {
          likes = res.data;
          if (likes.liked_user.includes(user_id)) {
            setLike({ liked: true, liked_user: likes.liked_user });
          }
        })
        .catch((err) => console.log(err));
    } else {
      dislikePost(post_id, likes).then((res) => {
        likes = res.data;
        setLike({ liked: false, liked_user: likes.liked_user });
      });
    }
  };

  const handleComment = (event) => {
    console.log(value);
    const para = {
      post_id,
      value,
    };
    commentMutate.mutate(para);
    setValue("");
  };

  if (isLoading) {
    return (
      <div>
        <p>is Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div
        className="feedview"
        style={{
          display: "block",
          border: "1px solid lightgray",
          borderRadius: "5px",
        }}
      >
        <div className="" style={{ width: "500px" }}>
          <div className="feedview_header" style={{ display: "block" }}>
            <div style={{ display: "flex" }}>
              <div className="feed_avatar">
                <img
                  src={writer_profile.profile_pic}
                  alt="profile picture"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                  }}
                />
              </div>
              <div
                style={{
                  position: "relative",
                  marginLeft: "5px",
                  display: "flex",
                  marginTop: "10px",
                }}
              >
                <div>
                  <h3>{writer_profile.username}</h3>
                </div>
                <div className="post__text">
                  <span>n일 전</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ maxWidth: "700px", width: "700px" }}>
            {/* Title */}
            <div
              style={{
                textAlign: "left",
                padding: "10px 10px 10px 80px",
                position: "relative",
                marginTop: "-40px",
              }}
            >
              <h2 style={{ lineHeight: "22px" }}>{title}</h2>
            </div>
            {/* Content */}
            <div
              className="ql-editor"
              style={{
                textAlign: "left",
                padding: "10px 10px 10px 10px",
                width: "100%",
              }}
            >
              {parse(caption)}
            </div>
          </div>
        </div>
        {/* INFO */}
        <div style={{ display: "flex", padding: "10px 10px 5px 15px" }}>
          <div>
            <h4>댓글 {data.length}개</h4>
          </div>
          <div
            className="clickable"
            style={{ position: "relative", margin: "-3px 5px 0 5px" }}
          >
            <img src={comment} />
          </div>
          <div>
            <h4>좋아요 {like.liked_user.length}개</h4>
          </div>
          {like.liked ? (
            <div
              className="clickable_icon icon_anime2"
              style={{
                position: "relative",
                marginTop: "-3px",
                marginLeft: "10px",
              }}
            >
              <img src={like_after} onClick={handleLike} />
            </div>
          ) : (
            <div
              className="clickable"
              style={{
                position: "relative",
                marginTop: "-3px",
                marginLeft: "10px",
              }}
            >
              <img src={like_before} onClick={handleLike} />
            </div>
          )}
        </div>
        <div className="comment">
          <p>
            <h4>댓글 쓰기</h4>
          </p>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            placeholder="매너있는 댓글 작성 부탁드립니다."
          ></textarea>
          <div style={{ textAlign: "right" }}>
            <Button
              onClick={handleComment}
              sx={{
                backgroundColor: "#26a7de",
                margin: "5px 0px 0px 0px",
                padding: "0 15px",
                color: "white",
              }}
            >
              완료
            </Button>
          </div>
        </div>
      </div>
      <div className="commenter">댓글들</div>
      <div className="comment_list">
        {data?.map((comment, index) => {
          
          return (
            <Comment
              key={comment._id}
              index={index}
              comment_id={comment._id}              
              user_id={user_id}
              writer={comment.user}
              caption={comment.caption}
              liked_user={comment.liked_user}
              replies={comment.replies}
            />
          );
        })}
      </div>
    </div>
  );
};
