import { useRef, useState } from "react";

import "./ProfileCaption.css";

import { updateUser } from "../../api/UserApi";
import { CANCEL_EDIT_PROFILE, PROCEED_EDIT_PROFILE } from "../../utils";
import { useNavigate } from "react-router-dom";

export const ProfileCaption = ({ userProfile, isOwner = true, refetch }) => {
  const [intro, setIntro] = useState(`${userProfile.caption}`);
  const [profileName, setProfileName] = useState(`${userProfile.username}`);
  const [editProfile, setEditProfile] = useState(true);
  const [showPopUp, setShowPopUp] = useState(false);
  const [currentPopUp, setCurrentPopUp] = useState("");

  const nameRef = useRef(profileName);
  const introRef = useRef(intro);

  const navigate = useNavigate();

  const onClickConfirm = async () => {
    setShowPopUp(true);
    setCurrentPopUp(PROCEED_EDIT_PROFILE);
  };

  const onClickCancel = () => {
    setShowPopUp(true);
    setCurrentPopUp(CANCEL_EDIT_PROFILE);
  };

  const onChangeProfileName = (event) => {
    const changedName = event.target.value;
    setProfileName(changedName);
  };

  const onClickEditProfile = () => {
    setEditProfile(false);
  };

  const onClickNFTSetting = () => {
    navigate("/nft");
  };

  const toggleContent = () => {
    switch (currentPopUp) {
      case PROCEED_EDIT_PROFILE:
        return "현재 내용으로 프로필을 수정하시겠습니까?";
      case CANCEL_EDIT_PROFILE:
        return "변경한 내용이 저장되지 않습니다. 취소하시겠습니까?";
    }
  };

  const onClickSubmitPopUp = async () => {
    setShowPopUp(false);
    switch (currentPopUp) {
      case PROCEED_EDIT_PROFILE:
        nameRef.current = profileName;
        introRef.current = intro;
        await updateUser(intro, profileName);
        refetch();
        setEditProfile(true);
        return;
      case CANCEL_EDIT_PROFILE:
        setProfileName(nameRef.current);
        setIntro(introRef.current);
        setEditProfile(true);
        return;
    }
  };

  const onClickCancelPopUp = () => {
    setShowPopUp(false);
  };

  return (
    <div className="profile-caption-wrapper">
      {editProfile ? (
        <div style={{width: "400px"}}>
          <div className="profile-about-wrapper">
            <div className="profile-name">
            <h3>{nameRef.current}</h3>
            </div>
            {isOwner && (
              <>
                <button
                  className="profile-caption-btn"
                  onClick={onClickEditProfile}
                >
                  프로필 편집
                </button>
                <button
                  className="profile-caption-btn"
                  onClick={onClickNFTSetting}
                >
                  광고판 설정
                </button>
              </>
            )}
          </div>
          <span className="profile-intro">{userProfile.caption}</span>
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
      {showPopUp && (
        <>
          <div className="profile-dimmed" />
          <div className="profile_popup_wrapper">
            <h3 className="popup_title">{toggleContent()}</h3>
            <div className="popup_btns">
              <button className="popup_btn" onClick={onClickSubmitPopUp}>
                확인
              </button>
              <button className="popup_btn" onClick={onClickCancelPopUp}>
                취소
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
