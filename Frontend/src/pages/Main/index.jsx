import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useRecoilState, useRecoilValue } from "recoil";
import "./style.css";

import Feed from "../../components/main/Feed";
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
  const [loginUsers, setLoginUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [currentVoteContent, setCurrentVoteContent] = useRecoilState(
    currentVoteContentState
  );
  const [currentPosts, setCurrentPosts] = useState([]);
  const [currentPostCount, setCurrentPostCount] = useState(0);

  const [showPopUp, setShowPopUp] = useRecoilState(showPopUpState);
  const [isOpen, setIsOpen] = useRecoilState(isWritingPost);
  const [isAuth, setIsAuth] = useRecoilState(isLoginState);

  const currentPopUp = useRecoilValue(currentPopUpState);
  const currentPostTitle = useRecoilValue(currentPostTitleState);
  const currentPostText = useRecoilValue(currentPostTextState);
  const currentPostId = useRecoilValue(currentPostIdState);

  const userQuery = useQuery({
    queryKey: ["user", 1],
    queryFn: ({ signal }) => getUser(signal),
    retry: false,
  });

  // {
  //     onSuccess: (data) => {
  // socketValue.emit("newUser", {
  //   publicAddr: data.publicAddr,
  //   username: data.profile.username,
  //   profile_pic: data.profile.profile_pic,
  // });
  //     setIsUserDataSend(true);
  //   },
  //   onError: () => {
  //     queryClient.setQueriesData("user", notLoginUser);
  //   },
  // }

  const { refetch: refetchPosts, isLoading: isPostLoading } = useQuery(
    "posts",
    () => getPost(currentPostCount),
    {
      onSuccess: (data) => {
        setCurrentPosts(data);
      },
    }
  );

  const { refetch: refetchBestPosts } = useQuery(
    "bestPosts",
    () => getBestPost(currentPostCount),
    {
      onSuccess: (data) => {
        setCurrentPosts(data);
      },
      enabled: false,
    }
  );

  // const { data: voteData } = useQuery("votes", getVote);

  useEffect(() => {
    if (socketValue) {
      socketValue.on("onlineUsers", ({ onlineUsers }) => {
        setLoginUsers(onlineUsers);
      });
    }
  }, [socketValue]);

  useEffect(async () => {
    let addingData;
    if (isBest) {
      const { data } = await refetchBestPosts();
      addingData = data;
    } else {
      const { data } = await refetchPosts();
      addingData = data;
    }
    setCurrentPosts([...currentPosts, ...addingData]);
  }, [currentPostCount]);

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
        setIsBest(false);
        setCurrentPostCount(0);
        window.location.reload();
        return;
      case CANCEL_FEED:
        setIsOpen(!isOpen);
        return;
    }
  };

  const onClickCancel = () => {
    setShowPopUp(false);
  };

  const onClickShowBestPosts = () => {
    setCurrentPostCount(0);
    refetchBestPosts();
    setIsBest(true);
  };

  const onClickShowNewPosts = () => {
    setCurrentPostCount(0);
    refetchPosts();
    setIsBest(false);
  };

  window.onscroll = async function () {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      setCurrentPostCount(currentPostCount + 1);
    }
  };

  return (
    <div className="main_wrapper">
      <LoginUser users={loginUsers} />
      {/* <VoteList
        setCurrentVoteContent={setCurrentVoteContent}
        userData={userQuery.data}
        data={voteData}
      /> */}
      {isAuth && (
        <Submit
          user={userQuery.data}
          title={title}
          setTitle={setTitle}
          setIsBest={setIsBest}
        />
      )}
      <div className="main_icons_wrapper">
        <div
          className={
            isBest ? "main_default_icon main_filter_icon" : "main_default_icon"
          }
          onClick={onClickShowBestPosts}
        >
          <img src={isBest ? best2 : best} alt="best_icon" />
          <h3>Best</h3>
        </div>
        <div
          className={
            !isBest ? "main_default_icon main_filter_icon" : "main_default_icon"
          }
          onClick={onClickShowNewPosts}
        >
          <img src={!isBest ? new_icon2 : new_icon} alt="new_icon" />
          <h3>New</h3>
        </div>
      </div>
      <div>
        {isBest ? (
          <>
            {currentPosts?.map((post, index) => (
              <Feed
                key={post._id + index}
                post_id={post._id}
                user_id={userQuery.data ? userQuery.data._id : " "}
                postUser={post.user}
                user_role={userQuery.data ? userQuery.data.role : " "}
                caption={post.text}
                title={post.title}
                comments={post.comments}
                likes={post.like}
                socketValue={socketValue}
                createdAt={post.createdAt}
              />
            ))}
          </>
        ) : (
          <>
            {currentPosts?.map((post, index) => (
              <Feed
                key={post._id + index}
                post_id={post.post_id}
                user_id={userQuery.data ? userQuery.data._id : " "}
                postUser={post.user}
                user_role={userQuery.data ? userQuery.data.role : " "}
                caption={post.text}
                title={post.title}
                comments={post.comments}
                likes={post.like}
                socketValue={socketValue}
                createdAt={post.createdAt}
              />
            ))}
          </>
        )}
      </div>
      {showPopUp && (
        <>
          <div className="dimmed" />
          <PopUp
            title={toggleContent()}
            onClickSubmit={onClickSubmit}
            onClickCancel={onClickCancel}
          />
        </>
      )}
    </div>
  );
};
