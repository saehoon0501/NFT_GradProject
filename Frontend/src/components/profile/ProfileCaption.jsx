import { useRef, useState } from "react";

import "./ProfileCaption.css";

import { updateUser } from "../../api/UserApi";

export const ProfileCaption = ({ userProfile }) => {
  const [caption, setCaption] = useState(`${userProfile.caption}`);
  const [profileName, setProfileName] = useState(`${userProfile.username}`);
  const [editProfile, setEditProfile] = useState(true);

  const nameRef = useRef(profileName);
  const captionRef = useRef(caption);

  const update = async () => {
    nameRef.current = profileName;
    captionRef.current = caption;
    updateUser(caption, profileName).then((res) => {
      console.log(res.data);
    });
    setEditProfile(true);
  };

  const updateNot = () => {
    setProfileName(nameRef.current);
    setCaption(captionRef.current);
    setEditProfile(true);
  };

  return (
    <div className="profile-caption-wrapper">
      {editProfile ? (
        <div>
          <div className="profile-about-wrapper">
            <h3>{nameRef.current}</h3>
            <input
              className="profile-edit-btn"
              onClick={() => {
                setEditProfile(false);
              }}
              type="button"
              value="프로필 편집"
            />
          </div>
          <div className="profile-text">
            <h3>게시물 {userProfile.post_ids.length}</h3>
            <h3 style={{ color: "blue" }}>RGB {userProfile.points}</h3>
          </div>
        </div>
      ) : (
        <div style={{ display: "block", width: "100%" }}>
          사용자 이름
          <textarea
            onChange={(event) => {
              setProfileName(event.target.value);
            }}
            value={profileName}
            style={{
              width: "100%",
              wordWrap: "break-word",
              fontSize: "1.1em",
              fontWeight: "bolder",
              resize: "none",
              padding: "2%",
            }}
          />
          <div>
            소개
            <textarea
              onChange={(event) => {
                setCaption(event.target.value);
              }}
              value={caption}
              style={{
                width: "100%",
                height: "150px",
                resize: "none",
                fontSize: "1em",
              }}
            />
            <div
              style={{
                display: "flex",
                margin: "auto",
                justifyContent: "center",
                margin: "5% auto",
              }}
            >
              <input
                className="profile-edit-btn"
                onClick={update}
                type="button"
                value="확인"
              />
              <input
                className="profile-edit-btn"
                onClick={updateNot}
                type="button"
                value="취소"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
