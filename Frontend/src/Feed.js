import React, { useState } from "react";
import "./Feed.css";
import like_before from "./images/like-before.png";
import like_after from "./images/like-after.png";
import comment from "./images/comment.png";
import parse from 'html-react-parser';
import 'react-quill/dist/quill.core.css';



function Feed({username, caption, title, userPic, likes, comments }) {
  
  const [showMore, setShowMore] = useState(false);
  const [like, setLike] = useState(false);

  const handleLike = () =>{
    setLike(prev=>!prev);
  }

  const handleShow = () =>{
    if(showMore){
      setShowMore(false);
    }else{
      setShowMore(true);
    }
  }
  
  return (
    <div className="feed" style={{display:"block", border:"1px solid lightgray", borderRadius:"5px"}}>
        <div className="" style={{width:"500px", maxHeight:"500px",overflow:"hidden"}}>
            <div className="feed_header" style={{display:"block"}}>
                <div style={{display:'flex'}}>
                    <div className="feed_avatar">
                        <img 
                            src={userPic}
                            alt="profile picture"
                            style={{width:"40px", height:"40px", borderRadius:"10px"}}
                            />            
                    </div>
                    <div style={{position:"relative", marginLeft:"5px",display:"flex", marginTop:"10px" }}>
                        <div>
                            <h3>{username}</h3>
                        </div>
                        <div className="post__text">
                            <span>n일 전</span>
                        </div>
                    </div>
                </div>        
            </div>
        <div style={{maxHeight:"450px"}}>
            {/* Title */}
            <div style={{textAlign:"left", padding:"10px 10px 10px 80px", position:"relative", marginTop:"-40px"}}>
                    <h2 style={{lineHeight:"22px"}}>{title}</h2>
            </div>
            {/* Content */}
            <div className="ql-editor ql-image" style={{textAlign:"left", padding:"10px 10px 10px 10px"}}>
                {parse(caption)}        
            </div>
        </div>
      </div>
      {/* INFO */}
      <div style={{display:"flex", padding:"10px 10px 5px 15px"}}>
        <div>
            <h4>댓글 {comments.comments.length}개</h4>
        </div>
        <div className="clickable" style={{position:"relative", margin:"-3px 5px 0 5px"}}>
                <img src={comment} onClick={handleShow}/>
        </div>
        <div>
            <h4>좋아요 {likes.liked_num}개</h4>
        </div>        
            {like?
            <div className="clickable_icon icon_anime2" style={{position:"relative", marginTop:"-3px", marginLeft:"10px"}}>
              <img src={like_after} onClick={handleLike}/>
            </div>
              :<div className="clickable" style={{position:"relative", marginTop:"-3px", marginLeft:"10px"}}>
                  <img src={like_before} onClick={handleLike}/>
              </div>      
            }
        </div>         
    </div>
  );
}

export default Feed;