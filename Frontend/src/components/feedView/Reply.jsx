import { useEffect, useRef, useState } from "react";
import { addReply, likeComment, unLikeComment } from "../../api/FeedApi";
import { certainUser } from "../../api/UserApi";
import commentImg from "../../assets/comment.png";
import like_before from "../../assets/like-before.png";
import like_after from "../../assets/like-after.png";

import "./Reply.css";
import { elapsedTimePeriod } from "../../utils";

export const Reply = ({
  user_id,
  comment_id,
  writer,
  caption,
  liked_user,
  liked_num,
  reply_id,
  refetchComments,
  updatedAt,
  isModified,
}) => {
  const [like, setLike] = useState({
    liked: false,
    liked_num: liked_num,
  });
  const [value, setValue] = useState("");
  const [toReply, setToReply] = useState({
    reply: false,
    modify: false,
  });
  const [isOwner, setIsOwner] = useState(false);
  const [user, setUser] = useState({});

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

    async function fetchUser() {
      const user = await certainUser(writer);
      setUser(user);
    }
    fetchUser();
  }, [value, toReply]);

  const handleLike = () => {
    if (!like.liked) {
      likeComment(reply_id).then((res) => {
        console.log(res.data.result);
        if (res.data.result === "OK") {
          setLike({ liked: true, liked_num: like.liked_num + 1 });
        }
      });
    } else {
      unLikeComment(reply_id).then((res) => {
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

  return (
    <div>
      <div className="reply_wrapper">
        <img
          className="comment-page-profile-img"
          src={user.profile_pic}
          alt="comment_profilePic"
        />
        <div>
          <h5>
            {user?.username} · {elapsedTimePeriod(updatedAt)}{" "}
            {isModified > 0 && "*수정됨"}
          </h5>
          <p className="comment_context">{caption}</p>
          <div className="comment_page_menus">
            {/* <div className="comment_page_button" onClick={onClickReply}>
              <img src={commentImg} />
              <h5>Reply</h5>
            </div> */}
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
      {/* {toReply.reply && (
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
      )} */}
    </div>
  );
};
