import { useEffect, useRef, useState } from "react";
import { addReply, likeComment, unLikeComment } from "../../api/FeedApi";
import commentImg from "../../assets/comment.png";
import like_before from "../../assets/like-before.png";
import like_after from "../../assets/like-after.png";
import { Reply } from "./Reply";

import "./Comment.css";
import { elapsedTimePeriod } from "../../utils";

export const Comment = ({
  user_id,
  comment_id,
  liked_num,
  writer,
  replies,
  caption,
  liked_user,
  refetchComments,
  updatedAt,
  postId,
  reply_likes,
}) => {
  const [like, setLike] = useState({
    liked: false,
    liked_num: liked_num,
  });
  const [toReply, setToReply] = useState({
    reply: false,
    modify: false,
  });
  const [value, setValue] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${Math.max(
        textareaRef.current.scrollHeight,
        47
      )}px`;
    }

    if (writer === user_id) {
      setIsOwner(true);
    }

    if (liked_user) {
      setLike((prev) => ({ ...prev, liked: true }));
    }
    console.log(liked_user);
  }, [value]);

  const handleLike = () => {
    if (!like.liked) {
      likeComment(comment_id).then((res) => {
        if (res.data.result === "OK") {
          setLike({ liked: true, liked_num: like.liked_num + 1 });
        }
      });
    } else {
      unLikeComment(comment_id).then((res) => {
        if (res.data.result === "OK") {
          setLike({ liked: false, liked_num: like.liked_num - 1 });
        }
      });
    }
  };

  const handleReply = async () => {
    await addReply(comment_id, value);
    setToReply({ reply: !toReply.reply, modify: toReply.modify });
    refetchComments();
    setValue("");
  };

  const onClickReply = () => {
    setToReply({ reply: !toReply.reply, modify: false });
    setValue("");
  };

  const onClickModify = () => {
    setToReply({ reply: !toReply.reply, modify: true });
    setValue(caption);
  };

  console.log("replies", replies);
  return (
    <div className="comment-wrapper">
      <div className="comment-page-wrapper">
        <img
          className="comment-page-profile-img"
          src={writer?.profile_pic}
          alt="comment_profilePic"
        />
        <div>
          <h5>
            {writer?.username} · {elapsedTimePeriod(updatedAt)}
          </h5>
          <p className="comment_context">{caption}</p>
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
              <h5>{like.liked_num}개</h5>
            </div>
            {/* {isOwner && (
              <div className="comment_page_button">
                <h5 onClick={onClickModify}>수정</h5>
                <h5 onClick={handleDelete}>삭제</h5>
              </div>
            )} */}
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
          <button onClick={handleReply} className="modify_btn">
            완료
          </button>
        </div>
      )}
      {replies.length > 0 ? (
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
      {replies[0] &&
        replies.map((replyItem, replyIndex) => {
          console.log(replyItem);
          {
            return (
              <Reply
                key={replyIndex}
                comment_id={comment_id}
                comment_index={replyIndex}
                user_id={user_id}
                writer={replyItem.user}
                caption={replyItem.context}
                liked_user={replyItem.like.liked_user}
                liked_num={replyItem.like.liked_num}
                refetchComments={refetchComments}
                reply_id={replyItem._id}
                updatedAt={replyItem.updatedAt}
              />
            );
          }
        })}
    </div>
  );
};
