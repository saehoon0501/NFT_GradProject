import { useState } from "react";
import "./Vote.css";

export const Vote = ({ data, currentVoteContent, setCurrentVoteContent }) => {
  const [showPopUp, setShowPopUp] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const onClickVoteSubject = (voteData) => {
    setShowPopUp(true);
    setCurrentVoteContent(voteData);
  };

  const onClickClosePopUp = () => {
    setShowPopUp(false);
  };

  const onClickOption = (optionName) => {
    setSelectedOption(optionName);
  };

  const onClickSubmit = () => {
    console.log(`${selectedOption} 투표`);
    setShowPopUp(false);
    setCurrentVoteContent("");
    setSelectedOption("");
  };

  return (
    <div className="vote_wrapper">
      <h3 className="vote_title">투표</h3>
      <div className="vote_list">
        {data.map((vote) => (
          <div
            className="vote_subject"
            onClick={() => onClickVoteSubject(vote)}
          >
            <p>{vote.title}</p>
          </div>
        ))}
      </div>
      {showPopUp && (
        <div className="vote_popup">
          <button onClick={onClickClosePopUp} className="vote_popup_closeBtn">
            ✕
          </button>
          <h1 className="vote_popup_title">{currentVoteContent.title}</h1>
          <div className="vote_popup_options">
            {currentVoteContent?.voteOption.map((vote) => (
              <div className="vote_popup_option">
                <div className="vote_popup_name_and_select">
                  <p className="vote_popup_option_name">{vote.name}</p>
                  <button
                    className="vote_popup_selectBtn"
                    onClick={() => onClickOption(vote.name)}
                  >
                    {vote.name === selectedOption ? "O" : " "}
                  </button>
                </div>
                <div className="vote_popup_option_bar" />
                <p className="vote_popup_option_count">{vote.count}표</p>
              </div>
            ))}
          </div>
          <button onClick={onClickSubmit} className="vote_popup_submitBtn">
            투표하기
          </button>
        </div>
      )}
    </div>
  );
};
