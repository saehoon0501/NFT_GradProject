import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTypedVote } from "../../api/VoteApi";

import "./style.css";

export const CreateVote = () => {
  const [voteTitle, setVoteTitle] = useState("");
  const [voteOptions, setVoteOptions] = useState("");

  const navigate = useNavigate();

  const onChangeInput = (event) => {
    const { value } = event.target;
    setVoteTitle(value);
  };

  const onChangeTextarea = (event) => {
    const { value } = event.target;
    setVoteOptions(value);
  };

  const onClickCreateVoteSubmit = () => {
    createTypedVote(voteTitle, voteOptions.split(","));
    setVoteTitle("");
    setVoteOptions("");
    navigate("/");
  };

  return (
    <div className="create_vote_wrapper">
      <h1 className="create_vote_title">투표 항목 생성</h1>
      <div className="create_vote_content">
        <p className="create_vote_content_title">투표 제목</p>
        <input
          className="create_vote_content_input"
          type="text"
          value={voteTitle}
          onChange={onChangeInput}
        />
      </div>
      <div className="create_vote_example">
        <p>각 항목 사이에 쉼표를 포함하여 작성해주세요.</p>
        <p>Ex) 메시,호날두,홀란드</p>
      </div>
      <div className="create_vote_content">
        <p className="create_vote_content_title">선택 항목</p>
        <textarea
          className="create_vote_content_textarea"
          value={voteOptions}
          onChange={onChangeTextarea}
        />
      </div>
      <button
        onClick={onClickCreateVoteSubmit}
        className="vote_submitBtn create_vote_btn"
      >
        제작하기
      </button>
    </div>
  );
};
