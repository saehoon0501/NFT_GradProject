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
          <img
            className="profile-info-img"
            src={
              user.profile_pic === " "
                ? "https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg"
                : user.profile_pic
            }
          />
          <p className="profile-edit-img">이미지 수정</p>
        </div>
      ) : (
        <div className="profile-info-not-owner">
          <img
            className="profile-info-img"
            src={
              user.profile_pic === " "
                ? "https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg"
                : user.profile_pic
            }
          />
          <p className="profile-edit-img">이미지 수정</p>
        </div>
      )}
    </>
  );
};
