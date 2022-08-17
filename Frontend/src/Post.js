import React, { useState } from "react";
import "./Post.css";
import like_before from "./images/like-before.png";
import like_after from "./images/like-after.png";
import comment from "./images/comment.png";



function Post({username, caption, imageUrl, userPic }) {
  
  const [showMore, setShowMore] = useState(false);
  const [like, setLike] = useState(false);

  const handleLike = () =>{
    if(like){
      setLike(false);
    }
    else{
      setLike(true);
    }
  }

  const handleShow = () =>{
    if(showMore){
      setShowMore(false);
    }else{
      setShowMore(true);
    }
  }
  
  return (
    <div className="post" style={{display:"flex"}}>
    <div className="" style={{width:"500px"}}>
      {/* Image */}
      <div className="post_image">
        <img src={imageUrl} alt="post_image"/>
      </div>
      <div className="post_header" style={{display:"block"}}>
        <div style={{display:'flex'}}>
        <div className="post_avatar">
          <img 
              src={userPic}
              alt="profile picture"
              style={{width:"40px", height:"40px", borderRadius:"10px"}}
            />
        </div>
      <div style={{position:"relative", marginTop:"20px"}}>
          <h3>{username}</h3>
      </div>
        <div style={{position:"relative", marginLeft:"115px",display:"flex", marginTop:"10px", }}>
          <div>
            <h4>좋아요 n개</h4>
          </div>        
            {like?
            <div className="clickable_icon icon_anime2" style={{position:"relative", marginTop:"-3px", marginLeft:"10px"}}>
              <img src={like_after} onClick={handleLike}/>
            </div>
              :<div className="clickable" style={{position:"relative", marginTop:"-3px", marginLeft:"10px"}}>
                  <img src={like_before} onClick={handleLike}/>
              </div>      
          }
          <div className="clickable" style={{position:"relative", marginTop:"-3px", marginLeft:"10px"}}>
            <img src={comment} onClick={handleShow}/>
          </div>
          <div className="post__text">
            <span>n일 전</span>
          </div>
        </div>
        </div>        
        </div>
      </div>  
      {showMore?
        <div style={{width:"250px", marginLeft:"5px",maxWidth:"300px", maxHeight:"500px",
      border:"1px solid lightgray", borderTop:"1px solid lightgray", background:"white"}}>
        <div style={{width:"100%",overflow:"scroll",padding:"2% 0 0 2%", maxHeight:"100%",textAlign:"left"}}>
          {/* 유저이름 + 캡션 */}
          <div style={{marginBottom:"5px", padding:"0 0 10px 0"}}>
          <h4>{username} :</h4>
          <span>{caption}</span>
          </div>
          {/* 댓글 */}
          <div>
            <h4>댓글</h4>
          </div>
          <div>
            <h4>닉네임1 :</h4>
            <span>테스트 테스트 마이킅 테스트 ㄹㄴㅁㅇㄹㄴㅇㅁ</span>
          </div>
          <div>
            <h4>닉네임2 :</h4>
            <span>테스트 테스트 마이킅 테스트 ㄹㄴㅁㅇㄹㄴㅇㅁ</span>
          </div>
          <div>
            <h4>닉네임1 :</h4>
            <span>테스트 테스트 마이킅 테스트 ㄹㄴㅁㅇㄹㄴㅇㅁ 테스트  테스트 ㄹㄴㅁㅇㄹㄴㅇ</span>
          </div>
          <div>
            <h4>닉네임3 :</h4>
            <span>테스트 테스트 마이킅 테스트 ㄹㄴㅁㅇㄹㄴㅇㅁ</span>
          </div>
          <div>
            <h4>닉네임1 :</h4>
            <span>테스트 테스트 마이킅 테스트 ㄹㄴㅁㅇㄹㄴㅇㅁ</span>
          </div>
          <div>
            <h4>닉네임1 :</h4>
            <span>테스트 테스트 마이킅 테스트 ㄹㄴㅁㅇㄹㄴㅇㅁ</span>
          </div>
          <div>
            <h4>닉네임1 :</h4>
            <span>테스트 테스트 마이킅 테스트 ㄹㄴㅁㅇㄹㄴㅇㅁ</span>
          </div>
          <div>
            <h4>닉네임1 :</h4>
            <span>테스트 테스트 마이킅 테스트 ㄹㄴㅁㅇㄹㄴㅇㅁ</span>
          </div>
          <div>
            <h4>닉네임1 :</h4>
            <span>테스트 테스트 마이킅 테스트 ㄹㄴㅁㅇㄹㄴㅇㅁ</span>
          </div>
          <div>
            <h4>닉네임1 :</h4>
            <span>테스트 테스트 마이킅 테스트 ㄹㄴㅁㅇㄹㄴㅇㅁ</span>
          </div>
          <div>
            <h4>닉네임1 :</h4>
            <span>테스트 테스트 마이킅 테스트 ㄹㄴㅁㅇㄹㄴㅇㅁ</span>
          </div>
          <div>
            <h4>닉네임1 :</h4>
            <span>테스트 테스트 마이킅 테스트 ㄹㄴㅁㅇㄹㄴㅇㅁ</span>
          </div>
          <div>
            <h4>닉네임1 :</h4>
            <span>테스트 테스트 마이킅 테스트 ㄹㄴㅁㅇㄹㄴㅇㅁ</span>
          </div>
          <div>
            <h4>닉네임3 :</h4>
            <span>테스트 테스트 마이킅 테스트 ㄹㄴㅁㅇㄹㄴㅇㅁ</span>
          </div>
          <div>
            <h4>닉네임1 :</h4>
            <span>테스트 테스트 마이킅 테스트 ㄹㄴㅁㅇㄹㄴㅇㅁ</span>
          </div>
          <div>
            <h4>닉네임1 :</h4>
            <span>테스트 테스트 마이킅 테스트 ㄹㄴㅁㅇㄹㄴㅇㅁ</span>
          </div>
          <div>
            <h4>닉네임1 :</h4>
            <span>테스트 테스트 마이킅 테스트 ㄹㄴㅁㅇㄹㄴㅇㅁ</span>
          </div>
          <div>
            <h4>닉네임1 :</h4>
            <span>테스트 테스트 마이킅 테스트 ㄹㄴㅁㅇㄹㄴㅇㅁ</span>
          </div>
          <div>
            <h4>닉네임1 :</h4>
            <span>테스트 테스트 마이킅 테스트 ㄹㄴㅁㅇㄹㄴㅇㅁ</span>
          </div>
          <div>
            <h4>닉네임1 :</h4>
            <span>테스트 테스트 마이킅 테스트 ㄹㄴㅁㅇㄹㄴㅇㅁ</span>
          </div>
          <div>
            <h4>닉네임1 :</h4>
            <span>테스트 테스트 마이킅 테스트 ㄹㄴㅁㅇㄹㄴㅇㅁ</span>
          </div>
          <div>
            <h4>닉네임1 :</h4>
            <span>테스트 테스트 마이킅 테스트 ㄹㄴㅁㅇㄹㄴㅇㅁ</span>
          </div>
          <div>
            <h4>닉네임1 :</h4>
            <span>테스트 테스트 마이킅 테스트 ㄹㄴㅁㅇㄹㄴㅇㅁ</span>
          </div>
          <div>
            <h4>닉네임3 :</h4>
            <span>테스트 테스트 마이킅 테스트 ㄹㄴㅁㅇㄹㄴㅇㅁ</span>
          </div>
          <div>
            <h4>닉네임1 :</h4>
            <span>테스트 테스트 마이킅 테스트 ㄹㄴㅁㅇㄹㄴㅇㅁ</span>
          </div>
          <div>
            <h4>닉네임1 :</h4>
            <span>테스트 테스트 마이킅 테스트 ㄹㄴㅁㅇㄹㄴㅇㅁ</span>
          </div>
          <div>
            <h4>닉네임1 :</h4>
            <span>테스트 테스트 마이킅 테스트 ㄹㄴㅁㅇㄹㄴㅇㅁ</span>
          </div>
          <div>
            <h4>닉네임1 :</h4>
            <span>테스트 테스트 마이킅 테스트 ㄹㄴㅁㅇㄹㄴㅇㅁ</span>
          </div>
          <div>
            <h4>닉네임1 :</h4>
            <span>테스트 테스트 마이킅 테스트 ㄹㄴㅁㅇㄹㄴㅇㅁ</span>
          </div>
          <div>
            <h4>닉네임1 :</h4>
            <span>테스트 테스트 마이킅 테스트 ㄹㄴㅁㅇㄹㄴㅇㅁ</span>
          </div>
          <div>
            <h4>닉네임1 :</h4>
            <span>테스트 테스트 마이킅 테스트 ㄹㄴㅁㅇㄹㄴㅇㅁ</span>
          </div>
          <div>
            <h4>닉네임1 :</h4>
            <span>테스트 테스트 마이킅 테스트 ㄹㄴㅁㅇㄹㄴㅇㅁ</span>
          </div>
          <div>
            <h4>닉네임1 :</h4>
            <span>테스트 테스트 마이킅 테스트 ㄹㄴㅁㅇㄹㄴㅇㅁ</span>
          </div>
        </div>
        <div style={{display:"flex",width:"100.5%", height:"10%", margin:"0", padding:"1%", position:"relative", marginLeft:"0px",        
        marginTop:"0px",justifyContent:"center", zIndex:"1", border:"1px solid lightgray"}}>
          <textarea name={"댓글달기"} placeholder={"댓글달기"}
          style={{width:"80%",verticalAlign:"center", height:"100%", border:"none", padding:"0", boxSizing:"border-box",
          resize:"none", marginRight:"0px", outline:"none" }}>
          </textarea>
          <div style={{width:"20%", justifyContent:"center", alignItems:"center", display:"flex", background:"white"}}>
            <input type={"button"} value={"게시"} style={{padding:"0 5px"}}></input>
          </div>
        </div>
      </div>
      :<div></div>
      }
      {/* Username + caption + commentsNum */}
     
      {/* 댓글 작성 기능 */}
      
    </div>
    
  );
}

export default Post;