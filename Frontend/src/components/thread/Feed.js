import React, { useState, useEffect } from "react";
import parse from "html-react-parser";
import { useNavigate } from "react-router-dom";
import { IconButton, Menu, MenuItem } from "@mui/material";

import "./Feed.css";
import like_before from "../../assets/like-before.png";
import like_after from "../../assets/like-after.png";
import comment from "../../assets/comment.png";
import kebab from "../../assets/kebab.png";
import { likePost, dislikePost, delPost } from "../../api/FeedApi";

function Feed({
  post_id,
  writer_profile,
  user_id,
  caption,
  title,
  likes,
  comments,
}) {
  const [like, setLike] = useState({
    liked: false,
    liked_num: likes.liked_user.length,
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [isOwner, setIsOwner] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (likes.liked_user.includes(user_id)) {
      setLike((prev) => ({ ...prev, liked: true }));
    }

    console.log(caption, writer_profile.post_ids.includes(post_id));
    if (isOwner === false && writer_profile.post_ids.includes(post_id)) {
      setIsOwner(true);
    }

    return () => {};
  }, []);

  const handleLike = async () => {
    if (!like.liked) {
      likePost(post_id, likes)
        .then((res) => {
          likes = res.data;
          if (likes.liked_user.includes(user_id)) {
            setLike({ liked: true, liked_num: likes.liked_user.length });
          }
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
      },
    });
  };

  const handleDelete = () => {
    delPost(post_id).then((res) => {
      console.log(res);
    });
  };

  const kebabMenu = (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        sx={{ zIndex: "1" }}
        onClick={(event) => {
          setAnchorEl(event.currentTarget);
          event.stopPropagation();
        }}
      >
        <img src={kebab} alt="menu icon" />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={(event) => {
          setAnchorEl(null);
          event.stopPropagation();
        }}
        PaperProps={{
          style: {
            maxHeight: 45 * 4.5,
            width: "8ch",
          },
        }}
      >
        <MenuItem
          key={"수정"}
          onClick={(event) => {
            setAnchorEl(null);
            event.stopPropagation();
          }}
          sx={{ "&.MuiMenuItem-root": { color: "black" } }}
        >
          스크랩
        </MenuItem>
        {isOwner ? (
          <MenuItem
            key={"삭제"}
            onClick={(event) => {
              setAnchorEl(null);
              event.stopPropagation();
              handleDelete();
            }}
            sx={{ "&.MuiMenuItem-root": { color: "red" } }}
          >
            삭제
          </MenuItem>
        ) : undefined}
      </Menu>
    </div>
  );

  return (
    <div
      className="feed"
      style={{
        display: "block",
        border: "1px solid lightgray",
        borderRadius: "5px",
      }}
    >
      <div style={{ width: "500px", maxHeight: "500px", overflow: "hidden" }}>
        <div className="feed_header" style={{ display: "block" }}>
          <div style={{ display: "flex" }}>
            <div className="feed_avatar">
              <img
                src={writer_profile.profile_pic}
                alt="profile picture"
                style={{ width: "40px", height: "40px", borderRadius: "10px" }}
              />
            </div>
            <div
              style={{
                position: "relative",
                width: "65%",
                marginLeft: "5px",
                display: "flex",
                marginTop: "10px",
              }}
            >
              <div style={{ overflow: "hidden" }}>
                <h3>{writer_profile.username}</h3>
              </div>
            </div>
            <div className="post__timeline">
              <span>n일 전</span>
            </div>
            {kebabMenu}
          </div>
        </div>
        <div style={{ maxHeight: "450px" }}>
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
            onClick={handleClick}
            className="ql-editor feed_click"
            style={{ padding: "10px 10px 10px 10px", minHeight: "60px" }}
          >
            {parse(caption)}
          </div>
        </div>
      </div>
      {/* INFO */}
      <div style={{ display: "flex", padding: "10px 10px 5px 15px" }}>
        <div onClick={handleClick} className="feed_click">
          <h4>댓글 {comments?.length}개</h4>
        </div>
        <div
          onClick={handleClick}
          className="clickable"
          style={{ position: "relative", margin: "-3px 5px 0 5px" }}
        >
          <img src={comment} onClick={handleClick} />
        </div>
        <div>
          <h4>좋아요 {like.liked_num}개</h4>
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
    </div>
  );
}

export default Feed;
