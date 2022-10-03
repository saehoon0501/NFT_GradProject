import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { certainUserPost } from "../../api/UserApi";
import "./ProfilePost.css";

export const ProfilePost = ({ postId, title, commentCount }) => {
  const [post, setPost] = useState({
    title,
    likeCount: 10,
    commentCount,
  });
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const toggleHover = () => {
    setIsHovered(!isHovered);
  };

  // const onClickPost = () => {
  //   navigate(`/post/${postId}`);
  // };

  // useEffect(() => {
  //   const data = certainUserPost(publicAddr);
  //   console.log(data);
  // }, []);

  return (
    <div
      onMouseEnter={toggleHover}
      onMouseLeave={toggleHover}
      className="profile_post_wrapper"
    >
      {isHovered ? (
        <p className="profile_post_detail">
          좋아요 : {post.likeCount} 댓글 : {post.commentCount}
        </p>
      ) : (
        <p className="profile_post_title">{post.title}</p>
      )}
    </div>
  );
};
