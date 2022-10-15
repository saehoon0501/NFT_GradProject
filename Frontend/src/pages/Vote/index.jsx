import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { voteOption } from "../../api/VoteApi";
import { currentUserDataState, currentVoteContentState } from "../../store";

import "./style.css";

export const Vote = () => {
  const [currentVoteContent, setCurrentVoteContent] = useRecoilState(
    currentVoteContentState
  );
  const [selectedOption, setSelectedOption] = useState("");
  const [currentVoteId, setCurrentVoteId] = useState("");
  const [showSelectNFTPopUp, setShowSelectNFTPopUp] = useState(false);
  const [userData, setUserData] = useRecoilState(currentUserDataState);
  const [selectedNFT, setSelectedNFT] = useState(-1);

  const navigate = useNavigate();

  const onClickOption = (optionIndex, voteId) => {
    setSelectedOption(optionIndex);
    setCurrentVoteId(voteId);
    setShowSelectNFTPopUp(true);
  };

  const onClickSubmit = () => {
    console.log(
      currentVoteId,
      selectedOption,
      userData._id,
      userData.ownerOfNFT
    );
    voteOption(
      currentVoteId,
      selectedOption,
      userData._id,
      userData.ownerOfNFT[0].NFT_URL[selectedNFT]
    );
    setCurrentVoteContent("");
    setSelectedOption("");
    navigate("/");
  };

  const onClickNFT = (index) => {
    setSelectedNFT(index);
    setShowSelectNFTPopUp(false);
  };

  console.log(selectedNFT);

  return (
    <div className="vote_page_wrapper">
      <h1 className="vote_page_title">{currentVoteContent.title}</h1>
      <div className="vote_options">
        {currentVoteContent?.options.map((vote, index) => (
          <div key={index} className="vote_option">
            <div className="vote_name_and_select">
              <p className="vote_option_name">{vote.name}</p>
              <button
                className="vote_selectBtn"
                onClick={() => onClickOption(index, vote._id)}
              >
                {index === selectedOption ? (
                  <img
                    className="vote_count_img"
                    src={userData.ownerOfNFT[0].NFT_URL[selectedNFT]}
                    alt={"Vote NFT"}
                  />
                ) : (
                  " "
                )}
              </button>
            </div>
            <div className="vote_option_bar" />
            <p className="vote_option_count">{vote.vote_count}표</p>
          </div>
        ))}
      </div>
      <button onClick={onClickSubmit} className="vote_submitBtn">
        투표하기
      </button>
      {showSelectNFTPopUp && (
        <div className="vote_nft_popup">
          <h1>투표에 사용할 NFT를 선택해주세요.</h1>
          <div className="vote_nft_imgs">
            {userData.ownerOfNFT[0].NFT_URL.map((NFT, index) => (
              <div key={index}>
                <img
                  onClick={() => onClickNFT(index)}
                  className="vote_nft_img"
                  src={`${NFT}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
