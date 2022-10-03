import { useEffect, useRef, useState } from "react";
import {
  addReply,
  delComment,
  likeComment,
  modifyReply,
} from "../../api/FeedApi";
import commentImg from "../../assets/comment.png";
import like_before from "../../assets/like-before.png";
import like_after from "../../assets/like-after.png";
import { Reply } from "./Reply";

import "./Comment.css";

export const Comment = ({
  user_id,
  comment_id,
  index,
  writer,
  replies,
  caption,
  liked_user,
}) => {
  const [like, setLike] = useState({
    liked: false,
    liked_user: liked_user,
  });
  const [toReply, setToReply] = useState({
    reply: false,
    modify: false,
  });
  const [replyList, setReplyList] = useState(replies);
  const [value, setValue] = useState();
  const [isOwner, setIsOwner] = useState(false);
  const [context, setContext] = useState(caption);

  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${Math.max(
        textareaRef.current.scrollHeight,
        47
      )}px`;
    }

    // if (
    //   writer._id === user_id &&
    //   isOwner === false &&
    //   writer.profile.comment_ids.includes(comment_id)
    // ) {
    //   setIsOwner(true);
    // }

    if (liked_user.includes(user_id) && like.liked === false) {
      setLike((prev) => ({ ...prev, liked: true }));
    }
  }, [value]);

  const handleLike = () => {
    if (!like.liked) {
      likeComment(comment_id, index).then((res) => {
        console.log(res.data.length);
        if (res.data.includes(user_id)) {
          setLike({ liked: true, liked_user: res.data });
        }
      });
    }
  };

  const handleReply = (event) => {
    addReply(comment_id, value, index).then((res) => {
      console.log(res.data);
      setReplyList(res.data);
    });
    setValue("");
  };

  const handleModify = (event) => {
    modifyReply(comment_id, value, index).then((res) => {
      console.log(res.data);
      setContext(res.data.caption);
    });
    setValue("");
  };

  const handleDelete = () => {
    delComment(comment_id, index).then((res) => {
      console.log(res.data);
    });
  };

  const onClickReply = () => {
    setToReply({ reply: !toReply.reply, modify: false });
    setValue("");
  };

  const onClickModify = () => {
    setToReply({ reply: !toReply.reply, modify: true });
    setValue(caption);
  };

  return (
    <div>
      <div className="comment-page-wrapper">
        <img
          className="comment-page-profile-img"
          src={writer?.profile.profile_pic}
          alt="comment_profilePic"
        />
        <div>
          <h5>{writer?.profile.username} · n 시간 전</h5>
          <p className="comment_context">{context}</p>
          <div className="comment_page_menus">
            <div className="comment_page_button" onClick={onClickReply}>
              <img src={commentImg} />
              <h5>Reply</h5>
            </div>
            <div className="comment_page_button">
              {like.liked ? (
                <img src={like_after} onClick={handleLike} />
              ) : (
                <img src={like_before} onClick={handleLike} />
              )}
              <h5>
                {like.liked_user === undefined ? 0 : like.liked_user.length}개
              </h5>
            </div>
            {isOwner && (
              <div className="comment_page_button">
                <h5 onClick={onClickModify}>수정</h5>
                <h5 onClick={handleDelete}>삭제</h5>
              </div>
            )}
          </div>
        </div>
      </div>
      {toReply.reply && (
        <div className="modify_comment">
          {toReply.modify ? <h4>답글 수정</h4> : <h4>답글 달기</h4>}
          <textarea
            className="modify_comment_textarea"
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            placeholder="매너있는 댓글 작성 부탁드립니다."
          />
          <button
            onClick={toReply.modify ? handleModify : handleReply}
            className="modify_btn"
          >
            완료
          </button>
        </div>
      )}
      {replyList.length > 0 ? (
        <div
          style={{
            padding: "0 0 0 50px",
            color: "rgb(178, 178, 178)",
            display: "flex",
          }}
        >
          <div className="comment_dash"></div>
          <p>답글</p>
          <div className="comment_dash"></div>
        </div>
      ) : (
        <div></div>
      )}
      {replyList[0].user &&
        replyList.map((replyItem, index) => {
          return (
            <Reply
              key={index}
              comment_id={comment_id}
              comment_index={index}
              user_id={user_id}
              writer={replyItem.user}
              caption={replyItem.caption}
              liked_user={replyItem.liked_user}
              setReplyList={setReplyList}
            />
          );
        })}
    </div>
  );
};
