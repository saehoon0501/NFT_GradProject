import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { createTypedVote, getVote } from "../../api/VoteApi";
import { PopUp } from "../../components/common/PopUp";

import "./style.css";

export const CreateVote = () => {
  const [voteTitle, setVoteTitle] = useState("");
  const [voteOptions, setVoteOptions] = useState("");
  const [showPopUp, setShowPopUp] = useState(false);

  const navigate = useNavigate();

  const { refetch } = useQuery("votes", ({ signal }) => getVote(signal));

  const onChangeInput = (event) => {
    const { value } = event.target;
    setVoteTitle(value);
  };

  const onChangeTextarea = (event) => {
    const { value } = event.target;
    setVoteOptions(value);
  };

  const onClickCreateVoteSubmit = () => {
    setShowPopUp(true);
  };

  const onClickSubmit = async () => {
    setShowPopUp(false);
    await createTypedVote(voteTitle, voteOptions.split(","));
    await refetch();
    setVoteTitle("");
    setVoteOptions("");
    navigate("/");
  };

  const onClickCancel = () => {
    setShowPopUp(false);
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
          placeholder="생성할 투표의 제목을 입력해주세요."
        />
      </div>
      <div className="create_vote_content">
        <p className="create_vote_content_title">선택 항목</p>
        <textarea
          className="create_vote_content_textarea"
          value={voteOptions}
          onChange={onChangeTextarea}
          placeholder={`각 항목 사이에 쉼표를 포함하여 작성해주세요. Ex) 메시,호날두,홀란드`}
        />
      </div>
      <button
        onClick={onClickCreateVoteSubmit}
        className="vote_submitBtn create_vote_btn"
      >
        제작하기
      </button>
      {showPopUp && (
        <PopUp
          title={"투표를 생성하시겠습니까?"}
          onClickSubmit={onClickSubmit}
          onClickCancel={onClickCancel}
        />
      )}
    </div>
  );
};
