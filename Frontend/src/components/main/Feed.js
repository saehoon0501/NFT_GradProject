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
  writer_profile,
  user_id,
  caption,
  title,
  likes,
  comments,
  socketValue,
  user_publicAddr,
  writer_publicAddr,
  createdAt,
  postingId,
  likedUsers,
}) => {
  const [like, setLike] = useState({
    liked: false,
    liked_num: likes.liked_user.length,
  });
  const [showPopUp, setShowPopUp] = useRecoilState(showPopUpState);
  const [currentPopUp, setCurrentPopUp] = useRecoilState(currentPopUpState);
  const [currentPostId, setCurrentPostId] = useRecoilState(currentPostIdState);

  const navigate = useNavigate();

  useEffect(() => {
    if (likedUsers.includes(user_id)) {
      setLike((prev) => ({ ...prev, liked: true }));
    }

    // console.log(caption, writer_profile.post_ids.includes(post_id));
    // if (isOwner === false && writer_profile.post_ids.includes(post_id)) {
    //   setIsOwner(true);
    // }
  }, []);

  const handleLike = async () => {
    if (!like.liked) {
      likePost(post_id, likes)
        .then((res) => {
          console.log(res.data);
          likes = res.data;
          if (likes.liked_user.includes(user_id)) {
            setLike({ liked: true, liked_num: likes.liked_user.length });
          }
          socketValue.emit("sendNotification", {
            sender: user_publicAddr,
            receiver: writer_publicAddr,
            type: "like",
          });
        })
        .catch((err) => console.log(err));
    } else {
      dislikePost(post_id, likes).then((res) => {
        likes = res.data;
        setLike({ liked: false, liked_num: likes.liked_user.length });
      });
    }
  };

  const handleClick = () => {
    navigate(`/post/${post_id}`, {
      state: {
        post_id,
        writer_profile,
        user_id,
        caption,
        title,
        likes,
        comment_ids: comments,
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
    if (user_id === postingId) {
      return navigate("/profile");
    }
    navigate(`/profile/${postingId}`);
  };

  return (
    <div className="feed_wrapper">
      <div className="feed_header">
        <div className="feed_user_info">
          <img
            className="feed_user_img"
            src={writer_profile.profile_pic}
            alt="profile picture"
            onClick={onClickUserImage}
          />
          <div className="feed_name_and_title">
            <h3>{writer_profile.username}</h3>
            <h2>{title}</h2>
          </div>
        </div>
        <div>
          <span className="feed_date">{elapsedTimePeriod(createdAt)}</span>
          {user_id === postingId && (
            <button className="feed_delete_btn" onClick={handleDelete}>
              ✕
            </button>
          )}
        </div>
      </div>
      <div>
        {/* Content */}
        <div className="ql-editor">{parse(caption)}</div>
      </div>
      <div className="feed_menu">
        <div className="feed_menu_comments" onClick={handleClick}>
          <h4>댓글 {comments?.length}개</h4>
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
