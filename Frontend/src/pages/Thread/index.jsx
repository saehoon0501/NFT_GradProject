import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import "./style.css";

import Feed from "../../components/thread/Feed";
import { CategoryBar } from "../../components/thread/CategoryBar";
import { Submit } from "../../components/thread/Submit";

import { getUser } from "../../api/UserApi";
import { getPost } from "../../api/FeedApi";
import new_icon from "../../assets/new.png";
import new_icon2 from "../../assets/new2.png";
import best from "../../assets/best.png";
import best2 from "../../assets/best2.png";
import { isLoginState } from "../../store";

export const Thread = () => {
  // const { category } = useParams();
  const [filter_best, setBest] = useState(false);
  const [filter_new, setNew] = useState(true);
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
    setNew(!filter_new);
    setBest(filter_new);
  };

  useEffect(() => {
    setIsAuth(false);
    return () => {};
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

  return (
    <div className="app">
      <div className="timeline">
        <CategoryBar />
        <Submit user={userQuery.data} setPosts={setPosts} />
        <div
          style={{
            display: "flex",
            border: "1px solid lightgray",
            padding: "10px",
            borderRadius: "5px",
            width: "500px",
            marginBottom: "10px",
          }}
        >
          <div
            className={filter_best ? "filter_icon clickable" : "clickable"}
            style={{
              border: "1px solid lightgray",
              borderRadius: "10px",
              padding: "6px",
              margin: "0 10px",
              display: "flex",
            }}
            onClick={handleFilter}
          >
            <div>
              <img src={filter_best ? best2 : best} alt="best_icon" />
            </div>
            <div style={{ position: "relative", margin: "3px 3px 0 3px" }}>
              <h3>Best</h3>
            </div>
          </div>
          <div
            className={filter_new ? "filter_icon clickable" : "clickable"}
            style={{
              border: "1px solid lightgray",
              borderRadius: "10px",
              padding: "6px",
              margin: "0 3px",
              display: "flex",
            }}
            onClick={handleFilter}
          >
            <div>
              <img src={filter_new ? new_icon2 : new_icon} alt="new_icon" />
            </div>
            <div style={{ position: "relative", margin: "3px 3px 0 3px" }}>
              <h3>New</h3>
            </div>
          </div>
        </div>
        {posts == undefined ? undefined : (
          <div>
            {posts.map((post) => (
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
        )}
      </div>
    </div>
  );
};
