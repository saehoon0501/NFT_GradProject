import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { deleteVote, getVote, voteOption } from "../../api/VoteApi";
import { PopUp } from "../../components/common/PopUp";
import { currentUserDataState, currentVoteContentState } from "../../store";
import { DELETE_VOTE, SUBMIT_VOTE } from "../../utils";

import "./style.css";

export const Vote = () => {
  const { id } = useParams();

  const [currentVoteContent, setCurrentVoteContent] = useRecoilState(
    currentVoteContentState
  );
  const [selectedOption, setSelectedOption] = useState("");
  const [currentVoteId, setCurrentVoteId] = useState("");
  const [showSelectNFTPopUp, setShowSelectNFTPopUp] = useState(false);
  const [userData, setUserData] = useRecoilState(currentUserDataState);
  const [selectedNFT, setSelectedNFT] = useState(-1);
  const [showPopUp, setShowPopUp] = useState(false);
  const [currentPopUp, setCurrentPopUp] = useState("");

  const navigate = useNavigate();

  console.log(id);

  const { refetch } = useQuery("votes", getVote);

  const onClickOption = (optionIndex, voteId) => {
    setSelectedOption(optionIndex);
    setCurrentVoteId(voteId);
    setShowSelectNFTPopUp(true);
  };

  const onClickSubmit = () => {
    // console.log(
    //   id,
    //   selectedOption,
    //   userData._id,
    //   userData.ownerOfNFT[0].NFT_URL[selectedNFT]
    // );
    // voteOption(id, selectedOption, userData._id, {
    //   collection_id: userData.ownerOfNFT[0].collection_id,
    //   NFT_URL: userData.ownerOfNFT[0].NFT_URL[selectedNFT],
    // });
    // setCurrentVoteContent("");
    // setSelectedOption("");
    // navigate("/");
    setShowPopUp(true);
    setCurrentPopUp(SUBMIT_VOTE);
  };

  const onClickNFT = (index) => {
    setSelectedNFT(index);
    setShowSelectNFTPopUp(false);
  };

  const onClickDelete = () => {
    setShowPopUp(true);
    setCurrentPopUp(DELETE_VOTE);
  };

  const toggleContent = () => {
    switch (currentPopUp) {
      case SUBMIT_VOTE:
        return "투표를 진행하시겠습니까?";
      case DELETE_VOTE:
        return "피드 투표를 삭제하시겠습니까? 다시 복구할 수 없습니다.";
    }
  };

  const onClickSubmitPopUp = async () => {
    setShowPopUp(false);
    switch (currentPopUp) {
      case SUBMIT_VOTE:
        voteOption(id, selectedOption, userData._id, {
          collection_id: userData.ownerOfNFT[0].collection_id,
          NFT_URL: userData.ownerOfNFT[0].NFT_URL[selectedNFT],
        });
        setCurrentVoteContent("");
        setSelectedOption("");
        navigate("/");
        return;
      case DELETE_VOTE:
        deleteVote(currentVoteContent._id);
        await refetch();
        navigate("/");
        return;
    }
  };

  const onClickCancelPopUp = () => {
    setShowPopUp(false);
  };

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
      <div className="vote_menus">
        <button onClick={onClickSubmit} className="vote_submit">
          투표하기
        </button>
        <button onClick={onClickDelete} className="vote_delete">
          삭제하기
        </button>
      </div>
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
      {showPopUp && (
        <PopUp
          title={toggleContent()}
          onClickSubmit={onClickSubmitPopUp}
          onClickCancel={onClickCancelPopUp}
        />
      )}
    </div>
  );
};
