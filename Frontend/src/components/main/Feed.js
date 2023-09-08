import React, { useState, useEffect } from "react";
import parse from "html-react-parser";
import { useNavigate } from "react-router-dom";

import "./Feed.css";
import like_before from "../../assets/like-before.png";
import like_after from "../../assets/like-after.png";
import comment from "../../assets/comment.png";
import kebab from "../../assets/kebab.png";
import { likePost, dislikePost, delPost } from "../../api/FeedApi";
import { useRecoilState } from "recoil";
import {
  currentPopUpState,
  currentPostIdState,
  showPopUpState,
} from "../../store";
import { DELETE, elapsedTimePeriod } from "../../utils";

const Feed = ({
  post_id,
  user_id,
  postUser,
  user_role,
  caption,
  title,
  comments,
  likes,
  socketValue,
  createdAt,
}) => {
  const [like, setLike] = useState({
    liked: false,
    liked_num: likes.liked_num,
  });
  const [showPopUp, setShowPopUp] = useRecoilState(showPopUpState);
  const [currentPopUp, setCurrentPopUp] = useRecoilState(currentPopUpState);
  const [currentPostId, setCurrentPostId] = useRecoilState(currentPostIdState);

  const navigate = useNavigate();

  useEffect(() => {
    if (likes.liked_user) {
      setLike((prev) => ({ ...prev, liked: true }));
    }
  }, []);

  const handleLike = async () => {
    if (!like.liked) {
      likePost(post_id)
        .then((res) => {
          if (res.data === "like updated") {
            setLike({ liked: true, liked_num: like.liked_num + 1 });
          }
          // socketValue.emit("sendNotification", {
          //   sender: user_publicAddr,
          //   receiver: writer_publicAddr,
          //   type: "like",
          // });
        })
        .catch((err) => console.log(err));
    } else {
      dislikePost(post_id).then((res) => {
        if (res.data === "like updated") {
          setLike({ liked: false, liked_num: like.liked_num - 1 });
        }
      });
    }
  };

  const handleClick = () => {
    navigate(`/${post_id}`, {
      state: {
        user_id,
        postUser,
        caption,
        title,
        likes,
        createdAt,
      },
    });
  };

  const handleDelete = () => {
    setShowPopUp(true);
    setCurrentPopUp(DELETE);
    setCurrentPostId(post_id);
  };

  const onClickUserImage = () => {
    if (user_id === postUser._id) {
      return navigate("/profile");
    }
    navigate(`/profile/${postUser._id}`);
  };

  return (
    <div className="feed_wrapper">
      <div className="feed_header">
        <div className="feed_user_info">
          <img
            className="feed_user_img"
            src={postUser.profile_pic}
            alt="profile picture"
            onClick={onClickUserImage}
          />
          <div className="feed_name_and_title">
            <h3>{postUser.username}</h3>
            <h2>{title}</h2>
          </div>
        </div>
        <div>
          <span className="feed_date">{elapsedTimePeriod(createdAt)}</span>
          {(user_id === postUser._id || user_role === "admin") && (
            <button className="feed_delete_btn" onClick={handleDelete}>
              ✕
            </button>
          )}
        </div>
      </div>
      {/* Content */}
      <div
        onClick={handleClick}
        className="ql-editor feed_click"
        style={{ padding: "10px 10px 10px 10px", minHeight: "60px" }}
      >
        {parse(caption)}
      </div>
      <div className="feed_menu">
        <div className="feed_menu_comments" onClick={handleClick}>
          <h4>댓글 {comments}개</h4>
          <div
            className="clickable"
            style={{ position: "relative", margin: "-3px 5px 0 5px" }}
          >
            <img src={comment} />
          </div>
        </div>
        <div className="feed_menu_like">
          <h4>좋아요 {like.liked_num}개</h4>
          {like.liked ? (
            <div className="feed_like_icon icon_anime2">
              <img src={like_after} onClick={handleLike} />
            </div>
          ) : (
            <div className="feed_like_icon">
              <img src={like_before} onClick={handleLike} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
