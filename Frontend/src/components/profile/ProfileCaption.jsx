import { useRef, useState } from "react";
import { updateUser } from "../../api/UserApi";

export const ProfileCaption = ({ userProfile }) => {
  const [caption, setCaption] = useState(`${userProfile.caption}`);
  const [profileName, setProfileName] = useState(`${userProfile.username}`);
  const [edit, setEdit] = useState(true);

  const nameRef = useRef(profileName);
  const captionRef = useRef(caption);

  const update = async () => {
    nameRef.current = profileName;
    captionRef.current = caption;

    updateUser(caption, profileName).then((res) => {
      console.log(res.data);
    });

    setEdit(true);
  };

  const updateNot = () => {
    setProfileName(nameRef.current);
    setCaption(captionRef.current);
    setEdit(true);
  };

  return (
    <div
      className="profile-info profile-about"
      style={{ width: "400px", padding: "1% 5%" }}
    >
      <div style={{ width: "100%", fontSize: "1.3em" }}>
        {edit ? (
          <div style={{ display: "flex", width: "100%" }}>
            <div
              style={{
                wordWrap: "break-word",
                width: "100%",
                marginRight: "auto",
              }}
            >
              <h3>{nameRef.current}</h3>
            </div>
            <input
              className="clickable-input"
              onClick={() => {
                setEdit(false);
              }}
              type="button"
              value="프로필 편집"
            />
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
          </div>
        )}

        <div className="profile-text">
          <h3>게시물 {userProfile.post_ids.length}</h3>
          <h3 style={{ color: "blue" }}>RGB {userProfile.points}</h3>
        </div>
      </div>

      <div style={{ fontSize: "1.3em" }}>
        {edit ? (
          <span>{captionRef.current}</span>
        ) : (
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
                className=" clickable-input"
                onClick={update}
                type="button"
                value="확인"
              />
              <input
                className=" clickable-input"
                onClick={updateNot}
                type="button"
                value="취소"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
