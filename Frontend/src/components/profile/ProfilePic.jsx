import { useRecoilState } from "recoil";
import { changeImageState } from "../../store";
import "./ProfilePic.css";

export const ProfilePic = ({ userProfile }) => {
  const [changeImage, setChangeImage] = useRecoilState(changeImageState);

  const handlePic = () => {
    setChangeImage(true);
  };

  return (
    <div className="profile-info" onClick={handlePic}>
      <img className="profile-info-img" src={userProfile.profile_pic} />
      <p className="profile-edit-img">이미지 수정</p>
    </div>
  );
};
