import { useState } from "react";
import "./Vote.css";

export const Vote = ({ data, currentVoteContent, setCurrentVoteContent }) => {
  const [showPopUp, setShowPopUp] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [createVote, setCreateVote] = useState(false);
  const [voteTitle, setVoteTitle] = useState("");
  const [voteOptions, setVoteOptions] = useState("");

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

  const onClickCreateVote = () => {
    setCreateVote(true);
  };

  const onClickCloseCreateVotePopUp = () => {
    setCreateVote(false);
  };

  const onChangeInput = (event) => {
    const { value } = event.target;
    setVoteTitle(value);
  };

  const onChangeTextarea = (event) => {
    const { value } = event.target;
    setVoteOptions(value);
  };

  const onClickCreateVoteSubmit = () => {
    console.log("제목", voteTitle);
    console.log("옵션", voteOptions.split(","));
    setCreateVote(false);
    setVoteTitle("");
    setVoteOptions("");
  };

  return (
    <div className="vote_wrapper">
      <div className="vote_header">
        <h3 className="vote_title">투표</h3>
        <button onClick={onClickCreateVote} className="vote_createBtn">
          ➕
        </button>
      </div>
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
      {createVote && (
        <div className="create_vote_popup">
          <button
            onClick={onClickCloseCreateVotePopUp}
            className="vote_popup_closeBtn"
          >
            ✕
          </button>
          <h1 className="create_vote_popup_title">투표 항목 생성</h1>
          <div className="create_vote_popup_content">
            <p className="create_vote_popup_content_title">투표 제목</p>
            <input
              className="create_vote_popup_content_input"
              type="text"
              value={voteTitle}
              onChange={onChangeInput}
            />
          </div>
          <p>각 항목 사이에 쉼표를 포함하여 작성해주세요.</p>
          <p>Ex) 메시,호날두,홀란드</p>
          <div className="create_vote_popup_content">
            <p className="create_vote_popup_content_title">선택 항목</p>
            <textarea
              className="create_vote_popup_content_textarea"
              value={voteOptions}
              onChange={onChangeTextarea}
            />
          </div>
          <button
            onClick={onClickCreateVoteSubmit}
            className="vote_popup_submitBtn create_vote_popup_btn"
          >
            제작하기
          </button>
        </div>
      )}
    </div>
  );
};
