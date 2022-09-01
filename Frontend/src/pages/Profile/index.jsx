import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";

import "./style.css";
import img from "../../assets/user.png";
import {
  updateProfilePic,
  getUser,
  getUserPosts,
  getUserComments,
} from "../../api/UserApi";
import "../../components/common/Modal.css";
import { ProfilePic } from "../../components/profile/ProfilePic";
import { ProfileCaption } from "../../components/profile/ProfileCaption";

export const Profile = (props) => {
  const [onClick, setOnClick] = useState(false);

  getUserComments().then((result)=>console.log(result))
  
  const {
    isError,
    isLoading,
    error,
    data: user,
  } = useQuery("user", ({ signal }) => getUser(signal));

  const queryClient = useQueryClient();

  const profilePicMutate = useMutation(updateProfilePic, {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
    },
  });

  const handlePic = () => {
    setOnClick(true);
  };

  const handleClose = () => {
    setOnClick(false);
  };

  const updatePic = async (event) => {
    const profile_pic = event.target.src;

    profilePicMutate.mutate(profile_pic);
  };

  const ownedNFTs = user.ownerOfNFT.map((NFTs) => {
    return NFTs.NFT_URL.map((NFT) => {
      return (
        <div className="profile-info clickable-img" style={{ margin: "0 3%" }}>
          <img
            src={`${NFT}`}
            onClick={(event) => updatePic(event)}
            alt={NFTs.collection_id}
            style={{ width: "250px", borderRadius: "20px" }}
          />
        </div>
      );
    });
  });

  return (
    <div className="app" id="profileWindow">
      <div className="profile-container">
        <div className="profile-content">
          <div className="profile-wrapper">
            <div id="myModal" class={onClick ? "modal2" : "modal"}>
              <div id="ImgResize" class="modal-content">
                <div
                  style={{
                    borderColor: "black",
                    marginTop: "10px",
                    width: "100%",
                    height: "40px",
                    borderBottom: "solid 1px lightgray",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{ marginRight: "10px" }}
                    class="close"
                    onClick={handleClose}
                  >
                    {" "}
                    &times;
                  </span>
                  <h3 style={{ marginLeft: "30px" }}>프로필 사진 NFT 선택 </h3>
                </div>
                <div style={{ display: "flex", margin: "3% 0" }}>
                  {ownedNFTs}
                </div>
              </div>
            </div>
            <ProfilePic userProfile={user?.profile} handlePic={handlePic} />
            <ProfileCaption userProfile={user?.profile} />
          </div>
        </div>
        <div className="profile-wrapper">
          <div
            style={{
              width: "100%",
              height: "1px",
              borderBottom: "1px solid lightgray",
              margin: "3% auto",
            }}
          >
            <div className="profile-post">
              <h4>게시물</h4>
            </div>
            <div className="profile-post">
              <img src={img} style={{ width: "30%" }} />
              <img src={img} style={{ width: "30%" }} />
              <img src={img} style={{ width: "30%" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
