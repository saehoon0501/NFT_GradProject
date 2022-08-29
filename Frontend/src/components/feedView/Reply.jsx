import { useEffect, useRef, useState } from "react";
import { addReply, delReply, likeReply } from "../../api/FeedApi";
import commentImg from "../../assets/comment.png";
import like_before from "../../assets/like-before.png";
import like_after from "../../assets/like-after.png";
import { Button } from "@mui/material";

export const Reply = ({
  user_id,
  comment_id,
  comments_id,
  comment_index,
  reply_index,
  writer,
  caption,
  liked_user,
  setReplyList,
}) => {
  const [like, setLike] = useState({
    liked: false,
    liked_user: liked_user,
  });
  const [value, setValue] = useState("");
  const [toReply, setToReply] = useState({
    reply: false,
    modify: false,
  });
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

    if (
      writer._id === user_id &&
      isOwner === false &&
      writer.profile.comments_ids.includes(comment_id)
    ) {
      setIsOwner(true);
    }

    if (liked_user.includes(user_id)) {
      setLike((prev) => ({ ...prev, liked: true }));
    }
  }, [value, toReply]);

  const handleLike = () => {
    if (!like.liked) {
      likeReply(comments_id, comment_index, reply_index).then((res) => {
        console.log(res.data.length);
        if (res.data.includes(user_id)) {
          setLike({ liked: true, liked_user: res.data });
        }
      });
    }
  };

  const handleReply = (event) => {
    event.preventDefault();
    console.log(value);
    addReply(comments_id, value, comment_index).then((res) => {
      console.log(res.data);
      setReplyList(res.data);
    });
    setValue("");
  };

  const handleDelete = () => {
    delReply(comments_id, comment_index, reply_index).then((res) => {
      console.log(res.data);
      setReplyList(res.data);
    });
  };

  return (
    <div style={{ display: "block" }}>
      <div className="commenter" style={{ padding: "0 0 0 50px" }}>
        <img src={writer.profile.profile_pic} alt="comment_profilePic" />
        <div style={{ display: "block", width: "90%" }}>
          <div style={{ display: "flex" }}>
            <h5>{writer.profile.username}</h5>
            <h5> · </h5>
            <h5>n 시간 전</h5>
          </div>
          <div className="comment_context" style={{ maxWidth: "100%" }}>
            <p>{`@${writer.profile.username}` + "\u00a0\u00a0" + caption}</p>
          </div>
          <div style={{ display: "flex" }}>
            <div
              className="clickable comment_button"
              onClick={() => {
                setToReply({ reply: !toReply.reply, modify: false });
                setValue("");
              }}
              style={{ position: "relative", margin: "-6px 0px 0 -5px" }}
            >
              <img src={commentImg} />
            </div>
            <div
              className="clickable"
              onClick={() => {
                setToReply({ reply: !toReply.reply, modify: false });
                setValue("");
              }}
            >
              <h5>Reply</h5>
            </div>
            <h5> </h5>
            {like.liked ? (
              <div
                className="clickable icon_anime2 comment_button"
                style={{ position: "relative", marginTop: "px" }}
              >
                <img src={like_after} onClick={handleLike} />
              </div>
            ) : (
              <div
                className="clickable comment_button"
                style={{ position: "relative", marginTop: "-6px" }}
              >
                <img src={like_before} onClick={handleLike} />
              </div>
            )}
            <h5>
              {like.liked_user == undefined ? 0 : like.liked_user.length}개
            </h5>
            {isOwner ? (
              <div style={{ display: "flex" }}>
                <div
                  className="clickable"
                  onClick={() => {
                    setToReply({ reply: !toReply.reply, modify: true });
                    setValue(caption);
                  }}
                >
                  <h5>
                    {"\u00a0"}수정{"\u00a0"}
                  </h5>
                </div>
                <div className="clickable" onClick={handleDelete}>
                  <h5>삭제</h5>
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
      {toReply.reply ? (
        <div className="comment" style={{ maxWidth: "100%" }}>
          {toReply.modify ? <h4>답글 수정</h4> : <h4>답글 달기</h4>}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            placeholder="매너있는 댓글 작성 부탁드립니다."
          ></textarea>
          <div style={{ textAlign: "right" }}>
            <Button
              onClick={handleReply}
              sx={{
                backgroundColor: "#26a7de",
                margin: "5px 0px 0px 0px",
                padding: "0 15px",
                color: "white",
              }}
            >
              완료
            </Button>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};
