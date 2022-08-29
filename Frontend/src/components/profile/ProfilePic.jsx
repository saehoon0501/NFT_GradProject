export const ProfilePic = ({ userProfile, handlePic }) => {
  return (
    <div className="profile-info clickable-img" onClick={handlePic}>
      <img
        src={userProfile.profile_pic}
        style={{ width: "450px", borderRadius: "20px" }}
      />
      <p className="description">이미지 수정</p>
    </div>
  );
};
