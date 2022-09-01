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
import { Button } from "@mui/material";
import { Reply } from "./Reply";

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

    if (
      writer._id === user_id &&
      isOwner === false &&
      writer.profile.comments_ids.includes(comment_id)
    ) {
      setIsOwner(true);
    }

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

  return (
    <div style={{ display: "block" }}>
      <div className="commenter">
        <img src={writer.profile.profile_pic} alt="comment_profilePic" />
        <div style={{ display: "block" }}>
          <div style={{ display: "flex" }}>
            <h5>{writer.profile.username}</h5>
            <h5> · </h5>
            <h5>n 시간 전</h5>
          </div>
          <div className="comment_context">
            <p>{context}</p>
          </div>
          <div style={{ display: "flex" }}>
            <div
              className="clickable comment_button"
              onClick={() => {
                setToReply({ reply: !toReply.reply, modify: false });
                setValue("");
              }}
              style={{
                display: "flex",
                position: "relative",
                margin: "-6px 0px 0 -5px",
              }}
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
                style={{ position: "relative", marginTop: "-6px" }}
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
        <div className="comment">
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
              onClick={toReply.modify ? handleModify : handleReply}
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
      {replyList.length > 0 ? (
        <div
          style={{
            padding: "0 0 0 50px",
            color: "rgb(178, 178, 178)",
            display: "flex",
          }}
        >
          <div class="_a9yh"></div>
          <p>답글</p>
          <div class="_a9yh"></div>
        </div>
      ) : (
        <div></div>
      )}
      {replyList.map((replyItem, reply_index) => {
        return (
          <Reply            
            comment_id={comment_id}
            comment_index={index}
            reply_index={reply_index}
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
