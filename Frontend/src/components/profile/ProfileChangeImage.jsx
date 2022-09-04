import { useMutation, useQueryClient } from "react-query";
import { useRecoilState } from "recoil";

import "./ProfileChangeImage.css";

import { updateProfilePic } from "../../api/UserApi";
import { changeImageState } from "../../store";

export const ProfileChangeImage = ({ user }) => {
  const [changeImage, setChangeImage] = useRecoilState(changeImageState);

  const queryClient = useQueryClient();

  const profilePicMutate = useMutation(updateProfilePic, {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
    },
  });

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

  const handleClose = () => {
    setChangeImage(false);
  };

  return (
    <div className={changeImage ? "modal2" : "modal"}>
      <div class="modal-content">
        <div className="modal-menu">
          <span className="close" onClick={handleClose}>
            &times;
          </span>
          <h3 className="modal-title">프로필 사진 NFT 선택 </h3>
        </div>
        <div className="modal-nfts-imgs">{ownedNFTs}</div>
      </div>
    </div>
  );
};
