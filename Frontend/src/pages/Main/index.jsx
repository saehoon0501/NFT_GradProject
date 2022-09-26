import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import "./style.css";

import Feed from "../../components/main/Feed";
import { CategoryBar } from "../../components/main/CategoryBar";
import { Submit } from "../../components/main/Submit";

import { getUser } from "../../api/UserApi";
import { addPost, delPost, getPost, searchPost } from "../../api/FeedApi";
import new_icon from "../../assets/new.png";
import new_icon2 from "../../assets/new2.png";
import best from "../../assets/best.png";
import best2 from "../../assets/best2.png";
import {
  currentPopUpState,
  currentPostIdState,
  currentPostTextState,
  currentPostTitleState,
  isLoginState,
  isWritingPost,
  showPopUpState,
} from "../../store";
import { LoginUser } from "../../components/main/LoginUser";
import { Vote } from "../../components/main/Vote";
import { Loading } from "../../components/common/Loading";
import { CANCEL_FEED, DELETE, WRITE_FEED } from "../../utils";

export const Main = ({ socketValue }) => {
  const [isBest, setIsBest] = useState(false);
  const [isAuth, setIsAuth] = useRecoilState(isLoginState);
  const [isUserDataSend, setIsUserDataSend] = useState(false);
  const [loginUsers, setLoginUsers] = useState([]);
  const [showPopUp, setShowPopUp] = useRecoilState(showPopUpState);
  const [currentPopUp, setCurrentPopUp] = useRecoilState(currentPopUpState);
  const [isOpen, setIsOpen] = useRecoilState(isWritingPost);
  const [currentPostTitle, setCurrentPostTitle] = useRecoilState(
    currentPostTitleState
  );
  const [currentPostText, setCurrentPostText] =
    useRecoilState(currentPostTextState);
  const [currentPostId, setCurrentPostId] = useRecoilState(currentPostIdState);

  const userQuery = useQuery("user", ({ signal }) => getUser(signal), {
    onSuccess: (data) => {
      console.log(data);
      socketValue.emit("newUser", {
        publicAddr: data.publicAddr,
        username: data.profile.username,
        profile_pic: data.profile.profile_pic,
      });
      setIsUserDataSend(true);
      console.log("Send User Data");
    },
  });
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

  useEffect(() => {
    console.log(socketValue);
    if (socketValue) {
      socketValue.on("onlineUsers", ({ onlineUsers }) => {
        setLoginUsers(onlineUsers);
        console.log(onlineUsers);
      });
    }
    console.log("Getting Socket Data");
  }, [socketValue]);

  if (userQuery.isLoading || postQuery.isLoading) {
    return <Loading />;
  }

  const toggleContent = () => {
    switch (currentPopUp) {
      case DELETE:
        return "정말 삭제하시겠습니까? 다시 복구할 수 없습니다.";
      case WRITE_FEED:
        return "해당 내용의 피드를 작성하시겠습니까?";
      case CANCEL_FEED:
        return "피드 작성을 취소하시겠습니까? 다시 복구할 수 없습니다.";
    }
  };

  const onClickSubmit = () => {
    setShowPopUp(false);
    switch (currentPopUp) {
      case DELETE:
        delPost(currentPostId);
        return;
      case WRITE_FEED:
        addPost(currentPostTitle, currentPostText);
        setIsOpen(!isOpen);
        return;
      case CANCEL_FEED:
        setIsOpen(!isOpen);
        return;
    }
  };

  const onClickCancel = () => {
    setShowPopUp(false);
  };

  return (
    <div className="main_wrapper">
      <CategoryBar />
      <LoginUser users={loginUsers} />
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
            socketValue={socketValue}
            user_publicAddr={userQuery.data.publicAddr}
            writer_publicAddr={post.user.publicAddr}
            createdAt={post.createdAt}
            postingId={post.user._id}
          />
        ))}
      </div>
      {showPopUp && (
        <div className="popup_wrapper">
          <h3 className="popup_title">{toggleContent()}</h3>
          <div className="popup_btns">
            <button className="popup_btn" onClick={onClickSubmit}>
              확인
            </button>
            <button className="popup_btn" onClick={onClickCancel}>
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
