import React, { useState } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import img from "./images/user.png";

function Comments() {
  
  // return(

  // );
}

function Post({username, caption, imageUrl }) {
  
  const [showMore, setShowMore] = useState(false);
  const [text, setText] = useState("");

  const handleText = (event) => {
    setText(event.target.value);
  }

  return (
    <div className="post">
      <div className="post__header">
        {/* Header: avatar with username */}
        <Avatar
          className="post__avatar"
          alt={username}
          src={img}
        />
        <h3>{username}</h3>
      </div>
      {/* Image */}
      <img className="post__image" src={imageUrl} alt="" />
      <div>

      </div>
      <div className="post__text">
        좋아요
      </div>
      {/* Username + caption + commentsNum */}
      <div style={{width:"100%", wordWrap:"break-word"}}>
        <h4 className="post__text">
          <strong>{username} </strong>
          {(caption.length>51 && !showMore)?<span className="clickable" onClick={()=>{setShowMore(true)}}>
          ... 더보기</span>
          :<span>{caption}</span>}
        </h4>
      </div>
      <div className="post__text">
        <span className="clickable">댓글 모두 보기</span>
      </div>
      <div className="post__text">
        <span>n일 전</span>
      </div>
      {/* 댓글 작성 기능 */}
      <div style={{display:"flex",width:"100%", height:"40px", margin:"3px auto", padding:"8px 10px",
       borderTop: "1px solid lightgray", justifyContent:"center"}}>
       <img src=""/>
        <textarea name={"댓글달기"} onClick={(event)=>handleText(event)} placeholder={"댓글달기"}
        style={{width:"80%",verticalAlign:"center", height:"100%", border:"none", padding:"0", boxSizing:"border-box",resize:"none"}}>
        </textarea>
        <div style={{width:"10px"}}>
          <input type={"button"} value={"게시"} style={{padding:"0 10px", margin:"auto 5px"}}></input>
        </div>
      </div>
    </div>
  );
}

export default Post;