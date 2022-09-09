import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import "./style.css";

import Feed from "../../components/main/Feed";
import { CategoryBar } from "../../components/main/CategoryBar";
import { Submit } from "../../components/main/Submit";

import { getUser } from "../../api/UserApi";
import { getPost, searchPost } from "../../api/FeedApi";
import new_icon from "../../assets/new.png";
import new_icon2 from "../../assets/new2.png";
import best from "../../assets/best.png";
import best2 from "../../assets/best2.png";
import { isLoginState } from "../../store";
import { LoginUser } from "../../components/main/LoginUser";
import { Vote } from "../../components/main/Vote";

export const Main = () => {
  const [isBest, setIsBest] = useState(false);
  const [isAuth, setIsAuth] = useRecoilState(isLoginState);

  const userQuery = useQuery("user", ({ signal }) => getUser(signal));
  const postQuery = useQuery("posts", ({ signal }) => getPost(signal), {
    onSuccess: (data) => {
      console.log(posts);
      setPosts(data);
    },
  });

  const [posts, setPosts] = useState(postQuery.data);

  const navigate = useNavigate();

  if (userQuery.isError) navigate("/login");

  const handleFilter = () => {
    setIsBest(!isBest);
  };

  useEffect(() => {
    setIsAuth(false);
  }, []);

  if (userQuery.isLoading || postQuery.isLoading) {
    console.log(userQuery.data);
    console.log(postQuery.data);
    return (
      <div>
        <p>Loading....</p>
      </div>
    );
  }

  console.log(posts);

  return (
    <div className="main_wrapper">
      <CategoryBar />
      <LoginUser />
      <Vote />
      <Submit user={userQuery.data} setPosts={setPosts} />
      <div className="main_icons_wrapper">
        <div
          className={
            isBest ? "main_default_icon main_filter_icon" : "main_default_icon"
          }
          onClick={handleFilter}
        >
          <img src={isBest ? best2 : best} alt="best_icon" />
          <h3>Best</h3>
        </div>
        <div
          className={
            !isBest ? "main_default_icon main_filter_icon" : "main_default_icon"
          }
          onClick={handleFilter}
        >
          <img src={!isBest ? new_icon2 : new_icon} alt="new_icon" />
          <h3>New</h3>
        </div>
      </div>
      <div>
        {posts?.map((post) => (
          <Feed
            key={post._id}
            post_id={post._id}
            writer_profile={post.user.profile}
            user_id={userQuery.data._id}
            caption={post.text}
            title={post.title}
            comments={post.comments}
            likes={post.likes}
          />
        ))}
      </div>
    </div>
  );
};
