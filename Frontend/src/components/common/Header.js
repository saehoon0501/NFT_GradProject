import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { useQuery } from "react-query";

import "./Header.css";

import { getUser } from "../../api/UserApi";
import { isLoginState, isWritingPost, socketState } from "../../store";

import Logo from "../../assets/logo.png";

const dummyAlarmData = [
  {
    imgUrl:
      "https://img1.daumcdn.net/thumb/S180x180/?fname=https%3A%2F%2Ft1.daumcdn.net%2Fsports%2Fplayer%2F300%2F3%2F9552.jpg&scode=default_face_profile_big_p",
    name: "베츠",
    postName: "hello",
  },
  {
    imgUrl:
      "https://img1.daumcdn.net/thumb/S180x180/?fname=https%3A%2F%2Ft1.daumcdn.net%2Fsports%2Fplayer%2F300%2F3%2F9552.jpg&scode=default_face_profile_big_p",
    name: "베츠",
    postName: "hello",
  },
  {
    imgUrl:
      "https://img1.daumcdn.net/thumb/S180x180/?fname=https%3A%2F%2Ft1.daumcdn.net%2Fsports%2Fplayer%2F300%2F3%2F9552.jpg&scode=default_face_profile_big_p",
    name: "베츠",
    postName: "hello",
  },
  {
    imgUrl:
      "https://img1.daumcdn.net/thumb/S180x180/?fname=https%3A%2F%2Ft1.daumcdn.net%2Fsports%2Fplayer%2F300%2F3%2F9552.jpg&scode=default_face_profile_big_p",
    name: "베츠",
    postName: "hello",
  },
  {
    imgUrl:
      "https://img1.daumcdn.net/thumb/S180x180/?fname=https%3A%2F%2Ft1.daumcdn.net%2Fsports%2Fplayer%2F300%2F3%2F9552.jpg&scode=default_face_profile_big_p",
    name: "베츠",
    postName: "hello",
  },
];

export const Header = ({ socketValue }) => {
  const [isAuth, setIsAuth] = useRecoilState(isLoginState);
  const [isOpen, setIsOpen] = useRecoilState(isWritingPost);

  const [showAlarm, setShowAlarm] = useState(false);
  const [keyword, setKeyWord] = useState("");
  const navigate = useNavigate();
  const { data: user } = useQuery("user", ({ signal }) => getUser(signal));

  const showProfile = () => {
    navigate("/profile");
  };

  const showSns = () => {
    navigate("/");
  };

  const onClickCreatePost = () => {
    window.scrollTo(0, 0);
    setIsOpen(true);
  };

  const onClickMyComments = () => {
    navigate("/comments");
  };

  const onClickToggleAlarm = () => {
    setShowAlarm(!showAlarm);
  };

  const handleEnter = () => {
    if (window.event.keyCode == 13) {
      onClickSearch();
    }
  };

  const onClickSearch = () => {
    if (keyword.length < 2) {
      alert("검색어는 2글자 이상이어야 합니다.");
      return;
    }
    navigate(`/search/${keyword}`);
  };

  const onChangeSearch = (event) => {
    const value = event.target.value;
    setKeyWord(value);
  };

  useEffect(() => {
    console.log(socketValue);

    socketValue?.on("getNotification", (arg) => {
      console.log(arg);
    });

    console.log("Getting Socket Data");
  }, [socketValue]);

  return (
    <>
      {!isAuth && (
        <div className="header_wrapper">
          <img
            className="header_homeBtn"
            src={Logo}
            alt="NCC logo"
            onClick={showSns}
          />
          <div className="header_searchBar_wrapper">
            <input
              value={keyword}
              type="text"
              onChange={onChangeSearch}
              onKeyUp={handleEnter}
            />
            <button onClick={onClickSearch}>🔍</button>
          </div>
          <div className="header_menus">
            <button onClick={onClickCreatePost}>➕</button>
            <button onClick={onClickMyComments}>📝</button>
            <button onClick={onClickToggleAlarm}>🔔</button>
          </div>
          <img
            onClick={showProfile}
            className="header_profileBtn"
            src={user?.profile.profile_pic}
            alt="profile picture"
          />
          {showAlarm && (
            <div className="alarm_menu_wrapper">
              <div className="alarm_menu_header">
                <h3>알람 목록</h3>
                <button onClick={onClickToggleAlarm}>X</button>
              </div>
              <div className="alarm_contents">
                {[].map((alarm) => (
                  <div className="alarm_content">
                    <img src={alarm.imgUrl} alt={`${alarm.name}`} />
                    <p>{`${alarm.name}님이 ${alarm.postName}를 좋아합니다.`}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
