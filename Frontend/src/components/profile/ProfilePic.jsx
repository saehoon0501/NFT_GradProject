import { useRecoilState } from "recoil";
import { changeImageState } from "../../store";
import "./ProfilePic.css";

export const ProfilePic = ({ user, isOwner = true }) => {
  const [changeImage, setChangeImage] = useRecoilState(changeImageState);

  const handlePic = () => {
    setChangeImage(true);
  };

  return (
    <>
      {isOwner ? (
        <div className="profile-info" onClick={handlePic}>
          <img className="profile-info-img" src={user.profile_pic} />
          <p className="profile-edit-img">이미지 수정</p>
        </div>
      ) : (
        <div className="profile-info-not-owner">
          <img className="profile-info-img" src={user.profile_pic} />
          <p className="profile-edit-img">이미지 수정</p>
        </div>
      )}
    </>
  );
};
