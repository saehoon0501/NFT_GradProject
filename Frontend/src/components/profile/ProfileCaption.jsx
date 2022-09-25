import { useRef, useState } from "react";

import "./ProfileCaption.css";

import { updateUser } from "../../api/UserApi";

export const ProfileCaption = ({ userProfile, isOwner = true }) => {
  const [intro, setIntro] = useState(`${userProfile.caption}`);
  const [profileName, setProfileName] = useState(`${userProfile.username}`);
  const [editProfile, setEditProfile] = useState(true);

  const nameRef = useRef(profileName);
  const introRef = useRef(intro);

  const onClickConfirm = async () => {
    nameRef.current = profileName;
    introRef.current = intro;
    updateUser(intro, profileName).then((res) => {
      console.log(res.data);
    });
    setEditProfile(true);
  };

  const onClickCancel = () => {
    setProfileName(nameRef.current);
    setIntro(introRef.current);
    setEditProfile(true);
  };

  const onChangeProfileName = (event) => {
    const changedName = event.target.value;
    setProfileName(changedName);
  };

  const onClickEditProfile = () => {
    setEditProfile(false);
  };

  return (
    <div className="profile-caption-wrapper">
      {editProfile ? (
        <div>
          <div className="profile-about-wrapper">
            <h3>{nameRef.current}</h3>
            {isOwner && (
              <button
                className="profile-caption-btn"
                onClick={onClickEditProfile}
              >
                프로필 편집
              </button>
            )}
          </div>
          <div className="profile-text">
            <h3>게시물 {userProfile.post_ids.length}</h3>
            <h3 style={{ color: "blue" }}>RGB {userProfile.points}</h3>
          </div>
        </div>
      ) : (
        <div>
          <span>사용자 이름</span>
          <textarea
            className="profile-caption-profile-name-textarea"
            value={profileName}
            onChange={onChangeProfileName}
          />
          <span>소개</span>
          <textarea
            className="profile-caption-intro-textarea"
            onChange={(event) => {
              setIntro(event.target.value);
            }}
            value={intro}
          />
          <div className="profile-caption-btns">
            <button className="profile-caption-btn" onClick={onClickConfirm}>
              확인
            </button>
            <button className="profile-caption-btn" onClick={onClickCancel}>
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
