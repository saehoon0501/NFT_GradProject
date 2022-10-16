import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { getVote } from "../../api/VoteApi";
import { currentUserDataState } from "../../store";

import "./VoteList.css";

export const VoteList = ({ setCurrentVoteContent, userData }) => {
  const [currentUserData, setCurrentUserData] =
    useRecoilState(currentUserDataState);

  const navigate = useNavigate();

  const { data, isLoading } = useQuery("votes", ({ signal }) =>
    getVote(signal)
  );

  const onClickVoteSubject = (voteData) => {
    setCurrentVoteContent(voteData);
    setCurrentUserData(userData);
    navigate(`/vote/${voteData._id}`);
  };

  const onClickCreateVote = () => {
    navigate("/vote/create");
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
        {data?.map((vote, index) => (
          <div
            key={index}
            className="vote_subject"
            onClick={() => onClickVoteSubject(vote)}
          >
            <p>{vote.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
