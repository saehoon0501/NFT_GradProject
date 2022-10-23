import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import "./style.css";

import Feed from "../../components/main/Feed";
import { CategoryBar } from "../../components/main/CategoryBar";
import { Submit } from "../../components/main/Submit";

import { getUser } from "../../api/UserApi";
import { addPost, delPost, getBestPost, getPost } from "../../api/FeedApi";
import new_icon from "../../assets/new.png";
import new_icon2 from "../../assets/new2.png";
import best from "../../assets/best.png";
import best2 from "../../assets/best2.png";
import {
  currentPopUpState,
  currentPostIdState,
  currentPostTextState,
  currentPostTitleState,
  currentVoteContentState,
  isLoginState,
  isWritingPost,
  showPopUpState,
} from "../../store";
import { LoginUser } from "../../components/main/LoginUser";
import { VoteList } from "../../components/main/VoteList";
import { Loading } from "../../components/common/Loading";
import { CANCEL_FEED, DELETE, WRITE_FEED } from "../../utils";
import { PopUp } from "../../components/common/PopUp";
import { getVote } from "../../api/VoteApi";

export const Main = ({ socketValue }) => {
  const [isBest, setIsBest] = useState(false);
  const [isUserDataSend, setIsUserDataSend] = useState(false);
  const [loginUsers, setLoginUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [currentVoteContent, setCurrentVoteContent] = useRecoilState(
    currentVoteContentState
  );

  const [showPopUp, setShowPopUp] = useRecoilState(showPopUpState);
  const [isOpen, setIsOpen] = useRecoilState(isWritingPost);

  const currentPopUp = useRecoilValue(currentPopUpState);
  const currentPostTitle = useRecoilValue(currentPostTitleState);
  const currentPostText = useRecoilValue(currentPostTextState);
  const currentPostId = useRecoilValue(currentPostIdState);
  const setIsAuth = useSetRecoilState(isLoginState);

  const navigate = useNavigate();

  const userQuery = useQuery("user", ({ signal }) => getUser(signal), {
    onSuccess: (data) => {
      socketValue.emit("newUser", {
        publicAddr: data.publicAddr,
        username: data.profile.username,
        profile_pic: data.profile.profile_pic,
      });
      setIsUserDataSend(true);
    },
  });
  const {
    data: posts,
    refetch: refetchPosts,
    isLoading: isPostLoading,
  } = useQuery("posts", ({ signal }) => getPost(signal));

  const { data: bestPosts, refetch: refetchBestPosts } = useQuery(
    "bestPosts",
    getBestPost
  );

  console.log(bestPosts);

  const { data: voteData } = useQuery("votes", getVote);

  if (userQuery.isError) {
    navigate("/login");
  }

  const handleFilter = () => {
    setIsBest(!isBest);
  };

  useEffect(() => {
    setIsAuth(false);
  }, []);

  useEffect(() => {
    if (socketValue) {
      socketValue.on("onlineUsers", ({ onlineUsers }) => {
        setLoginUsers(onlineUsers);
      });
    }
  }, [socketValue]);

  if (userQuery.isLoading || isPostLoading) {
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

  const onClickSubmit = async () => {
    setShowPopUp(false);
    switch (currentPopUp) {
      case DELETE:
        await delPost(currentPostId);
        refetchPosts();
        return;
      case WRITE_FEED:
        await addPost(currentPostTitle, currentPostText);
        setTitle("");
        refetchPosts();
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

  console.log(userQuery.data);
  console.log(posts);

  return (
    <div className="main_wrapper">
      <CategoryBar />
      <LoginUser users={loginUsers} />
      <VoteList
        setCurrentVoteContent={setCurrentVoteContent}
        userData={userQuery.data}
        data={voteData}
      />
      <Submit user={userQuery.data} title={title} setTitle={setTitle} />
      <div className="main_icons_wrapper">
        <div
          className={
            isBest ? "main_default_icon main_filter_icon" : "main_default_icon"
          }
          onClick={() => setIsBest(true)}
        >
          <img src={isBest ? best2 : best} alt="best_icon" />
          <h3>Best</h3>
        </div>
        <div
          className={
            !isBest ? "main_default_icon main_filter_icon" : "main_default_icon"
          }
          onClick={() => setIsBest(false)}
        >
          <img src={!isBest ? new_icon2 : new_icon} alt="new_icon" />
          <h3>New</h3>
        </div>
      </div>
      <div>
        {isBest ? (
          <>
            {bestPosts?.map((post) => (
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
                likedUsers={post.likes.liked_user}
              />
            ))}
          </>
        ) : (
          <>
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
                likedUsers={post.likes.liked_user}
              />
            ))}
          </>
        )}
      </div>
      {showPopUp && (
        <PopUp
          title={toggleContent()}
          onClickSubmit={onClickSubmit}
          onClickCancel={onClickCancel}
        />
      )}
    </div>
  );
};
