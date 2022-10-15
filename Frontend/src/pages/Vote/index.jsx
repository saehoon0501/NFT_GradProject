import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { voteOption } from "../../api/VoteApi";
import { currentUserDataState, currentVoteContentState } from "../../store";

import "./style.css";

export const Vote = () => {
  const [currentVoteContent, setCurrentVoteContent] = useRecoilState(
    currentVoteContentState
  );
  const [selectedOption, setSelectedOption] = useState("");
  const [currentVoteId, setCurrentVoteId] = useState("");
  const [userData, setUserData] = useRecoilState(currentUserDataState);

  const navigate = useNavigate();

  const onClickOption = (optionIndex, voteId) => {
    setSelectedOption(optionIndex);
    setCurrentVoteId(voteId);
  };

  const onClickSubmit = () => {
    voteOption(
      currentVoteId,
      selectedOption,
      userData._id,
      userData.ownerOfNFT
    );
    setCurrentVoteContent("");
    setSelectedOption("");
    navigate("/");
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
                {index === selectedOption ? "O" : " "}
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
    </div>
  );
};
